import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';

async function getPost(id) {
  try {
    const db = await getDb();
    const post = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
    if (!post || post.status !== 'Published') return null;
    return post;
  } catch { return null; }
}

async function getRelated(post) {
  try {
    const db = await getDb();
    return await db.collection('blog_posts')
      .find({ status: 'Published', category: post.category, _id: { $ne: post._id } })
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  return { title: post ? `${post.title} — The Mother Restaurant` : 'Blog Post' };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  const related = await getRelated(post);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-warm">
      <Link href="/blog" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 transition mb-8 font-semibold">
        <i className="fas fa-arrow-left"></i> Back to Blog
      </Link>
      <article>
        {post.featuredImage && (
          <img src={post.featuredImage} className="w-full aspect-[21/9] object-cover rounded-2xl mb-8" alt={post.title} />
        )}
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">{post.category}</span>
          <span className="text-muted text-sm">{new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          {post.readTime && <span className="text-muted text-sm">• {post.readTime}</span>}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-heading">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-brand-600/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center font-bold text-white">
            {post.author?.[0] || 'A'}
          </div>
          <div>
            <div className="font-semibold text-heading">{post.author}</div>
            <div className="text-sm text-muted">Contributor</div>
          </div>
        </div>
        <div className="max-w-none">
          {post.content.split('\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-lg leading-relaxed mb-6 text-body">{para}</p>
          ))}
        </div>
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-brand-600/20">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-brand-600/10 rounded-full text-sm text-body">#{tag}</span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <div className="mt-16">
          <h3 className="font-serif text-2xl font-bold mb-6 text-heading">Related Posts</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map(r => (
              <Link key={r._id.toString()} href={`/blog/${r._id}`} className="menu-card block">
                {r.featuredImage && (
                  <img src={r.featuredImage} className="w-full aspect-[16/9] object-cover rounded-xl mb-3" alt={r.title} />
                )}
                <h4 className="font-serif text-lg font-bold text-heading">{r.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
