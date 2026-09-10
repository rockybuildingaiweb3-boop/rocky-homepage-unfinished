import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, BlogPost } from '../../../data/blogData';

export const StudioBlog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPost) {
        setSelectedPost(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 select-none">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="font-mono text-xs text-purple-300 tracking-[0.24em] uppercase">
              STUDIO &bull; ESSAYS &amp; THOUGHTS
            </span>
            <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200">
              03 ENTRIES
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-[-0.035em] text-white"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            critical engineering notes
          </h2>
          <p className="mt-3 text-sm text-white/60 font-mono max-w-xl leading-relaxed">
            Reflections on physical dynamics in web software, spatial graphics contracts, and designing with latent intelligence.
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
            CHRONOLOGICAL ARCHIVE &bull; 2026
          </span>
        </div>
      </div>

      {/* Essays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            data-cursor="pointer"
            className="group relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-400/40 p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-950/20"
          >
            <div>
              {/* Meta Pill & Read Time */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-[10px] tracking-widest uppercase text-purple-300/80 px-2 py-0.5 rounded border border-purple-400/20 bg-purple-500/5">
                  {post.category}
                </span>
                <span className="font-mono text-[11px] text-white/40 tracking-wider">
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-xl sm:text-2xl font-normal text-white group-hover:text-purple-200 transition-colors leading-snug"
                style={{ fontFamily: 'var(--title-font)' }}
              >
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-3 text-xs sm:text-[13px] text-white/60 leading-relaxed font-light">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
              <span className="font-mono text-[11px] text-white/40 tracking-wider">
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-purple-300/80 group-hover:text-white group-hover:translate-x-1 transition-all">
                <span>read essay</span>
                <span>&rarr;</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Reading Modal for Selected Post */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedPost(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0c0c10] p-6 sm:p-10 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-purple-300 tracking-widest uppercase">
                <span>{selectedPost.category}</span>
                <span>&bull;</span>
                <span className="text-white/40">{selectedPost.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                data-cursor="pointer"
                className="text-white/60 hover:text-white text-2xl font-light w-8 h-8 rounded-full border border-white/15 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close essay"
              >
                &times;
              </button>
            </div>

            {/* Title */}
            <h2
              className="text-2xl sm:text-3xl font-normal text-white leading-snug"
              style={{ fontFamily: 'var(--title-font)' }}
            >
              {selectedPost.title}
            </h2>

            {/* Body Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-white/80 leading-relaxed font-light">
              {selectedPost.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Tags Footer */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] text-white/50 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioBlog;
