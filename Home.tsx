/*
  Design: 「湯けむりジャポニズム」— 和モダン×温泉蒸気
  - 墨色ベース、温泉乳白色、鉄錆色アクセント
  - Noto Serif JP (見出し) + Noto Sans JP (本文)
  - 湯けむりアニメーション、和紙テクスチャ
*/

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Calendar, Clock, Music, Users, ExternalLink, ChevronDown, Megaphone, Instagram, ShoppingBag, Play, Star, Heart } from "lucide-react";

// CDN image URLs
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/hero-kannawa-real_514534f2.webp",
  handpan: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/handpan-onsen-8D33GGC5cnax8msifyhxx2.webp",
  live: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/live-performance-PzvBhSz7LHyeWk2BKqZJYs.webp",
  workshop: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/workshop-scene-JTN9X8bKJRmWVLuR2DqnTp.webp",
  fire: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243504893/af5dDHaHNtaa3Lca6iH4uU/fire-festival-2ZYMBtXvvJzNK5DNFrj9xc.webp",
};

// Links
const LINKS = {
  peatixFire: "https://peatix.com/event/4932863",
  peatixWorkshop: "https://coubic.com/reomatsumoto/1855441",
  googleMap: "https://www.google.com/maps/search/HACHI+BEPPU+The+Sky+%E5%A4%A7%E5%88%86%E7%9C%8C%E5%88%A5%E5%BA%9C%E5%B8%82%E9%89%84%E8%BC%AA796-18",
  instagram: "https://www.instagram.com/hachibeppu/",
};

// ============================================================
// NEWS DATA — ここを編集してお知らせを追加・更新してください
// ============================================================
// 各ニュースは { date, title, body, link?, linkLabel? } の形式です。
// link と linkLabel は任意です（リンクが不要なら省略可）。
// 新しいニュースを配列の先頭に追加すると、上に表示されます。
const newsItems: { date: string; title: string; body: string; link?: string; linkLabel?: string; isNew?: boolean }[] = [
  {
    date: "2026.03.24",
    title: "鉄輪温泉ハンドパン部 Webサイト公開",
    body: "2026年4月1日〜5日に開催する鉄輪温泉ハンドパン部の公式サイトを公開しました。Live・Workshop情報をご確認ください。",
    isNew: true,
  },
  {
    date: "2026.03.20",
    title: "火祭りギャザリング Peatix受付開始",
    body: "4月2日（木）18:00〜 HACHI BEPPU The Sky屋上にて開催。持ち寄りパーティー形式です。",
    link: "https://peatix.com/event/4932863",
    linkLabel: "Peatixで詳細を見る",
    isNew: true,
  },
  {
    date: "2026.03.18",
    title: "ワークショップ体験レッスン 予約受付中",
    body: "初心者歓迎！60分の体験レッスン（¥3,000）と1日レッスン受け放題（¥10,000）の2コースをご用意しています。",
    link: "https://coubic.com/reomatsumoto/1855441",
    linkLabel: "申し込む",
  },
];

// ============================================================
// ARTIST DATA — ここを編集してアーティストを追加・更新してください
// ============================================================
const artists: { name: string; nameEn?: string; role: string; bio: string; image?: string }[] = [
  {
    name: "Light",
    role: "ハンドパン奏者 / ワークショップ講師",
    bio: "繊細で温かみのある音色が特徴のハンドパン奏者。鉄輪温泉ハンドパン部のワークショップ講師として、初心者から中級者まで幅広くレッスンを担当。",
  },
  {
    name: "Seiko",
    role: "ハンドパン奏者",
    bio: "鉄輪温泉ハンドパン部メンバー。音浴湯治ライブでの演奏を通じて、温泉と音楽の融合を体現するアーティスト。",
  },
  {
    name: "Shun",
    role: "ハンドパン奏者",
    bio: "独自のリズム感と表現力で聴く人を魅了するハンドパン奏者。鉄輪温泉でのライブパフォーマンスに参加。",
  },
  {
    name: "Eidon",
    role: "ハンドパン奏者",
    bio: "深みのある音色と即興演奏を得意とするアーティスト。Seikoとのデュオ演奏で音浴湯治ライブに出演。",
  },
];

