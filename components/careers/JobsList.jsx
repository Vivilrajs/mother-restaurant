'use client';
import { useState } from 'react';
import ApplyModal from '@/components/careers/ApplyModal';

export default function JobsList({ jobs }) {
  const [applyingTo, setApplyingTo] = useState(null);

  return (
    <>
      <div className="space-y-4">
        {jobs.map((job,i) => (
          <div key={i} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition duration-200 group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-heading group-hover:text-brand-600 transition">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-medium">{job.dept}</span>
                  <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium">{job.type}</span>
                  <span className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium"><i className="fas fa-map-marker-alt mr-1"></i>{job.location}</span>
                </div>
                <p className="text-muted text-sm mt-2">{job.desc}</p>
              </div>
              <button onClick={() => setApplyingTo(job.title)} className="btn-premium px-6 py-2.5 rounded-full text-sm font-semibold flex-shrink-0">Apply Now</button>
            </div>
          </div>
        ))}
      </div>
      {applyingTo && <ApplyModal jobTitle={applyingTo} onClose={() => setApplyingTo(null)} />}
    </>
  );
}
