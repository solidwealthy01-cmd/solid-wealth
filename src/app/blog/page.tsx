"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  TrendingUp,
  BarChart2,
  Wallet,
  Percent,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calculator,
  RefreshCw,
} from "lucide-react";
import { BLOG_ARTICLES, ALL_TOPIC_TAGS, BlogArticle } from "@/lib/blog-data";
import { SchemeSummary } from "@/lib/mf-api";
import { MarketStory } from "@/lib/live-news";

const CATEGORIES = [
  { label: "All", slug: "all" },
  { label: "Bonds", slug: "bonds" },
  { label: "Mutual Funds", slug: "mutual-funds" },
  { label: "SIP & Wealth", slug: "sip-wealth" },
  { label: "Markets", slug: "markets" },
  { label: "Commodities", slug: "commodities" },
  { label: "NRI & Seafarers", slug: "nri-tax" },
  { label: "News", slug: "news" },
] as const;

export default function BlogHomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Live Mutual Fund NAV Data (MFapi.in)
  const [mfData, setMfData] = useState<SchemeSummary[]>([]);
  const [loadingMf, setLoadingMf] = useState(false);
  const [showLiveMfTable, setShowLiveMfTable] = useState(true);

  // Live Market News & Sentiment (NewsAPI /v2/everything & Feeds)
  const [marketStories, setMarketStories] = useState<MarketStory[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showNewsWire, setShowNewsWire] = useState(true);
  const [newsTopicFilter, setNewsTopicFilter] = useState("all");

  const loadNews = async (queryParam?: string) => {
    setLoadingNews(true);
    try {
      const url = queryParam ? `/api/news?q=${encodeURIComponent(queryParam)}` : "/api/news";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.stories)) {
          setMarketStories(json.stories);
        }
      }
    } catch (err) {
      console.error("Failed to load news:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Fetch Live MF Data
    const loadMfData = async () => {
      setLoadingMf(true);
      try {
        const res = await fetch("/api/mf-data");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.schemes)) {
            setMfData(json.schemes);
          }
        }
      } catch (err) {
        console.error("Failed to load MF data:", err);
      } finally {
        setLoadingMf(false);
      }
    };

    loadMfData();
    loadNews();
  }, []);

  // Filter articles based on Category, Search Query, and Topic Tag
  const filteredArticles = BLOG_ARTICLES.filter((art) => {
    const matchesCategory =
      selectedCategory === "all" || art.categorySlug === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTopic =
      !selectedTopic ||
      art.tags.some((t) => t.toLowerCase() === selectedTopic.toLowerCase()) ||
      art.category.toLowerCase().includes(selectedTopic.toLowerCase());

    return matchesCategory && matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a2332]">
      {/* Groww Style Centered Header with Floating Subtle Finance Icons */}
      <section className="relative pt-28 pb-12 overflow-hidden border-b border-gray-100 bg-[#FAFCFF]">
        {/* Subtle decorative background floating icons */}
        <div className="absolute top-16 left-12 opacity-10 text-emerald-600 hidden md:block pointer-events-none">
          <TrendingUp size={64} />
        </div>
        <div className="absolute top-20 right-16 opacity-10 text-orange-500 hidden md:block pointer-events-none">
          <BarChart2 size={72} />
        </div>
        <div className="absolute bottom-6 left-1/4 opacity-10 text-blue-600 hidden md:block pointer-events-none">
          <Wallet size={48} />
        </div>
        <div className="absolute bottom-10 right-1/4 opacity-10 text-purple-600 hidden md:block pointer-events-none">
          <Percent size={52} />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-[#e65100] text-xs font-bold uppercase tracking-wider border border-orange-200/80 shadow-2xs">
            <Sparkles size={13} className="text-[#fe9800]" />
            <span>Market Intelligence & Financial Education</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1a2332] tracking-tight font-display">
            Solid Wealth Blog
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Essential guides, live mutual fund analysis, corporate bond playbooks, and market commentary designed to help retail investors, wealth families, and global NRIs make informed financial decisions.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-lg mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles on Mutual Funds, Bonds, SIP, IPOs..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm outline-none focus:border-[#fe9800] focus:ring-2 focus:ring-[#fe9800]/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-bold text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Category Filter Pills & Feature Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setSelectedTopic(null);
                  if (cat.slug === "news") {
                    setShowNewsWire(true);
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-[#fe9800] text-white shadow-sm shadow-orange-500/20"
                    : "bg-orange-50/70 text-gray-700 border border-orange-100 hover:border-orange-300 hover:bg-orange-100/70 hover:text-[#e65100]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Data Tools Toggles: Live NAV Watch & News Wire */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowLiveMfTable(!showLiveMfTable)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                showLiveMfTable
                  ? "bg-orange-50 text-[#e65100] border-orange-300 shadow-2xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:bg-orange-50/40 hover:text-[#fe9800]"
              }`}
            >
              <span className={`size-2 rounded-full ${showLiveMfTable ? "bg-[#fe9800] animate-pulse" : "bg-gray-400"}`} />
              <span>Live Fund Watch</span>
            </button>

            <button
              onClick={() => setShowNewsWire(!showNewsWire)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                showNewsWire
                  ? "bg-orange-50 text-[#e65100] border-orange-300 shadow-2xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:bg-orange-50/40 hover:text-[#fe9800]"
              }`}
            >
              <Sparkles size={13} className={showNewsWire ? "text-[#fe9800]" : "text-gray-400"} />
              <span>Live News Wire</span>
            </button>
          </div>
        </div>

        {/* Selected Topic Notice Filter */}
        {selectedTopic && (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-full text-xs text-[#e65100]">
            <span>
              Showing articles tagged with: <strong>#{selectedTopic}</strong>
            </span>
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-xs font-bold underline hover:text-[#fe9800] cursor-pointer"
            >
              Clear Topic Filter
            </button>
          </div>
        )}

        {/* 1. FEATURED FINANCIAL GUIDES & ARTICLES (3-COLUMN CARD GRID - ON TOP) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#1a2332] tracking-tight">
              Featured Financial Guides &amp; Articles
            </h2>
            <span className="text-xs text-gray-400 font-bold">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? "Article" : "Articles"}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-12 text-center space-y-3">
              <Search className="size-8 text-gray-400 mx-auto" />
              <h3 className="font-bold text-base text-[#1a2332]">No matching articles found</h3>
              <p className="text-xs text-gray-500">
                Try clearing your search query or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedTopic(null);
                }}
                className="px-5 py-2 rounded-full bg-[#fe9800] hover:bg-[#e58900] text-white text-xs font-bold cursor-pointer transition-colors shadow-sm shadow-orange-500/20"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => router.push(`/blog/${article.id}`)}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Card Image with Category Tag */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge on top right */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#1a2332] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-2xs border border-orange-100/80 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#fe9800]" />
                      <span>{article.category}</span>
                    </div>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#1a2332] group-hover:text-[#fe9800] transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {article.summary}
                      </p>
                    </div>

                    {/* Card Footer: Date & Reading Time (matching Groww) */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* 2. LIVE FINANCIAL NEWS WIRE & SENTIMENT (NewsAPI /v2/everything & Indian Feeds) */}
        {showNewsWire && (
          <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#fe9800] animate-ping" />
                  <h3 className="font-extrabold text-[#1a2332] text-base">
                    Trending Market Wire &amp; Live News Feeds
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#e65100] border border-orange-200">
                    NewsAPI /v2/everything
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Curated live intelligence tracking 150,000+ financial sources with automated sentiment scoring.
                </p>
              </div>

              {/* News Wire Quick Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "all", label: "All News", q: "" },
                  { id: "mf", label: "Mutual Funds", q: "mutual funds" },
                  { id: "bonds", label: "Bonds", q: "corporate bonds" },
                  { id: "stocks", label: "Nifty / Sensex", q: "nifty sensex" },
                  { id: "ipo", label: "IPOs", q: "IPO" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setNewsTopicFilter(f.id);
                      loadNews(f.q);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      newsTopicFilter === f.id
                        ? "bg-[#fe9800] text-white shadow-xs"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200 hover:bg-orange-50/40 hover:text-[#fe9800]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingNews ? (
              <div className="py-12 text-center text-xs text-gray-400 animate-pulse">
                Fetching fresh stories from NewsAPI /v2/everything...
              </div>
            ) : marketStories.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No recent stories found for this topic. Try another filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketStories.slice(0, 6).map((story) => (
                  <div
                    key={story.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
                  >
                    {story.image && (
                      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-orange-50 text-[#e65100] border border-orange-200/60 uppercase">
                          {story.tag}
                        </span>
                        <span className="text-gray-400 truncate max-w-[130px]" title={story.source}>
                          {story.source}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1a2332] leading-snug line-clamp-2 group-hover:text-[#fe9800] transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                      <span
                        className={`font-bold ${
                          story.sentiment === "bullish"
                            ? "text-emerald-600"
                            : story.sentiment === "bearish"
                            ? "text-rose-600"
                            : "text-blue-600"
                        }`}
                      >
                        ● {story.sentimentLabel}
                      </span>
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#fe9800] flex items-center gap-1 font-semibold transition-colors"
                      >
                        Read Full Story <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. EMBEDDED LIVE MUTUAL FUND NAV WATCH & PERFORMANCE TABLE (MFapi.in & AMFI) */}
        {showLiveMfTable && (
          <div className="rounded-2xl border border-orange-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#fe9800] animate-ping" />
                  <h3 className="font-extrabold text-[#1a2332] text-base">
                    Live Mutual Fund NAV Watch &amp; Performance Table
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#e65100] border border-orange-200">
                    MFapi.in Live Feed
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time Net Asset Values (NAV) and annualized returns for India's leading open-ended schemes.
                </p>
              </div>
              <Link
                href="/calculators"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e65100] hover:text-[#fe9800]"
              >
                <Calculator size={14} /> Calculate SIP on Calculators <ChevronRight size={13} />
              </Link>
            </div>

            {loadingMf ? (
              <div className="py-8 text-center text-xs text-gray-400 animate-pulse">
                Fetching live mutual fund data from MFapi.in...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Scheme Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Current NAV</th>
                      <th className="py-2.5 px-3 text-right">1-Day Change</th>
                      <th className="py-2.5 px-3 text-right">1-Year Return</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {mfData.slice(0, 6).map((scheme) => (
                      <tr key={scheme.schemeCode} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-[#1a2332]">{scheme.schemeName}</span>
                          <span className="block text-[10px] text-gray-400">{scheme.fundHouse} • As of {scheme.navDate}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#e65100] border border-orange-200/60">
                            {scheme.category.split(" - ")[0]}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-[#1a2332]">
                          ₹{scheme.currentNav.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold">
                          <span
                            className={
                              scheme.dailyChangePercent >= 0 ? "text-emerald-600" : "text-rose-600"
                            }
                          >
                            {scheme.dailyChangePercent >= 0 ? "+" : ""}
                            {scheme.dailyChangePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                          {scheme.oneYearReturn ? `+${scheme.oneYearReturn}%` : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Link
                            href={`/calculators?scheme=${scheme.schemeCode}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-[#e65100] border border-orange-200 hover:bg-[#fe9800] hover:text-white text-[11px] font-bold transition-colors"
                          >
                            Invest via SIP
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ALL TOPICS PILL CLOUD (MATCHING GROWW SCREENSHOT 3 EXACTLY) */}
        <div className="pt-10 border-t border-gray-200 space-y-4">
          <h3 className="text-base font-black text-[#1a2332]">All Topics</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_TOPIC_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTopic(tag === selectedTopic ? null : tag);
                  setSelectedCategory("all");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedTopic === tag
                    ? "bg-[#fe9800] text-white border-[#fe9800] shadow-sm shadow-orange-500/20"
                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/70 hover:text-[#e65100]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