// ============================================================
// MEMBER DATA — ここを編集してメンバーを追加・更新してください
// ============================================================
const members: { name: string; role?: string; bio?: string; image?: string }[] = [
  {
    name: "Makiko",
    role: "メンバー",
    bio: "",
  },
  {
    name: "Seiko",
    role: "メンバー",
    bio: "",
  },
  {
    name: "Rin",
    role: "メンバー",
    bio: "",
  },
];

// Live schedule data
const liveSchedule = [
  { date: "4/1", time: "12:00", event: "音浴湯治", place: "地獄蒸し工房前", artist: "Seiko & Eidon" },
  { date: "4/1", time: "17:30", event: "音浴湯治", place: "むし湯前", artist: "Light" },
  { date: "4/2", time: "9:00", event: "音浴湯治", place: "むし湯前", artist: "Light" },
  { date: "4/2", time: "13:15", event: "音浴湯治", place: "地獄蒸し工房前", artist: "Light" },
  { date: "4/2", time: "18:00", event: "スペシャルイベント 火祭り音浴会", place: "Hachi Beppu The Sky", artist: "持ち寄りパーティー（当日4000円）", isSpecial: true },
  { date: "4/3", time: "8:00", event: "音浴湯治", place: "むし湯前", artist: "Light" },
  { date: "4/3", time: "17:15", event: "音浴湯治", place: "地獄蒸し工房前", artist: "Light" },
  { date: "4/4", time: "10:00", event: "音浴湯治", place: "むし湯前", artist: "Light" },
  { date: "4/5", time: "10:00", event: "別府八湯温泉まつり ハンドパン音浴湯治", place: "大谷公園", artist: "Light" },
  { date: "4/5", time: "20:00", event: "夜桜の宴", place: "大谷公園", artist: "Seiko & Eidon" },
];

