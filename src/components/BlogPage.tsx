import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Calendar, Clock, Tag, Search, ArrowRight, Share2, 
  Lightbulb, TrendingUp, CheckCircle, ChevronRight, X, User, ThumbsUp
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  content: string[];
  keyTakeaways: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'demat-sip-scaling-guide-2026',
    title: 'How Top Publishers Earn ₹50,000+ Monthly with Demat & SIP Campaigns in India',
    excerpt: 'A comprehensive playbook on generating high-converting demat account openings and SIP investments using targeted social and community marketing.',
    category: 'Earning Strategies',
    readTime: '6 min read',
    date: 'September 10, 2026',
    author: 'PAI Growth Team',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    keyTakeaways: [
      'Focus on audience education: Explain brokerage savings and zero AMC benefits.',
      'Document-based SIP offers higher conversion rates for first-time investors.',
      'Ensure leads complete the initial trade requirement immediately to lock in top CPA payouts.'
    ],
    content: [
      'Performance marketing in the Indian financial sector has exploded in recent years. With millions of new retail investors entering the stock market and mutual fund ecosystem every quarter, fintech brands are actively investing in verified user acquisition.',
      'As a Public Ads India publisher, you have direct access to highest-paying Demat and Mutual Fund campaigns including AngelOne, ICICI MF SIP, Jainam Broking, and Kotak MF. The secret to consistent four-to-five figure monthly payouts lies in targeted audience nurturing.',
      'Rather than broadcasting generic links, top-performing affiliates build targeted WhatsApp discussion groups, Telegram market commentary channels, and Instagram carousel guides breaking down the exact step-by-step account activation flow.',
      'When your referral understands why KYC verification is mandatory and receives instant assistance with their initial trade or ₹100 SIP deposit, conversion rates increase by up to 340% with zero rejection rates.'
    ]
  },
  {
    id: 'cpa-vs-cpl-fintech-breakdown',
    title: 'CPA vs CPL in Indian Affiliate Networks: Maximizing Your Return on Traffic',
    excerpt: 'Understand the core differences between Cost Per Action and Cost Per Lead models to choose the most profitable campaigns for your audience.',
    category: 'Industry Insights',
    readTime: '4 min read',
    date: 'September 05, 2026',
    author: 'Ad Operations Desk',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    keyTakeaways: [
      'CPA campaigns offer substantially higher single-conversion payouts (₹200 - ₹600+).',
      'CPL generates quicker preliminary triggers but lower revenue per verified user.',
      'Hybrid tracking with genuine proof verification yields highest approval rates.'
    ],
    content: [
      'When evaluating affiliate offers, many publishers ask whether Cost Per Action (CPA) or Cost Per Lead (CPL) delivers better income. In the fintech and banking domain, CPA campaigns almost always deliver superior earnings.',
      'Under CPA, payouts are disbursed once a specific high-value milestone is reached—such as successful KYC approval, first trade execution, or minimum SIP funding. Because the advertiser receives an active user, they pay up to 4x higher bounties.',
      'Public Ads India optimizes this funnel with verified submission review and same-day payment turnaround, eliminating the long 30-day affiliate network wait times common in traditional platforms.'
    ]
  },
  {
    id: 'fraud-prevention-lead-quality-playbook',
    title: 'Zero-Rejection Quality Guide: How to Guarantee 100% Payout Approvals',
    excerpt: 'Master the compliance rules, KYC standards, and proof verification practices that keep your publisher account in VIP good standing.',
    category: 'Compliance & Quality',
    readTime: '5 min read',
    date: 'August 28, 2026',
    author: 'Compliance & Audit Team',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    keyTakeaways: [
      'Always use original, un-tampered proof screenshots showing client code and date.',
      'Strictly avoid self-clicking via proxies or device simulators.',
      'Ensure the applicant uses their own linked Aadhaar and PAN details during KYC.'
    ],
    content: [
      'Maintaining spotless traffic quality is the cornerstone of sustainable affiliate earnings. Brands enforce automated anti-fraud validation to guarantee real human engagement.',
      'When submitting proof in your Public Ads India dashboard, always ensure the applicant name, registered phone number, and transaction confirmation match the provided screenshots.',
      'Publishers who maintain consistent zero-fraud track records are automatically upgraded to priority payout queues and receive early access to premium private campaigns.'
    ]
  }
];

const CATEGORIES = ['All', 'Earning Strategies', 'Industry Insights', 'Compliance & Quality'];

export default function BlogPage({ onNavigate, currentRoute }: { onNavigate: (route: string) => void, currentRoute?: string }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Check if currentRoute specifies a specific blog post slug (e.g. /blog/demat-sip-scaling-guide-2026)
  const initialPostId = currentRoute?.startsWith('/blog/') ? currentRoute.replace('/blog/', '') : null;
  const initialPost = BLOG_POSTS.find(p => p.id === initialPostId) || null;
  const [activePost, setActivePost] = useState<BlogPost | null>(initialPost);

  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    onNavigate(`/blog/${post.id}`);
  };

  const handleClosePost = () => {
    setActivePost(null);
    onNavigate('/blogpage');
  };

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => onNavigate('/Home')} className="hover:text-brand-primary dark:hover:text-amber-400 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Blog & Knowledge Center</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Performance Marketing Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Publisher Insights & <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Growth Playbooks</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Master high-converting CPA campaigns, maximize daily Demat and SIP payout earnings, and stay ahead with verified performance marketing strategies.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-brand-primary text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-[#0c1424] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles & guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Featured / Grid Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-primary/40 dark:hover:border-brand-primary/40 transition-all duration-300 flex flex-col group"
          >
            {/* Image Header */}
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#060d1f]/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-brand-primary dark:text-sky-400 border border-slate-200/40 dark:border-slate-700/40">
                {post.category}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug mb-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {post.author}
                </span>

                <button
                  onClick={() => handleOpenPost(post)}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-primary dark:text-sky-400 hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800 my-6">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No articles matched your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching categories or clearing your search term.</p>
        </div>
      )}

      {/* Article Detail Modal View */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleClosePost}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0c1424] w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative h-60 sm:h-72 w-full shrink-0">
                <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <button
                  onClick={handleClosePost}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-600 text-[10px] font-black uppercase tracking-wider mb-2">
                    {activePost.category}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-md">
                    {activePost.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 font-medium">
                    <span>By {activePost.author}</span>
                    <span>•</span>
                    <span>{activePost.date}</span>
                    <span>•</span>
                    <span>{activePost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Key Takeaways Box */}
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5 mb-2.5">
                    <Lightbulb className="w-4 h-4 text-brand-primary" />
                    Key Takeaways & Best Practices
                  </h4>
                  <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {activePost.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Article Paragraphs */}
                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {activePost.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Call to Action Inside Article */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">Ready to start earning with this strategy?</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Join 10,000+ top Indian publishers today.</p>
                  </div>
                  <button
                    onClick={() => {
                      setActivePost(null);
                      onNavigate('/Dashboard');
                    }}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shrink-0 shadow-sm"
                  >
                    Open Publisher Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
