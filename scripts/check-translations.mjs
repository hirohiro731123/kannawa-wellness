import { readFile } from "node:fs/promises";

const locales = ["en", "ko", "zh-TW"];
const fail = [];
const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
const ja = await readJson("translations/site.ja.json");
const site = Object.fromEntries(await Promise.all(locales.map(async (locale) => [locale, await readJson(`translations/site.${locale}.json`)])));
const news = Object.fromEntries(await Promise.all(["en", ...locales.filter((locale) => locale !== "en")].map(async (locale) => [locale, await readJson(`translations/news.${locale}.json`)])));
const check = (condition, message) => { if (!condition) fail.push(message); };
const keys = (value) => Object.keys(value).sort().join("\0");
const digits = (value) => String(value ?? "").replace(/\D/g, "");
const normalizeDate = (value) => {
  const text = String(value ?? "");
  const match = text.match(/(?:4月\s*|April\s+|4월\s*)(\d{1,2})(?:日)?(?:\s*[〜–-]\s*(\d{1,2})(?:日)?)?/i);
  if (match) {
    const start = text.includes("4月") || text.includes("4월") ? `4-${match[1]}` : `4-${match[1]}`;
    return `${start}${match[2] ? `-${match[2]}` : ""}`;
  }
  return digits(text);
};
const timeValues = (value) => String(value ?? "").match(/\d{1,2}:\d{2}/g) ?? [];
const moneyValues = (value) => (String(value ?? "").match(/(?:¥|￥)\s?[\d,]+|[\d,]+\s?円/g) ?? []).map(digits);
const dateValues = (value) => {
  const text = String(value ?? "");
  const out = [];
  const monthNames = { january:1, february:2, march:3, april:4, may:5, june:6, july:7, august:8, september:9, october:10, november:11, december:12 };
  for (const match of text.matchAll(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:\s*[–—-]\s*(\d{1,2}))?/gi)) {
    out.push(`${monthNames[match[1].toLowerCase()]}-${match[2]}`);
    if (match[3]) out.push(`${monthNames[match[1].toLowerCase()]}-${match[3]}`);
  }
  for (const match of text.matchAll(/(\d{1,2})月\s*(\d{1,2})(?:日|일)?(?:\s*(?:〜|～|–|—|-|至|到|부터)\s*(\d{1,2})(?:日|일)?)?/g)) {
    out.push(`${match[1]}-${match[2]}`);
    if (match[3]) out.push(`${match[1]}-${match[3]}`);
  }
  for (const match of text.matchAll(/(\d{1,2})월\s*(\d{1,2})(?:일)?(?:\s*(?:부터|[~〜–—-])\s*(\d{1,2})일?)?/g)) {
    out.push(`${match[1]}-${match[2]}`);
    if (match[3]) out.push(`${match[1]}-${match[3]}`);
  }
  return [...new Set(out)];
};
const protectedProperNames = ["Reo Matsumoto", "HACHI BEPPU The Sky", "Hachi Beppu The Sky", "Seiko", "Eidon", "Light", "Shun", "Makiko", "Rin", "Peatix", "Instagram", "YouTube", "RRyusuque", "SoLua", "Yishama", "herbioFarm", "selected_handpan", "@hachibeppu", "@greenwater014", "@shin0326.solfeggio", "@solfeggio_resonance_lab", "@_sato_aya_"];