// Workshop schedule data
const workshopSchedule = [
  { date: "4月1日", day: "水", time: "14:30 - 15:30", event: "体験＆初級レッスン ①", instructor: "Lightさん", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月1日", day: "水", time: "16:00 - 17:00", event: "体験＆初級レッスン ②", instructor: "Lightさん", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月1日", day: "水", time: "19:00 - 20:00", event: "体験＆初級レッスン ③", instructor: "Lightさん", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月2日", day: "木", time: "10:15 - 11:15", event: "体験＆初級レッスン ④", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月2日", day: "木", time: "11:45 - 12:45", event: "体験＆初級レッスン ⑤", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月2日", day: "木", time: "14:30 - 15:30", event: "体験＆初級レッスン ⑥", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月3日", day: "金", time: "10:00 - 16:00", event: "1日レッスン受け放題＆初中級作曲", instructor: "", price: "10000円", capacity: "定員6名", note: "お茶付き・希望者はランチ手配可能", isFullDay: true },
  { date: "4月3日", day: "金", time: "19:00 - 20:00", event: "体験＆初級レッスン ⑦", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月4日", day: "土", time: "08:00 - 09:00", event: "体験＆初級レッスン ⑧", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月4日", day: "土", time: "12:00 - 18:00", event: "1日レッスン受け放題＆初中級作曲", instructor: "", price: "10000円", capacity: "定員6名", note: "朝の移動で来る人向け・お茶付き・希望者はランチ手配可能・終了後希望者は御神楽へ", isFullDay: true },
  { date: "4月5日", day: "日", time: "08:00 - 09:00", event: "体験＆初級レッスン ⑨", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
  { date: "4月5日", day: "日", time: "11:30 - 12:30", event: "体験＆初級レッスン ⑩", instructor: "", price: "3000円", capacity: "定員6名", note: "" },
];

// Steam particle component
function SteamParticle({ delay, left }: { delay: number; left: string }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-white/20 animate-steam"
      style={{
        left,
        bottom: "10%",
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 3}s`,
      }}
    />
  );
}

// Section wrapper with fade-in animation
function AnimatedSection({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Section title component
function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-[oklch(0.25_0.01_60)] tracking-wider">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-[oklch(0.5_0.02_60)] tracking-wide font-light">
          {subtitle}
        </p>
      )}
      <div className="mt-5 mx-auto w-20 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)] to-transparent" />
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.96_0.015_80)]">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 100
            ? "bg-[oklch(0.96_0.015_80)]/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-lg font-bold font-serif tracking-widest text-[oklch(0.25_0.01_60)]">
              ♨ 鉄輪温泉ハンドパン部
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm tracking-wider">
            <a href="#news" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              News
            </a>
            <a href="#about" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              About
            </a>
            <a href="#live" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              Live
            </a>
            <a href="#workshop" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              Workshop
            </a>
            <a href="#artists" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              Artists
            </a>
            <a href="#buying" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              購入ガイド
            </a>
            <a href="#access" className="text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
              Access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${IMAGES.hero})`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.96_0.015_80)]/60 via-[oklch(0.96_0.015_80)]/30 to-[oklch(0.96_0.015_80)]" />

        {/* Steam particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <SteamParticle key={i} delay={i * 0.5} left={`${8 + i * 8}%`} />
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <p className="text-[oklch(0.35_0.01_60)]/80 text-sm md:text-base tracking-[0.3em] mb-4 font-light">
              湯けむりの中で奏でる、鉄の音色
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[oklch(0.2_0.01_60)] tracking-wider font-serif leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
              鉄輪温泉
              <br />
              <span className="text-[oklch(0.45_0.12_50)]">ハンドパン部</span>
            </h1>
            <p className="mt-6 text-[oklch(0.35_0.01_60)]/70 text-base md:text-lg tracking-wider font-light max-w-xl mx-auto">
              2026年4月1日〜5日 ＠ 別府・鉄輪温泉
            </p>
            <p className="mt-2 text-[oklch(0.4_0.01_60)]/60 text-sm tracking-wider">
              Live Performance & Workshop
            </p>
          </motion.div>

          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 text-[oklch(0.35_0.01_60)]/60 hover:text-[oklch(0.2_0.01_60)] transition-colors"
            aria-label="スクロール"
          >
            <ChevronDown className="w-8 h-8 animate-gentle-float" />
          </motion.button>
        </div>
      </header>

      {/* News Section */}
      <AnimatedSection id="news" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="最新のお知らせ">News</SectionTitle>

          <div className="space-y-0">
            {newsItems.map((item, i) => (
              <div
                key={i}
                className={`group border-b border-[oklch(0.88_0.02_75)] py-6 ${
                  i === 0 ? "border-t" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                  {/* Date + Badge */}
                  <div className="flex items-center gap-3 md:w-40 shrink-0">
                    <span className="text-sm text-[oklch(0.5_0.02_60)] tracking-wider font-light">
                      {item.date}
                    </span>
                    {item.isNew && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider bg-[oklch(0.55_0.12_50)] text-white rounded">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[oklch(0.3_0.01_60)] mb-1.5 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[oklch(0.55_0.12_50)] shrink-0" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed">
                      {item.body}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-sm text-[oklch(0.55_0.12_50)] hover:text-[oklch(0.5_0.13_50)] font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {item.linkLabel || "詳細を見る"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* About Section */}
      <AnimatedSection id="about" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="「鉄」で繋がる2つの癒し">音と湯の邂逅</SectionTitle>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
            <div className="space-y-6">
              <p className="text-[oklch(0.35_0.01_60)] leading-relaxed text-base">
                人は、浴びることで癒される。
              </p>
              <p className="text-[oklch(0.35_0.01_60)] leading-relaxed text-base">
                鉄の楽器ハンドパンで「音」を、鉄輪で「温泉」を。
                鉄つながりの鉄輪温泉で、ハンドパンカルチャーが2026年スタートします。
              </p>
              <p className="text-[oklch(0.35_0.01_60)] leading-relaxed text-base">
                会場は、源泉掛け流し温泉付きハンドパンスペースのある小さな一棟貸し宿
                <a
                  href={LINKS.googleMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.55_0.12_50)] hover:underline font-medium"
                >
                  HACHI BEPPU The Sky
                </a>
                。レッスンの前後に無料で温泉もお楽しみください。
              </p>
              <p className="text-[oklch(0.5_0.02_60)] text-sm leading-relaxed">
                未経験者＆初心者も大歓迎！手ぶらでOK！浴びて、奏でて、自分に出会う5日間。
              </p>
            </div>
            <div className="relative">
              <img
                src={IMAGES.handpan}
                alt="温泉とハンドパン"
                className="w-full rounded-lg shadow-lg"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[oklch(0.55_0.12_50)]/30 rounded-lg" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* Live Schedule Section */}
      <AnimatedSection id="live" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="2026年4月1日〜5日">Live Schedule — 音浴湯治</SectionTitle>

          <div className="relative mb-8">
            <img
              src={IMAGES.live}
              alt="ライブパフォーマンス"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.01_60)]/60 to-transparent rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm tracking-wider opacity-80">Handpan Sound Bath</p>
              <p className="text-2xl font-serif font-bold tracking-wider">音浴湯治</p>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[oklch(0.55_0.12_50)]/30">
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">日付</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">時間</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">イベント</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">場所</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">Artist</th>
                </tr>
              </thead>
              <tbody>
                {liveSchedule.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[oklch(0.88_0.02_75)] transition-colors hover:bg-[oklch(0.93_0.02_75)]/50 ${
                      item.isSpecial ? "bg-[oklch(0.55_0.12_50)]/5" : ""
                    }`}
                  >
                    <td className="py-3.5 px-3 font-medium text-[oklch(0.35_0.01_60)]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[oklch(0.55_0.12_50)]" />
                        {item.date}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-[oklch(0.4_0.01_60)]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[oklch(0.55_0.12_50)]/60" />
                        {item.time}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {item.isSpecial ? (
                        <span className="font-bold text-[oklch(0.55_0.12_50)]">
                          {item.event}
                        </span>
                      ) : (
                        <span className="text-[oklch(0.35_0.01_60)]">{item.event}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[oklch(0.4_0.01_60)]">
                      {item.place === "Hachi Beppu The Sky" ? (
                        <a
                          href={LINKS.googleMap}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[oklch(0.55_0.12_50)] hover:underline flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {item.place}
                        </a>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[oklch(0.55_0.12_50)]/60" />
                          {item.place}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[oklch(0.4_0.01_60)]">
                      <div className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-[oklch(0.55_0.12_50)]/60" />
                        {item.artist}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fire Festival Special Event Card */}
          <div className="mt-12 relative overflow-hidden rounded-xl shadow-lg">
            <img
              src={IMAGES.fire}
              alt="火祭り"
              className="w-full h-72 md:h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-amber-300/90 text-xs tracking-[0.3em] uppercase mb-2">Special Event</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wider mb-2">
                春の祝宴 小さな火祭りギャザリング
              </h3>
              <p className="text-white/80 text-sm mb-1">
                4月2日（木）18:00〜21:00 ＠ Hachi Beppu The Sky 屋上
              </p>
              <p className="text-white/60 text-sm mb-4">
                持ち寄りパーティー（当日現金3000円 / Peatix事前購入）
              </p>
              <a
                href={LINKS.peatixFire}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[oklch(0.55_0.12_50)] hover:bg-[oklch(0.5_0.13_50)] text-white px-6 py-3 rounded-lg text-sm font-medium tracking-wider transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Peatixで申し込む
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* Workshop Section */}
      <AnimatedSection id="workshop" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="ハンドパン体験会＆レッスン ＠ 鉄輪温泉">Workshop Schedule</SectionTitle>

          <div className="relative mb-10">
            <img
              src={IMAGES.workshop}
              alt="ワークショップ風景"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.01_60)]/60 to-transparent rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm tracking-wider opacity-80">Handpan Workshop by Light</p>
              <p className="text-2xl font-serif font-bold tracking-wider">音の輪 体験会</p>
            </div>
          </div>

          {/* Workshop Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
              <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3">
                ① 体験＆初級レッスン
              </h4>
              <p className="text-[oklch(0.4_0.01_60)] text-sm leading-relaxed mb-2">
                1レッスン60分 / ¥3,000（ハンドパン使用料込）
              </p>
              <ul className="text-[oklch(0.5_0.02_60)] text-sm space-y-1">
                <li>・簡単なフレーズの練習</li>
                <li>・綺麗な音の出し方</li>
                <li>・ハンドパンの買い方相談</li>
                <li>・作曲の入口</li>
              </ul>
            </div>
            <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
              <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3">
                ② 1日レッスン受け放題＆初中級作曲
              </h4>
              <p className="text-[oklch(0.4_0.01_60)] text-sm leading-relaxed mb-2">
                1日 / ¥10,000（ハンドパン使用料・お茶付き）
              </p>
              <ul className="text-[oklch(0.5_0.02_60)] text-sm space-y-1">
                <li>・体験レッスン〜初中級対象</li>
                <li>・1日で作曲に繋がるフレーズを集中レッスン</li>
                <li>・参加者にカスタマイズした内容</li>
                <li>・希望者はランチ弁当手配可能</li>
              </ul>
            </div>
          </div>

          {/* Workshop Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[oklch(0.55_0.12_50)]/30">
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">日付</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">曜日</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">時間</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">内容</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">料金・備考</th>
                </tr>
              </thead>
              <tbody>
                {workshopSchedule.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[oklch(0.88_0.02_75)] transition-colors hover:bg-[oklch(0.93_0.02_75)]/50 ${
                      item.isFullDay ? "bg-[oklch(0.55_0.12_50)]/5" : ""
                    }`}
                  >
                    <td className="py-3.5 px-2 font-medium text-[oklch(0.35_0.01_60)] whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-2 text-[oklch(0.4_0.01_60)]">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        item.day === "土" ? "bg-blue-100 text-blue-700" :
                        item.day === "日" ? "bg-red-100 text-red-700" :
                        "bg-[oklch(0.93_0.02_75)] text-[oklch(0.4_0.01_60)]"
                      }`}>
                        {item.day}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-[oklch(0.4_0.01_60)] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[oklch(0.55_0.12_50)]/60" />
                        {item.time}
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      {item.isFullDay ? (
                        <span className="font-bold text-[oklch(0.55_0.12_50)]">
                          {item.event}
                        </span>
                      ) : (
                        <span className="text-[oklch(0.35_0.01_60)]">
                          {item.event}
                          {item.instructor && (
                            <span className="text-[oklch(0.5_0.02_60)] ml-1">({item.instructor})</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-[oklch(0.4_0.01_60)]">
                      <div>
                        <span className="font-medium">{item.price}</span>
                        <span className="text-[oklch(0.5_0.02_60)] ml-1">・{item.capacity}</span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-[oklch(0.55_0.12_50)] mt-0.5">{item.note}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Workshop CTA */}
          <div className="mt-10 text-center">
            <a
              href={LINKS.peatixWorkshop}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[oklch(0.55_0.12_50)] hover:bg-[oklch(0.5_0.13_50)] text-white px-8 py-4 rounded-lg text-base font-medium tracking-wider transition-colors shadow-md"
            >
              <ExternalLink className="w-5 h-5" />
              Peatixでワークショップに申し込む
            </a>
            <p className="mt-3 text-[oklch(0.5_0.02_60)] text-sm">
              会場: HACHI BEPPU The Sky（
              <a
                href={LINKS.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.55_0.12_50)] hover:underline"
              >
                Google Map
              </a>
              ）
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* Artist Section */}
      <AnimatedSection id="artists" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="鉄輪温泉ハンドパン部に参加してくれたアーティスト">Artists</SectionTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists.map((artist, i) => (
              <motion.div
                key={i}
                className="group bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-square bg-gradient-to-br from-[oklch(0.92_0.03_75)] to-[oklch(0.88_0.04_60)] flex items-center justify-center">
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Music className="w-10 h-10 text-[oklch(0.55_0.12_50)]/40 mx-auto mb-2" />
                      <span className="text-3xl font-serif font-bold text-[oklch(0.55_0.12_50)]/60 tracking-wider">{artist.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg text-[oklch(0.3_0.01_60)] tracking-wider mb-1">
                    {artist.name}
                    {artist.nameEn && <span className="text-xs font-sans text-[oklch(0.5_0.02_60)] ml-2">{artist.nameEn}</span>}
                  </h3>
                  <p className="text-xs text-[oklch(0.55_0.12_50)] tracking-wide mb-3">{artist.role}</p>
                  {artist.bio && (
                    <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed">{artist.bio}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* Member Section */}
      <AnimatedSection id="members" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="鉄輪温泉ハンドパン部のメンバー">Members</SectionTitle>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {members.map((member, i) => (
              <motion.div
                key={i}
                className="text-center group"
                whileHover={{ y: -4 }}
              >
                <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-[oklch(0.92_0.03_75)] to-[oklch(0.88_0.04_60)] border-2 border-[oklch(0.88_0.02_75)] flex items-center justify-center overflow-hidden group-hover:border-[oklch(0.55_0.12_50)]/50 transition-colors">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-serif font-bold text-[oklch(0.55_0.12_50)]/60 tracking-wider">{member.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-[oklch(0.3_0.01_60)] tracking-wider mb-1">{member.name}</h3>
                {member.role && (
                  <p className="text-xs text-[oklch(0.55_0.12_50)] tracking-wide mb-2">{member.role}</p>
                )}
                {member.bio && (
                  <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed">{member.bio}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* Buying Guide Section */}
      <AnimatedSection id="buying" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="初めてのハンドパン選びに役立つ情報">ハンドパンの購入について</SectionTitle>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-8 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <ShoppingBag className="w-6 h-6 text-[oklch(0.55_0.12_50)] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-xl text-[oklch(0.3_0.01_60)] tracking-wider mb-3">
                    ハンドパンを購入する前に
                  </h3>
                  <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed mb-3">
                    ハンドパンは一台一台が手作りの楽器です。スケール（音階）、素材、メーカーによって音色や価格が大きく異なります。
                    初めて購入する方は、まずワークショップで実際に触れてみることをおすすめします。
                  </p>
                  <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed">
                    鉄輪温泉ハンドパン部のワークショップでは、ハンドパンの買い方相談も受け付けています。
                    また、以下のReo Matsumotoさんの動画も参考になります。
                  </p>
                </div>
              </div>
            </div>

            {/* Reo Matsumoto Videos */}
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] tracking-wider flex items-center gap-2">
                <Play className="w-5 h-5 text-[oklch(0.55_0.12_50)]" />
                Reo Matsumotoさんのアドバイス動画
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/LL3VktuWqNM"
                      title="一流ハンドパンの購入方法"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm text-[oklch(0.3_0.01_60)] mb-1">一流ハンドパンの購入方法</p>
                    <p className="text-xs text-[oklch(0.5_0.02_60)]">お金を無駄にしないハンドパンの選び方</p>
                  </div>
                </div>

                <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/LKGIQUBOa9Y"
                      title="初めて買うハンドパン"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm text-[oklch(0.3_0.01_60)] mb-1">初めて買うハンドパン</p>
                    <p className="text-xs text-[oklch(0.5_0.02_60)]">スケールや素材は何を選べばいい？</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <a
                  href="https://www.youtube.com/@REOMATSUMOTO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[oklch(0.55_0.12_50)] hover:text-[oklch(0.5_0.13_50)] text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Reo Matsumotoさんの YouTube チャンネル
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent" />
      </div>

      {/* Access Section */}
      <AnimatedSection id="access" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle="大分県別府市鉄輪796-18">Access — 会場案内</SectionTitle>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
                <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[oklch(0.55_0.12_50)]" />
                  HACHI BEPPU The Sky
                </h4>
                <p className="text-[oklch(0.4_0.01_60)] text-sm leading-relaxed mb-4">
                  大分県別府市鉄輪796-18
                  <br />
                  源泉掛け流し温泉付き一棟貸し宿
                  <br />
                  ハンドパン練習スペース完備
                </p>
                <a
                  href={LINKS.googleMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[oklch(0.55_0.12_50)] hover:text-[oklch(0.5_0.13_50)] text-sm font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Google Mapで開く
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
                <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[oklch(0.55_0.12_50)]" />
                  お申し込み
                </h4>
                <div className="space-y-3">
                  <a
                    href={LINKS.peatixFire}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-[oklch(0.88_0.02_75)] hover:border-[oklch(0.55_0.12_50)]/50 hover:bg-[oklch(0.93_0.02_75)]/50 transition-all text-sm"
                  >
                    <span className="text-[oklch(0.35_0.01_60)]">火祭りギャザリング</span>
                    <ExternalLink className="w-4 h-4 text-[oklch(0.55_0.12_50)]" />
                  </a>
                  <a
                    href={LINKS.peatixWorkshop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-[oklch(0.88_0.02_75)] hover:border-[oklch(0.55_0.12_50)]/50 hover:bg-[oklch(0.93_0.02_75)]/50 transition-all text-sm"
                  >
                    <span className="text-[oklch(0.35_0.01_60)]">ワークショップ申し込み</span>
                    <ExternalLink className="w-4 h-4 text-[oklch(0.55_0.12_50)]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="rounded-lg overflow-hidden shadow-md border border-[oklch(0.88_0.02_75)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.5!2d131.4547!3d33.3147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDE4JzUzLjAiTiAxMzHCsDI3JzE3LjAiRQ!5e0!3m2!1sja!2sjp!4v1"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HACHI BEPPU The Sky"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-[oklch(0.25_0.01_60)] text-[oklch(0.8_0.01_80)] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-serif text-2xl tracking-widest mb-3 text-[oklch(0.85_0.08_70)]">
            ♨ 鉄輪温泉ハンドパン部
          </p>
          <p className="text-sm text-[oklch(0.6_0.01_80)] tracking-wider mb-6">
            湯けむりの中で奏でる、鉄の音色
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.08_70)] hover:text-[oklch(0.85_0.08_70)] transition-colors inline-flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
            <a
              href={LINKS.peatixFire}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.08_70)] hover:text-[oklch(0.85_0.08_70)] transition-colors"
            >
              火祭りギャザリング（Peatix）
            </a>
            <a
              href={LINKS.peatixWorkshop}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.08_70)] hover:text-[oklch(0.85_0.08_70)] transition-colors"
            >
              ワークショップ（Peatix）
            </a>
            <a
              href={LINKS.googleMap}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.08_70)] hover:text-[oklch(0.85_0.08_70)] transition-colors"
            >
              会場アクセス（Google Map）
            </a>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent mb-6" />
          <p className="text-xs text-[oklch(0.5_0.01_80)]">
            &copy; 2026 鉄輪温泉ハンドパン部 — HACHI BEPPU The Sky
          </p>
        </div>
      </footer>
    </div>
  );
}
