import siteJa from "./translations/site.ja.json";
import siteEn from "./translations/site.en.json";
import siteKo from "./translations/site.ko.json";
import siteZhTw from "./translations/site.zh-TW.json";

export const languages = ["ja", "en", "ko", "zh-TW"] as const;
export type Language = (typeof languages)[number];
export const siteCatalogs = { ja: siteJa, en: siteEn, ko: siteKo, "zh-TW": siteZhTw };

export const messages: Record<Language, Record<string, string>> = {
  ja: { language: "言語", menu: "メニュー", news: "News", aboutNav: "About", live: "Live", workshop: "Workshop", artists: "Artists", purchase: "購入ガイド", accessNav: "Access", details: "詳細を見る" },
  en: { language: "Language", menu: "Menu", news: "News", aboutNav: "About", live: "Live", workshop: "Workshops", artists: "Artists", purchase: "Buying Guide", accessNav: "Access", details: "More details" },
  ko: { language: "언어", menu: "메뉴", news: "소식", aboutNav: "소개", live: "공연", workshop: "워크숍", artists: "아티스트", purchase: "구매 안내", accessNav: "오시는 길", details: "자세히 보기" },
  "zh-TW": { language: "語言", menu: "選單", news: "消息", aboutNav: "關於", live: "演出", workshop: "工作坊", artists: "演出者", purchase: "購買指南", accessNav: "交通資訊", details: "查看詳情" },
};
export const languageNames: Record<Language, string> = { ja: "日本語", en: "English", ko: "한국어", "zh-TW": "繁體中文" };

export function getLanguage(value: string | null): Language {
  return languages.includes(value as Language) ? (value as Language) : "ja";
}

export function localizedCopy(language: Language, key: string): string {
  const source = siteJa.copy[key as keyof typeof siteJa.copy];
  if (typeof source !== "string") {
    const original = messages.ja[key];
    const candidate = messages[language][key];
    return language === "ja" ? original ?? key : candidate && original && validateString(original, candidate) ? candidate : original ?? key;
  }
  if (language === "ja") return source;
  const candidate = (siteCatalogs[language].copy as Record<string, string>)[key];
  if (typeof candidate !== "string" || !validateString(source, candidate)) return source;
  if (["venueAddress", "sectionAccessSubtitle"].includes(key) && candidate.replace(/\D/g, "") !== source.replace(/\D/g, "")) return source;
  return candidate;
}

function validateString(source: string, candidate: string): boolean {
  if (!candidate.trim()) return false;
  const protectedTokens = (value: string) => [
    ...(value.match(/https?:\/\/\S+/g) ?? []),
    ...(value.match(/(?:¥|￥)\s?[\d,]+|[\d,]+\s?円/g) ?? []).map((amount) => amount.replace(/\D/g, "")),
    ...(value.match(/\d{1,2}:\d{2}/g) ?? []),
    ...(value.match(/20\d{2}/g) ?? []),
  ];
  const sourceTokens = protectedTokens(source);
  const candidateTokens = protectedTokens(candidate);
  if (sourceTokens.some((token) => !candidateTokens.includes(token))) return false;
  if (calendarDates(source).length && calendarDates(source).join(",") !== calendarDates(candidate).join(",")) return false;
  const names = ["Reo Matsumoto", "HACHI BEPPU The Sky", "Hachi Beppu The Sky", "Seiko", "Eidon", "Light", "Shun", "Makiko", "Rin", "Peatix", "Instagram", "YouTube"];
  return names.every((name) => !source.includes(name) || candidate.includes(name));
}

function calendarDates(value: string): string[] {
  const text = String(value);
  const dates: string[] = [];
  const monthNumber: Record<string, number> = { january:1, february:2, march:3, april:4, may:5, june:6, july:7, august:8, september:9, october:10, november:11, december:12 };
  for (const match of text.matchAll(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:\s*[–—-]\s*(\d{1,2}))?/gi)) {
    const month = monthNumber[match[1].toLowerCase()];
    dates.push(`${month}-${match[2]}`);
    if (match[3]) dates.push(`${month}-${match[3]}`);
  }
  for (const match of text.matchAll(/(\d{1,2})月\s*(\d{1,2})(?:日|일)?(?:\s*(?:〜|～|–|—|-|至|到|부터|부터)\s*(\d{1,2})(?:日|일)?)?/g)) {
    dates.push(`${match[1]}-${match[2]}`);
    if (match[3]) dates.push(`${match[1]}-${match[3]}`);
  }
  for (const match of text.matchAll(/(\d{1,2})월\s*(\d{1,2})(?:일)?(?:\s*(?:부터|[~〜–—-])\s*(\d{1,2})일?)?/g)) {
    dates.push(`${match[1]}-${match[2]}`);
    if (match[3]) dates.push(`${match[1]}-${match[3]}`);
  }
  return [...new Set(dates)];
}

function normalizeDate(value: unknown): string {
  const text = String(value ?? "");
  const japanese = text.match(/(\d{1,2})月\s*(\d{1,2})日/);
  if (japanese) return `${japanese[1]}-${japanese[2]}`;
  const english = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/i);
  if (english) {
    const months: Record<string, number> = { january:1, february:2, march:3, april:4, may:5, june:6, july:7, august:8, september:9, october:10, november:11, december:12 };
    return `${months[english[1].toLowerCase()]}-${english[2]}`;
  }
  const localizedMonth = text.match(/(\d{1,2})월\s*(\d{1,2})/);
  if (localizedMonth) return `${localizedMonth[1]}-${localizedMonth[2]}`;
  return text.replace(/\D/g, "");
}

