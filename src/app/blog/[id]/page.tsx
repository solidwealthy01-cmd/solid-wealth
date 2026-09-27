"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronRight,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Layers,
  ArrowRight,
  FileText,
  ThumbsUp,
} from "lucide-react";
import { BLOG_ARTICLES, ALL_TOPIC_TAGS, BlogArticle } from "@/lib/blog-data";
import { calculateSip } from "@/lib/sip-calculator-engine";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Interactive Live Calculator state inside the article
  const [calcAmount, setCalcAmount] = useState<number>(100000);
  const [calcRate, setCalcRate] = useState<number>(9.5);
  const [calcYears, setCalcYears] = useState<number>(5);

  const articleId = typeof params?.id === "string" ? params.id : "how-corporate-bonds-work";

  // Find article or fallback to corporate bonds
  const article =
    BLOG_ARTICLES.find((a) => a.id === articleId) ||
    BLOG_ARTICLES[0];

  const recentPosts = BLOG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 5);
  const relatedPosts = BLOG_ARTICLES.filter((a) =>
    article.relatedPostIds?.includes(a.id)
  ).slice(0, 3);

  // Share handlers
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = (platform: "whatsapp" | "facebook" | "twitter" | "linkedin" | "telegram") => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);

    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=450");
  };

  // Live compounding calculation for the article
  const calcBondFutureValue = Math.round(
    calcAmount * Math.pow(1 + calcRate / 100, calcYears)
  );
  const calcBondInterestEarned = calcBondFutureValue - calcAmount;

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a2332]">
      {/* Top Breadcrumb Header Bar */}
      <div className="border-b border-gray-100 bg-[#FAFCFF] pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <Link href="/blog" className="hover:text-emerald-700">
              Blog
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <Link
              href={`/blog?category=${article.categorySlug}`}
              className="hover:text-emerald-700"
            >
              {article.category}
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-gray-800 font-bold truncate max-w-[200px] sm:max-w-md">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Layout Container (Left Column + Sticky Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Article Headline & Metadata */}
        <div className="max-w-4xl space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a2332] tracking-tight leading-tight font-display">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-400" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#e65100] border border-orange-200/80">
              {article.category}
            </span>
          </div>
        </div>

        {/* 2-COLUMN GRID (Matching Groww Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Main Article Body (~68%) */}
          <main className="lg:col-span-8 space-y-8">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-xs border border-gray-100 bg-gray-100">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 68vw"
                className="object-cover"
              />
            </div>

            {/* Social Sharing Bar (Matching Groww Screenshot 2) */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* WhatsApp */}
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="size-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <span className="text-xs font-black">W</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleShare("facebook")}
                  className="size-8 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on Facebook"
                >
                  <span className="text-xs font-black">f</span>
                </button>

                {/* X / Twitter */}
                <button
                  onClick={() => handleShare("twitter")}
                  className="size-8 rounded-full bg-black/10 text-black hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on X"
                >
                  <span className="text-xs font-black">𝕏</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleShare("linkedin")}
                  className="size-8 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <span className="text-xs font-black">in</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => handleShare("telegram")}
                  className="size-8 rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Share on Telegram"
                >
                  <span className="text-xs font-black">tg</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="size-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer relative"
                  title="Copy Link"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              {copied && (
                <span className="text-xs font-bold text-emerald-600 animate-fadeIn">
                  Link copied to clipboard!
                </span>
              )}
            </div>

            {/* Article Content Sections */}
            <div className="space-y-6 text-[#2d3748] text-sm sm:text-base leading-relaxed">
              {article.content.map((sec, idx) => (
                <section key={idx} className="space-y-3">
                  {sec.heading && (
                    <h2 className="text-xl sm:text-2xl font-black text-[#1a2332] tracking-tight pt-3">
                      {sec.heading}
                    </h2>
                  )}

                  {sec.body.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed text-gray-700">
                      {p}
                    </p>
                  ))}

                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2 pt-1 pl-4 list-disc marker:text-[#fe9800] text-gray-700">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* COMPARISON TABLE: Corporate Bonds vs. Government Bonds */}
            {article.comparisonTable && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-0 my-8">
                <div className="bg-[#FAFCFF] p-4 border-b border-gray-200">
                  <h3 className="font-extrabold text-[#1a2332] text-base">
                    {article.comparisonTable.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    A comprehensive comparison between corporate debt and sovereign securities.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
                        {article.comparisonTable.headers.map((h, hIdx) => (
                          <th key={hIdx} className="py-3 px-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {article.comparisonTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#1a2332] bg-gray-50/30 w-1/4">
                            {row.parameter}
                          </td>
                          <td className="py-3 px-4 text-gray-700 w-3/8 leading-relaxed">
                            {row.corporate}
                          </td>
                          <td className="py-3 px-4 text-gray-700 w-3/8 leading-relaxed">
                            {row.government}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EMBEDDED LIVE DATA & CALCULATION WIDGET (FinCalculator SIP & Yield Engine) */}
            <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-6 shadow-xs space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator size={18} className="text-[#fe9800]" />
                  <h3 className="font-extrabold text-[#1a2332] text-base">
                    Interactive Bond Yield & Compounding Calculator
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#e65100] border border-orange-200">
                  FinCalculator Engine
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Simulate your fixed income earnings based on your investment amount, expected coupon rate, and investment tenure.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Investment Amount</label>
                  <input
                    type="number"
                    step="10000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(1000, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Annual Coupon / Yield (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Tenure (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={calcYears}
                    onChange={(e) => setCalcYears(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Calculator Output KPI Card */}
              <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Principal Invested</span>
                  <p className="text-sm sm:text-base font-black text-[#1a2332] mt-0.5">
                    ₹{calcAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">Estimated Returns</span>
                  <p className="text-sm sm:text-base font-black text-emerald-700 mt-0.5">
                    +₹{calcBondInterestEarned.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-700 font-bold uppercase">Maturity Corpus</span>
                  <p className="text-sm sm:text-base font-black text-[#0B63E5] mt-0.5">
                    ₹{calcBondFutureValue.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  Multiple: <strong>{(calcBondFutureValue / Math.max(calcAmount, 1)).toFixed(2)}x</strong> over {calcYears} years
                </span>
                <Link
                  href="/calculators"
                  className="font-bold text-[#e65100] hover:text-[#fe9800] inline-flex items-center gap-1"
                >
                  Explore Full Calculators Suite <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* INTERACTIVE FAQ ACCORDION (Matching Groww Screenshot 3) */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-2xl font-black text-[#1a2332] tracking-tight">
                  Frequently Asked Questions (FAQs)
                </h3>

                <div className="space-y-2.5">
                  {article.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="rounded-xl border border-gray-200 overflow-hidden bg-white transition-colors"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full p-4 text-left font-bold text-sm sm:text-base text-[#1a2332] flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50"
                        >
                          <span>{faq.question}</span>
                          <span className="text-gray-400 shrink-0">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FAFCFF]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Prompt (Matching Groww Screenshot 3) */}
            <div className="rounded-2xl border border-gray-200 p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div>
                <p className="font-extrabold text-[#1a2332] text-sm">
                  Do you like this edition?
                </p>
                <p className="text-xs text-gray-500">
                  Help us improve our financial research by sharing your thoughts.
                </p>
              </div>
              <button
                onClick={() => setFeedbackGiven(true)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  feedbackGiven
                    ? "bg-orange-50 text-[#e65100] border-orange-300"
                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 hover:text-[#fe9800] shadow-2xs"
                }`}
              >
                {feedbackGiven ? "Thank You For Your Feedback!" : "LEAVE A FEEDBACK"}
              </button>
            </div>
          </main>

          {/* RIGHT COLUMN: Sticky Sidebar (~32%) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Top High-Converting CTA Card (Matching Groww Screenshot 2) */}
            <div className="rounded-2xl border border-orange-200/80 bg-white p-6 shadow-xs text-center space-y-4">
              {/* Illustration / Graphic */}
              <div className="size-16 mx-auto rounded-2xl bg-orange-100 text-[#fe9800] flex items-center justify-center">
                <FileText size={32} />
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-xl text-[#1a2332]">
                  Invest in Bonds on Solid Wealth
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Fixed returns. Clear terms. Compare yields and invest in minutes with institutional research backing.
                </p>
              </div>

              <Link
                href="/calculators"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#fe9800] hover:bg-[#e58900] text-white text-xs font-black tracking-wider uppercase shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                GET STARTED
              </Link>
            </div>

            {/* Recent Posts List (Matching Groww Screenshot 2) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
              <h4 className="font-black text-[#1a2332] text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
                Recent Posts
              </h4>

              <div className="space-y-3.5 divide-y divide-gray-100">
                {recentPosts.map((post) => (
                  <div key={post.id} className="pt-3 first:pt-0">
                    <Link
                      href={`/blog/${post.id}`}
                      className="block group space-y-1"
                    >
                      <h5 className="font-bold text-xs text-[#1a2332] group-hover:text-[#fe9800] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Posts Card */}
            {relatedPosts.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
                <h4 className="font-black text-[#1a2332] text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
                  Related Posts
                </h4>

                <div className="space-y-3">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.id}
                      href={`/blog/${rPost.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="size-12 rounded-lg relative overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={rPost.image}
                          alt={rPost.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="font-bold text-xs text-[#1a2332] group-hover:text-[#fe9800] transition-colors truncate">
                          {rPost.title}
                        </h6>
                        <span className="text-[10px] text-gray-400">{rPost.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom All Topics Tag Cloud (Matching Groww Screenshot 3) */}
        <div className="pt-12 mt-12 border-t border-gray-200 space-y-4">
          <h3 className="text-base font-black text-[#1a2332]">All Topics</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_TOPIC_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/blog?topic=${encodeURIComponent(tag)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50/70 hover:text-[#e65100] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Breadcrumb bottom line */}
          <div className="pt-4 text-xs text-gray-400">
            Home &gt; Blog &gt; {article.category} &gt; {article.title}
          </div>
        </div>
      </div>
    </div>
  );
}
