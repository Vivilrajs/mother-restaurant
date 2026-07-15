import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
export const metadata = { title: 'Blog & News — The Mother Restaurant' };

async function getPosts() {
  try { const db = await getDb(); return await db.collection('blog_posts').find({ status:'Published' }).sort({ createdAt:-1 }).toArray(); }
  catch { return []; }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Blog & <span style={{color:'#d98f7c'}}>News</span></h1>
          <p className="text-white/80 text-xl">Stories from our kitchen to your heart</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 && <div className="text-center py-20 text-muted">No posts published yet.</div>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post._id.toString()} href={`/blog/${post._id}`} className="menu-card group rounded-2xl overflow-hidden bg-white dark:bg-[#1f1816] shadow-md border border-brand-600/10 block">
                {post.featuredImage && (
                  <div className="relative overflow-hidden aspect-video">
                    <img src={post.featuredImage} className="menu-img w-full h-full object-cover" alt={post.title} />
                    <div className="absolute top-4 left-4 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">{post.category}</div>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-brand-600 text-xs mb-2 font-sc">{new Date(post.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})}</p>
                  <h2 className="font-serif text-xl font-bold mb-3 text-heading group-hover:text-brand-600 transition">{post.title}</h2>
                  <p className="text-muted text-sm mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">By {post.author}</span>
                    {post.readTime && <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full">{post.readTime}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
