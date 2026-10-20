/*
  Design: 「湯けむりジャポニズム」— 和モダン×温泉蒸気
  - 墨色ベース、温泉乳白色、鉄錆色アクセント
  - Noto Serif JP (見出し) + Noto Sans JP (本文)
  - 湯けむりアニメーション、和紙テクスチャ
*/

import { useEffect, useRef, useState } from "react";
import { getLanguage, languageNames, languages, localizedAssetText, localizedCopy, localizedRecords, messages, siteCatalogs, validateTranslation, type Language } from "./i18n";
import newsEn from "./translations/news.en.json";
import newsKo from "./translations/news.ko.json";
import newsZhTw from "./translations/news.zh-TW.json";
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
  googleMap: "https://www.google.com/maps/search/HACHI+BEPPU+The+Sky+%E5%A4%A7%E5%88%86%E7%9C%8C%E5%88%A5%E5%BA%9C%E5%B8%82%E9%89%84%E8%BC%AA796-18",
  instagram: "https://www.instagram.com/hachibeppu/",
};

// ============================================================
// NEWS DATA — ここを編集してお知らせを追加・更新してください
// ============================================================
// 各ニュースは { date, title, body, link?, linkLabel? } の形式です。
// link と linkLabel は任意です（リンクが不要なら省略可）。
// 新しいニュースを配列の先頭に追加すると、上に表示されます。
const newsItems: { date: string; title: string; body: string; link?: string; linkLabel?: string; statusLabel?: string; isNew?: boolean }[] = [
{
  date: "2026.10.20",
  title: "ハンドパン体験！Onsen meets Handpan! 10月31日開催",
  body: `温泉とハンドパンが出会う、特別な体験イベント。

鉄輪温泉の「はち別府 The Sky」で、ハンドパンの神秘的な音色を楽しんでみませんか？
初めての方も歓迎。プレミアムハンドパンの無料レンタル付きです。

📅 日時：2026年10月31日（土）14:00〜17:00
📍 会場：はち別府 The Sky
👥 定員：4名／回
🎫 参加料：3,500円
🎶 ハンドパン体験（楽器レンタル無料）

事前予約はInstagram @hachibeppu まで。
`,
  link: "https://www.instagram.com/p/Debren_D3s1/?utm_source=ig_web_copy_link&vrfl=MWQ1ZGUxMzBkMA==&srtk=MWQ1ZGUxMzBkMA==",
  linkLabel: "Instagramで詳細・予約を確認",
  isNew: true,
},
{
  date: "2026.09.23",
  title: "🍁 Sound & Stillness — Autumn Equinox Handpan Gathering（開催終了）",
  body: `秋分の日、別府・鉄輪温泉の永福寺で開催された、ハンドパンの音に包まれる特別な音楽イベント。

世界各地で演奏やワークショップを行うRRyusuque、山形から大分へ移住し音楽活動を展開するShun Yokoyama、そしてSoLua（Shin & Nari）が出演。
Yishamaのハンドパンによる美しい響きを間近で楽しめる機会となりました。

演奏に加え、ハンドパンの無料体験や、herbioFarm代表・佐藤あやによるハーブティーの出店も行われました。

📅 開催日：2026年9月23日（水・祝）
🕓 時間：16:00〜18:30
　無料体験：16:00〜16:30
　ライブ演奏：16:30〜18:00
📍 会場：永福寺｜別府・鉄輪温泉
🎫 入場料：2,500円
🎶 ハンドパンライブ・無料体験
🌿 herbioFarmのハーブティー
🌏 English Welcome

出演者・関連アカウント：
RRyusuque @rryusuque
Shun Yokoyama @greenwater014
SoLua @shin0326.solfeggio
Solfeggio Resonance Lab @solfeggio_resonance_lab
はち別府 @hachibeppu
selected_handpan @selected_handpan
herbioFarm／佐藤あや @_sato_aya_

秋の始まり、温泉の街・別府で音楽と静けさを味わうイベントとして開催されました。`,
  link: "https://www.instagram.com/hachibeppu/",
  linkLabel: "はち別府のInstagramを見る",
  isNew: false,
},
  {
    date: "2026.05.29",
    title: "5月31日 (日)　17:00~19:00  ハンドパンOpenDay with Reo Matsumoto ゲリラ開催！",
    body: `やったことないけどハンドパンに興味がある方、すでにハンドパンに沼っている方まで、チャンスです！

なんと！世界のトップハンドパンプレイヤー Reo Matsumotoさんが、ハンドパンOpenDay＠鉄輪温泉を開催します😀

湯けむりをバックにReoさんの奏でるハンドパンの音色に酔うもよし、ハンドパンって何？と興味ある方から、すでにハンドパンに沼っている方まで、集まったみんなで楽しむ2時間です。
（鉄の輪と書いてかんなわ、鉄の輪の楽器ハンドパンのコラボです）

特に当日の細かい予定は決めていません。当日の天気と人数に応じて内容は変わると思います。

📍 会場：はち別府The Sky
階段がありますので、ご了承ください。お子様連れ参加は、ご家族様による安全管理が可能な場合のみOKです。

💰 ドネーション制
🍱 飲食はお好きなものをご自身で持ち込みください

🅿️ 駐車場は鉄輪温泉地区駐車場をご利用ください`,
    link: "https://maps.app.goo.gl/jGrnxRosWvgj8ybR8",
    linkLabel: "会場をマップで見る",
    isNew: true,
  },
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
    statusLabel: "受付終了",
    isNew: true,
  },
  {
    date: "2026.03.18",
    title: "ワークショップ体験レッスン",
    body: "初心者歓迎！60分の体験レッスン（¥3,000）と1日レッスン受け放題（¥10,000）の2コースをご用意しています。",
    statusLabel: "受付終了",
  },
];