for (const locale of locales) {
  const translated = site[locale];
  check(keys(translated.copy) === keys(ja.copy), `${locale}: UI copy keys differ from Japanese source`);
  for (const [key, sourceText] of Object.entries(ja.copy)) {
    const value = translated.copy?.[key];
    check(typeof value === "string" && value.trim().length > 0, `${locale}: missing copy.${key}`);
    if (typeof value !== "string") continue;
    for (const year of sourceText.match(/20\d{2}/g) ?? []) check(value.includes(year), `${locale}: copy.${key} is missing year ${year}`);
    for (const time of timeValues(sourceText)) check(timeValues(value).includes(time), `${locale}: copy.${key} is missing time ${time}`);
    for (const amount of moneyValues(sourceText)) check(moneyValues(value).includes(amount), `${locale}: copy.${key} changes or omits price ${amount}`);
    const sourceDates = dateValues(sourceText);
    if (sourceDates.length) check(sourceDates.join(",") === dateValues(value).join(","), `${locale}: copy.${key} changes or omits a date`);
    if (["venueAddress", "sectionAccessSubtitle"].includes(key)) check(digits(value) === digits(sourceText), `${locale}: copy.${key} changes address numbers`);
    for (const url of sourceText.match(/https?:\/\/[^\s)]+/g) ?? []) check(value.includes(url), `${locale}: copy.${key} changes URL ${url}`);
    for (const name of protectedProperNames) if (sourceText.includes(name)) check(value.includes(name), `${locale}: copy.${key} omits protected name ${name}`);
  }

  for (const section of ["artists", "members", "liveSchedule", "workshopSchedule"]) {
    const originalRows = ja[section];
    const translatedRows = translated[section];
    check(Array.isArray(translatedRows) && translatedRows.length === originalRows.length, `${locale}: ${section} row count differs from Japanese source`);
    if (!Array.isArray(translatedRows)) continue;
    for (let index = 0; index < originalRows.length; index++) {
      const source = originalRows[index];
      const row = translatedRows[index];
      if (!row) { fail.push(`${locale}: ${section}[${index}] is missing`); continue; }
      check(keys(row) === keys(source), `${locale}: ${section}[${index}] fields differ from Japanese source`);
      for (const field of Object.keys(source)) {
        if (typeof source[field] === "boolean") check(row[field] === source[field], `${locale}: ${section}[${index}] changes ${field}`);
        else if (typeof source[field] === "string") check(typeof row[field] === "string", `${locale}: ${section}[${index}].${field} is missing`);
      }
      if (source.date !== undefined) check(normalizeDate(row.date) === normalizeDate(source.date), `${locale}: ${section}[${index}] changes date`);
      for (const field of ["price", "capacity"]) if (source[field] !== undefined) check(digits(row[field]) === digits(source[field]), `${locale}: ${section}[${index}] changes ${field}`);
      if (source.time !== undefined) check(row.time === source.time, `${locale}: ${section}[${index}] changes time`);
      for (const field of ["name", "url"]) if (source[field] !== undefined) check(row[field] === source[field], `${locale}: ${section}[${index}] changes ${field}`);
      for (const field of ["date", "event", "artist", "note", "price", "capacity"]) {
        for (const name of protectedProperNames) if (String(source[field] ?? "").includes(name)) check(String(row[field] ?? "").includes(name), `${locale}: ${section}[${index}].${field} omits protected name ${name}`);
      }
      check(digits(row.artist) === digits(source.artist), `${locale}: ${section}[${index}] changes price or numeric detail in artist/event field`);
      check(digits(row.note) === digits(source.note), `${locale}: ${section}[${index}] changes numeric detail in note`);
    }
  }

  check(keys(translated.imageAlt) === keys(ja.imageAlt), `${locale}: image alt-text keys differ from Japanese source`);
  for (const [key, value] of Object.entries(ja.imageAlt)) check(typeof translated.imageAlt?.[key] === "string" && translated.imageAlt[key].trim(), `${locale}: missing imageAlt.${key}`);
  check(translated.video?.length === ja.video.length, `${locale}: video metadata count differs from Japanese source`);
  for (let index = 0; index < ja.video.length; index++) for (const field of ["title", "description"]) check(typeof translated.video?.[index]?.[field] === "string" && translated.video[index][field].trim(), `${locale}: missing video[${index}].${field}`);

  const sourceNews = news.en;
  const translatedNews = news[locale];
  check(translatedNews.length === sourceNews.length, `${locale}: news item count differs from English reference`);
  for (let index = 0; index < sourceNews.length; index++) {
    const source = sourceNews[index];
    const row = translatedNews[index];
    if (!row) { fail.push(`${locale}: news[${index}] is missing`); continue; }
    check(Boolean(row.title && row.body), `${locale}: news[${index}] is missing title/body`);
    check(Boolean(row.statusLabel) === Boolean(source.statusLabel), `${locale}: news[${index}] changes registration status`);
    check(!("link" in row) && !("url" in row), `${locale}: news[${index}] contains an override URL`);
    for (const year of `${source.title} ${source.body}`.match(/20\d{2}/g) ?? []) check(`${row.title} ${row.body}`.includes(year), `${locale}: news[${index}] omits year ${year}`);
    for (const time of timeValues(`${source.title} ${source.body}`)) check(timeValues(`${row.title} ${row.body}`).includes(time), `${locale}: news[${index}] omits time ${time}`);
    for (const amount of moneyValues(`${source.title} ${source.body}`)) check(moneyValues(`${row.title} ${row.body}`).includes(amount), `${locale}: news[${index}] changes or omits price ${amount}`);
    const sourceDates = dateValues(`${source.title} ${source.body}`);
    if (sourceDates.length) check(sourceDates.join(",") === dateValues(`${row.title} ${row.body}`).join(","), `${locale}: news[${index}] changes or omits a date (${dateValues(`${row.title} ${row.body}`).join(",") || "none"}; expected ${sourceDates.join(",")})`);
    for (const name of protectedProperNames) if (`${source.title} ${source.body}`.includes(name)) check(`${row.title} ${row.body}`.includes(name), `${locale}: news[${index}] omits protected name ${name}`);
  }
  const expectedClosed = { en: "Registration closed", ko: "접수 종료", "zh-TW": "報名已截止" }[locale];
  check(translated.copy.closed === expectedClosed, `${locale}: event status label is not the approved closed state`);
  for (let index = 0; index < news.en.length; index++) if (news.en[index].statusLabel) check(news[locale][index]?.statusLabel === expectedClosed, `${locale}: news[${index}] event status text is incorrect`);
  const completedMarker = { en: "completed", ko: "종료", "zh-TW": "已結束" }[locale];
  for (let index = 0; index < news.en.length; index++) if (news.en[index].title.toLowerCase().includes("completed")) check(news[locale][index]?.title.toLowerCase().includes(completedMarker.toLowerCase()), `${locale}: news[${index}] loses its completed event status`);
}

const home = await readFile(new URL("../Home.tsx", import.meta.url), "utf8");
const copyCalls = [...home.matchAll(/t\("([^"\n]+)"\)/g)].map((match) => match[1]);
const legacy = await readFile(new URL("../i18n.ts", import.meta.url), "utf8");
const jaMessages = legacy.match(/ja:\s*\{([^}]+)\}/s)?.[1] ?? "";
const legacyKeys = [...jaMessages.matchAll(/([A-Za-z][A-Za-z0-9]*):/g)].map((match) => match[1]);
for (const key of copyCalls) check(key in ja.copy || legacyKeys.includes(key), `Home.tsx uses untranslated or undefined key t("${key}")`);

if (fail.length) {
  console.error(fail.map((message) => `✗ ${message}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Site translation consistency passed: ${locales.length} locales; ${Object.keys(ja.copy).length} UI strings; ${ja.liveSchedule.length} live events; ${ja.workshopSchedule.length} workshop rows; ${ja.artists.length} artists; ${ja.members.length} members; ${ja.video.length} video entries; ${news.en.length} news items.`);
}