export function localizedRecords(section: "artists" | "members" | "liveSchedule" | "workshopSchedule", language: Language): any[] {
  const source = siteJa[section] as Array<Record<string, unknown>>;
  if (language === "ja") return source;
  const candidate = siteCatalogs[language][section] as Array<Record<string, unknown>>;
  if (!Array.isArray(candidate) || candidate.length !== source.length) return source;
  const valid = candidate.every((record, index) => {
    const original = source[index];
    if (Object.keys(record).sort().join("\0") !== Object.keys(original).sort().join("\0")) return false;
    for (const field of ["name", "date", "time", "price", "capacity", "url", "isSpecial", "isFullDay"] as const) {
      if (original[field] !== undefined) {
        if (field === "date") {
          if (normalizeDate(original[field]) !== normalizeDate(record[field])) return false;
        } else if (field === "price") {
          const digits = (value: unknown) => String(value).replace(/\D/g, "");
          if (digits(original[field]) !== digits(record[field])) return false;
        } else if (original[field] !== record[field]) return false;
      }
    }
    for (const field of ["event", "artist", "note", "price", "capacity", "date"] as const) {
      if (typeof original[field] === "string" && typeof record[field] === "string") {
        const digits = (value: string) => value.match(/\d+/g)?.join("") ?? "";
        if (digits(original[field] as string) !== digits(record[field] as string)) return false;
      }
    }
    for (const [field, value] of Object.entries(original)) {
      if (typeof value === "string" && (value ? !validateString(value, String(record[field] ?? "")) : record[field] !== "")) return false;
    }
    return Object.keys(original).every((key) => typeof record[key] === "string" && String(record[key]).trim().length > 0 || record[key] === "" || typeof original[key] === "boolean" && record[key] === original[key]);
  });
  return valid ? candidate : source;
}

export function localizedAssetText(language: Language, section: "imageAlt" | "video") {
  const source = siteJa[section];
  if (language === "ja") return source;
  const candidate = siteCatalogs[language][section];
  if (Array.isArray(source) && Array.isArray(candidate) && source.length === candidate.length && source.every((original, index) => {
    const row = candidate[index] as Record<string, string>;
    return Object.keys(row).sort().join("\0") === Object.keys(original).sort().join("\0") && Object.entries(original).every(([key, value]) => typeof row[key] === "string" && validateString(String(value), row[key]));
  })) return candidate;
  if (!Array.isArray(source) && !Array.isArray(candidate) && Object.keys(source).sort().join("\0") === Object.keys(candidate).sort().join("\0") && Object.entries(source).every(([key, value]) => typeof (candidate as Record<string, string>)[key] === "string" && validateString(String(value), (candidate as Record<string, string>)[key]))) return candidate;
  return source;
}

export function validateTranslation<T extends Record<string, unknown>>(source: T, translation: Partial<T>, language: Language): boolean {
  const protectedValues = ["time", "price", "url", "link", "name", "date"] as const;
  for (const key of protectedValues) {
    if (translation[key] !== undefined && source[key] !== translation[key]) return false;
  }
  if (source.statusLabel) {
    const expected = { en: "Registration closed", ko: "접수 종료", "zh-TW": "報名已截止" }[language];
    if (translation.statusLabel !== expected) return false;
  }
  if (String(source.title ?? "").includes("開催終了")) {
    const completed = { en: "completed", ko: "종료", "zh-TW": "已結束" }[language];
    if (!String(translation.title ?? "").toLowerCase().includes(completed.toLowerCase())) return false;
  }
  if (typeof source.title === "string" && typeof translation.title === "string") {
    const sourceText = `${source.title} ${String(source.body ?? "")}`;
    const translationText = `${translation.title} ${String(translation.body ?? "")}`;
    const tokens = (text: string) => ({
      years: Array.from(text.matchAll(/20\d{2}/g), (match) => match[0]),
      times: Array.from(text.matchAll(/\d{1,2}:\d{2}/g), (match) => match[0]),
      prices: Array.from(text.matchAll(/(?:¥|￥)\s?[\d,]+|[\d,]+\s?円/g), (match) => match[0].replace(/\D/g, "")),
    });
    const expected = tokens(sourceText);
    const found = tokens(translationText);
    if (expected.years.some((value) => !found.years.includes(value))) return false;
    if (expected.times.some((value) => !found.times.includes(value))) return false;
    if (expected.prices.some((value) => !found.prices.includes(value))) return false;
    if (calendarDates(sourceText).join(",") !== calendarDates(translationText).join(",")) return false;
  }
  const sourceText = `${String(source.title ?? "")} ${String(source.body ?? "")}`;
  const translationText = `${String(translation.title ?? "")} ${String(translation.body ?? "")}`;
  const protectedNames = ["RRyusuque", "Shun Yokoyama", "SoLua", "Solfeggio Resonance Lab", "Hachi Beppu", "selected_handpan", "herbioFarm", "Reo Matsumoto", "@hachibeppu", "@greenwater014", "@shin0326.solfeggio", "@solfeggio_resonance_lab", "@_sato_aya_"];
  if (protectedNames.some((name) => sourceText.includes(name) && !translationText.includes(name))) return false;
  return true;
}