// ============================================================
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    try { return getLanguage(window.localStorage.getItem("kannawa-language")); }
    catch { return "ja"; }
  });
  const t = (key: string) => localizedCopy(language, key);
  const localizedArtists = localizedRecords("artists", language);
  const localizedMembers = localizedRecords("members", language);
  const localizedLiveSchedule = localizedRecords("liveSchedule", language);
  const localizedWorkshopSchedule = localizedRecords("workshopSchedule", language);
  const assetText = localizedAssetText(language, "imageAlt") as typeof siteCatalogs.ja.imageAlt;
  const videos = localizedAssetText(language, "video") as typeof siteCatalogs.ja.video;
  const newsTranslations = { en: newsEn, ko: newsKo, "zh-TW": newsZhTw } as const;
  const navItems = [
    ["news", "#news"],
    ["aboutNav", "#about"],
    ["live", "#live"],
    ["workshop", "#workshop"],
    ["artists", "#artists"],
    ["purchase", "#buying"],
    ["accessNav", "#access"],
  ] as const;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "ja" ? localizedCopy(language, "brand") : `${localizedCopy(language, "brand")} | Kannawa Onsen`;
    try { window.localStorage.setItem("kannawa-language", language); } catch { /* Keep the selected language for this visit. */ }
  }, [language]);

  const localizedNews = (item: (typeof newsItems)[number], index: number) => {
    if (language === "ja") return item;
    const translated = newsTranslations[language][index];
    if (!translated || !validateTranslation(item, translated, language)) return item;
    return { ...item, ...translated };
  };

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
        <div className="relative max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <a href="#" className="flex min-w-0 max-w-[calc(100vw-11rem)] items-center gap-2 sm:max-w-none">
            <span className="block min-w-0 truncate text-sm sm:text-lg font-bold font-serif tracking-widest text-[oklch(0.25_0.01_60)]">
              ♨ {t("brand")}
            </span>
          </a>
          <div className="hidden min-[1100px]:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm tracking-wider">
            {navItems.map(([key, href]) => (
              <a key={key} href={href} className="whitespace-nowrap text-[oklch(0.35_0.01_60)] hover:text-[oklch(0.55_0.12_50)] transition-colors">
                {t(key)}
              </a>
            ))}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="min-[1100px]:hidden inline-flex h-9 w-9 items-center justify-center rounded border border-[oklch(0.75_0.02_70)] bg-white/80 text-[oklch(0.35_0.01_60)] hover:bg-white"
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
          </button>
          <label className="flex shrink-0 items-center gap-2 text-sm text-[oklch(0.35_0.01_60)]" aria-label={t("language")}>
            <span className="sr-only">{t("language")}</span>
            <select value={language} onChange={(event) => setLanguage(getLanguage(event.target.value))} className="rounded border border-[oklch(0.88_0.02_75)] bg-white/80 px-2 py-1">
              {languages.map((code) => <option key={code} value={code}>{languageNames[code]}</option>)}
            </select>
          </label>
          </div>
          {menuOpen && (
            <div id="primary-navigation-menu" className="absolute right-4 top-full z-50 min-[1100px]:hidden min-w-48 rounded-lg border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)]/95 p-2 shadow-lg backdrop-blur">
              {navItems.map(([key, href]) => (
                <a key={key} href={href} onClick={() => setMenuOpen(false)} className="block rounded px-3 py-2 text-sm tracking-wider text-[oklch(0.35_0.01_60)] hover:bg-[oklch(0.93_0.02_75)] hover:text-[oklch(0.55_0.12_50)]">
                  {t(key)}
                </a>
              ))}
            </div>
          )}
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
              {t("tagline")}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[oklch(0.2_0.01_60)] tracking-wider font-serif leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
              {t("heroPlace")}
              <br />
              <span className="text-[oklch(0.45_0.12_50)]">{t("heroClub")}</span>
            </h1>
            <p className="mt-6 text-[oklch(0.35_0.01_60)]/70 text-base md:text-lg tracking-wider font-light max-w-xl mx-auto">
              {t("heroDates")}
            </p>
            <p className="mt-2 text-[oklch(0.4_0.01_60)]/60 text-sm tracking-wider">
                {t("heroType")}
            </p>
          </motion.div>

          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 text-[oklch(0.35_0.01_60)]/60 hover:text-[oklch(0.2_0.01_60)] transition-colors"
            aria-label={t("scroll")}
          >
            <ChevronDown className="w-8 h-8 animate-gentle-float" />
          </motion.button>
        </div>
      </header>

      {/* News Section */}
      <AnimatedSection id="news" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle subtitle={t("sectionNewsSubtitle")}>{t("news")}</SectionTitle>

          <div className="space-y-0">
            {newsItems.map((sourceItem, i) => {
              const item = localizedNews(sourceItem, i);
              return (
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
                        {item.linkLabel || t("details")}
                      </a>
                    )}
                    {item.statusLabel && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-[oklch(0.45_0.02_60)] bg-[oklch(0.93_0.02_75)] rounded">
                        {item.statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
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
          <SectionTitle subtitle={t("sectionAboutSubtitle")}>{t("sectionAbout")}</SectionTitle>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
            <div className="space-y-6">
              <p className="text-[oklch(0.35_0.01_60)] leading-relaxed text-base">
                {t("aboutLead")}
              </p>
              <p className="text-[oklch(0.35_0.01_60)] leading-relaxed text-base">
                {t("aboutBody")}
              </p>
              <p className="text-[oklch(0.35_0.01_60)] leading-relaxed text-base">
                {t("aboutVenueLead")}
                <a
                  href={LINKS.googleMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.55_0.12_50)] hover:underline font-medium"
                >
                  HACHI BEPPU The Sky
                </a>
                {t("aboutVenueTail")}
              </p>
              <p className="text-[oklch(0.5_0.02_60)] text-sm leading-relaxed">
                {t("aboutWelcome")}
              </p>
            </div>
            <div className="relative">
              <img
                src={IMAGES.handpan}
                alt={assetText.handpan}
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
          <SectionTitle subtitle={t("sectionLiveSubtitle")}>{t("sectionLive")}</SectionTitle>

          <div className="relative mb-8">
            <img
              src={IMAGES.live}
              alt={assetText.live}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.01_60)]/60 to-transparent rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm tracking-wider opacity-80">Handpan Sound Bath</p>
              <p className="text-2xl font-serif font-bold tracking-wider">{t("soundBath")}</p>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[oklch(0.55_0.12_50)]/30">
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnDate")}</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnTime")}</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnEvent")}</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnPlace")}</th>
                  <th className="py-3 px-3 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnArtist")}</th>
                </tr>
              </thead>
              <tbody>
                {localizedLiveSchedule.map((item, i) => (
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
              alt={assetText.fire}
              className="w-full h-72 md:h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-amber-300/90 text-xs tracking-[0.3em] uppercase mb-2">Special Event</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wider mb-2">
                {t("festivalTitle")}
              </h3>
              <p className="text-white/80 text-sm mb-1">
                {t("festivalWhen")}
              </p>
              <p className="text-white/60 text-sm mb-4">
                {t("festivalCost")}
              </p>
              <span className="inline-flex items-center gap-2 bg-[oklch(0.93_0.02_75)] border border-[oklch(0.88_0.02_75)] text-[oklch(0.45_0.02_60)] px-6 py-3 rounded-lg text-sm font-medium tracking-wider">
                {t("closed")}
              </span>
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
          <SectionTitle subtitle={t("sectionWorkshopSubtitle")}>{t("sectionWorkshop")}</SectionTitle>

          <div className="relative mb-10">
            <img
              src={IMAGES.workshop}
              alt={assetText.workshop}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.01_60)]/60 to-transparent rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm tracking-wider opacity-80">Handpan Workshop by Light</p>
              <p className="text-2xl font-serif font-bold tracking-wider">{t("workshopExperience")}</p>
            </div>
          </div>

          {/* Workshop Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
              <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3">
                {t("trialCourse")}
              </h4>
              <p className="text-[oklch(0.4_0.01_60)] text-sm leading-relaxed mb-2">
                {t("trialPrice")}
              </p>
              <ul className="text-[oklch(0.5_0.02_60)] text-sm space-y-1">
                <li>・{t("trialPoint1")}</li>
                <li>・{t("trialPoint2")}</li>
                <li>・{t("trialPoint3")}</li>
                <li>・{t("trialPoint4")}</li>
              </ul>
            </div>
            <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
              <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3">
                {t("fullDayCourse")}
              </h4>
              <p className="text-[oklch(0.4_0.01_60)] text-sm leading-relaxed mb-2">
                {t("fullDayPrice")}
              </p>
              <ul className="text-[oklch(0.5_0.02_60)] text-sm space-y-1">
                <li>・{t("fullDayPoint1")}</li>
                <li>・{t("fullDayPoint2")}</li>
                <li>・{t("fullDayPoint3")}</li>
                <li>・{t("fullDayPoint4")}</li>
              </ul>
            </div>
          </div>

          {/* Workshop Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[oklch(0.55_0.12_50)]/30">
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnDate")}</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnDay")}</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnTime")}</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnDetails")}</th>
                  <th className="py-3 px-2 text-left font-serif text-[oklch(0.35_0.01_60)] tracking-wider">{t("columnPriceNotes")}</th>
                </tr>
              </thead>
              <tbody>
                {localizedWorkshopSchedule.map((item, i) => (
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
                        siteCatalogs.ja.workshopSchedule[i].day === "土" ? "bg-blue-100 text-blue-700" :
                        siteCatalogs.ja.workshopSchedule[i].day === "日" ? "bg-red-100 text-red-700" :
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
            <span className="inline-flex items-center gap-2 bg-[oklch(0.93_0.02_75)] border border-[oklch(0.88_0.02_75)] text-[oklch(0.45_0.02_60)] px-8 py-4 rounded-lg text-base font-medium tracking-wider">
              {t("closed")}
            </span>
            <p className="mt-3 text-[oklch(0.5_0.02_60)] text-sm">
              {t("venueMapLead")}
              <a
                href={LINKS.googleMap}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.55_0.12_50)] hover:underline"
              >
                {t("googleMapName")}
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
          <SectionTitle subtitle={t("sectionArtistsSubtitle")}>{t("artists")}</SectionTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {localizedArtists.map((artist, i) => (
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
          <SectionTitle subtitle={t("sectionMembersSubtitle")}>{t("sectionMembers")}</SectionTitle>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {localizedMembers.map((member, i) => (
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
          <SectionTitle subtitle={t("sectionBuyingSubtitle")}>{t("sectionBuying")}</SectionTitle>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-8 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <ShoppingBag className="w-6 h-6 text-[oklch(0.55_0.12_50)] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-xl text-[oklch(0.3_0.01_60)] tracking-wider mb-3">
                    {t("buyingLead")}
                  </h3>
                  <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed mb-3">
                    {t("buyingBody1")}
                  </p>
                  <p className="text-sm text-[oklch(0.45_0.01_60)] leading-relaxed">
                    {t("buyingBody2")}
                  </p>
                </div>
              </div>
            </div>

            {/* Reo Matsumoto Videos */}
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] tracking-wider flex items-center gap-2">
                <Play className="w-5 h-5 text-[oklch(0.55_0.12_50)]" />
                {t("videoSection")}
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/LL3VktuWqNM"
                      title={videos[0].title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm text-[oklch(0.3_0.01_60)] mb-1">{videos[0].title}</p>
                    <p className="text-xs text-[oklch(0.5_0.02_60)]">{videos[0].description}</p>
                  </div>
                </div>

                <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/LKGIQUBOa9Y"
                      title={videos[1].title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm text-[oklch(0.3_0.01_60)] mb-1">{videos[1].title}</p>
                    <p className="text-xs text-[oklch(0.5_0.02_60)]">{videos[1].description}</p>
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
                  {t("youtubeChannel")}
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
          <SectionTitle subtitle={t("sectionAccessSubtitle")}>{t("sectionAccess")}</SectionTitle>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
                <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[oklch(0.55_0.12_50)]" />
                  {t("venueDisplayName")}
                </h4>
                <p className="text-[oklch(0.4_0.01_60)] text-sm leading-relaxed mb-4">
                  {t("venueAddress")}
                  <br />
                  {t("venueDescription")}
                  <br />
                  {t("venueFeature")}
                </p>
                <a
                  href={LINKS.googleMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[oklch(0.55_0.12_50)] hover:text-[oklch(0.5_0.13_50)] text-sm font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  {t("googleMap")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-[oklch(0.98_0.008_80)] border border-[oklch(0.88_0.02_75)] rounded-lg p-6">
                <h4 className="font-serif font-bold text-lg text-[oklch(0.35_0.01_60)] mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[oklch(0.55_0.12_50)]" />
                  {t("booking")}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[oklch(0.88_0.02_75)] text-sm">
                    <span className="text-[oklch(0.35_0.01_60)]">{t("fireGathering")}</span>
                    <span className="text-[oklch(0.5_0.02_60)]">{t("closed")}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[oklch(0.88_0.02_75)] text-sm">
                    <span className="text-[oklch(0.35_0.01_60)]">{t("workshop")}</span>
                    <span className="text-[oklch(0.5_0.02_60)]">{t("closed")}</span>
                  </div>
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
                title={t("venueDisplayName")}
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-[oklch(0.25_0.01_60)] text-[oklch(0.8_0.01_80)] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-serif text-2xl tracking-widest mb-3 text-[oklch(0.85_0.08_70)]">
            ♨ {t("brand")}
          </p>
          <p className="text-sm text-[oklch(0.6_0.01_80)] tracking-wider mb-6">
            {t("tagline")}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.08_70)] hover:text-[oklch(0.85_0.08_70)] transition-colors inline-flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              {t("instagramName")}
            </a>
            <span className="text-[oklch(0.65_0.08_70)]">{t("footerEventClosed")}</span>
            <span className="text-[oklch(0.65_0.08_70)]">{t("footerWorkshopClosed")}</span>
            <a
              href={LINKS.googleMap}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.65_0.08_70)] hover:text-[oklch(0.85_0.08_70)] transition-colors"
            >
              {t("accessLink")}
            </a>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.55_0.12_50)]/30 to-transparent mb-6" />
          <p className="text-xs text-[oklch(0.5_0.01_80)]">
            {t("footerCopyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
