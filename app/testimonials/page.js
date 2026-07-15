'use client';
import { useState, useEffect } from 'react';
import TestimonialSlider from '@/components/home/TestimonialSlider';

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', rating: 5, text: '', role: '', source: 'Website' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?status=approved');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'pending' })
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ customerName: '', rating: 5, text: '', role: '', source: 'Website' });
        setTimeout(() => {
          setModalOpen(false);
          setSuccess(false);
        }, 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">What Our <span style={{color:'#d98f7c'}}>Guests</span> Say</h1>
          <p className="text-white/80 text-xl mb-8">Real stories from real families who dined with us.</p>
          <button onClick={() => setModalOpen(true)} className="btn-premium px-8 py-3.5 rounded-full font-bold text-sm">
            Write a Review
          </button>
        </div>
      </div>

      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">Loading testimonials...</div>
          ) : (
            <>
              {reviews.length > 0 && <div className="mb-16"><TestimonialSlider reviews={reviews} /></div>}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {reviews.map(r => (
                  <div key={r._id.toString()} className="glass-card rounded-2xl p-6 hover:shadow-lg transition duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center font-serif font-bold text-white text-xl">
                        {r.customerName?.[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-heading">{r.customerName}</div>
                        {r.role && <div className="text-xs text-muted">{r.role}</div>}
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(r.rating || 5)].map((_,i) => <i key={i} className="fas fa-star text-brand-600 text-sm"></i>)}
                    </div>
                    <p className="text-muted text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                    {r.source && <p className="text-[10px] text-brand-600/80 mt-3 font-semibold uppercase tracking-wider">via {r.source}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="admin-modal active z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm fixed inset-0">
          <div className="bg-[#fdfbf7] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-brand-600/20" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b border-brand-600/10 flex justify-between items-center z-10">
              <h2 className="font-serif text-xl font-bold text-brand-700">Write a Review</h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold">
                  Thank you! Your review has been submitted for approval.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1 text-gray-600">Your Name</label>
                <input type="text" required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="form-input bg-white text-sm" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-600">Title / Profession (e.g. Regular Guest, Food Critic)</label>
                <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="form-input bg-white text-sm" placeholder="e.g. Regular Guest" />
              </div>
              
              <div>
                <label className="block text-xs font-bold mb-2 text-gray-600 font-sans">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="text-2xl transition hover:scale-110"
                    >
                      <i className={`fas fa-star ${star <= formData.rating ? 'text-brand-600' : 'text-gray-300'}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-gray-600">Your Review</label>
                <textarea required value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="form-input bg-white text-sm" rows="4" placeholder="Share your dining experience..."></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-premium px-8 py-2.5 rounded-lg font-bold text-xs disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
