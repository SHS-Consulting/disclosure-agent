import { publicProcedure, router } from "./_core/trpc";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

// Cache: 15 Minuten
let newsCache: NewsItem[] = [];
let lastFetch = 0;
const CACHE_TTL = 15 * 60 * 1000;

const RSS_FEEDS = [
  {
    url: "https://www.newsnationnow.com/space/ufo/feed/",
    source: "NewsNation UAP",
  },
  {
    url: "https://thedebrief.org/feed/",
    source: "The Debrief",
  },
  {
    url: "https://www.mysterywire.com/feed/",
    source: "Mystery Wire",
  },
];

function extractText(str: string): string {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .trim();
}

function parseRSS(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches.slice(0, 8)) {
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);

    if (!titleMatch || !linkMatch) continue;

    const title = extractText(titleMatch[1]);
    const link = extractText(linkMatch[1]);
    const pubDate = pubDateMatch ? extractText(pubDateMatch[1]) : "";
    const description = descMatch
      ? extractText(descMatch[1]).slice(0, 120) + "..."
      : "";

    // Nur UAP/UFO/Disclosure-relevante Artikel
    const keywords = [
      "ufo", "uap", "alien", "disclosure", "extraterrestrial",
      "pentagon", "pursue", "grusch", "elizondo", "coulthart",
      "sighting", "anomalous", "phenomena", "nhi", "crash",
      "whistleblower", "classified", "declassified", "stratton",
      "corbell", "knapp", "skinwalker", "roswell", "rendlesham",
      "ufology", "unidentified", "non-human", "aaro", "aatip",
      "fastwalker", "orb", "triangle craft", "immaculate",
      "congress ufo", "senate ufo", "spacecraft", "interdimensional",
    ];
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();
    const isRelevant = keywords.some((kw) => lowerTitle.includes(kw) || lowerDesc.includes(kw));

    if (title && link && isRelevant) {
      items.push({ title, link, pubDate, source, description });
    }
  }
  return items;
}

async function fetchNews(): Promise<NewsItem[]> {
  const now = Date.now();
  if (newsCache.length > 0 && now - lastFetch < CACHE_TTL) {
    return newsCache;
  }

  const allItems: NewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; DisclosureAgent/1.0; +https://disclosure.kitaskforce.com)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRSS(xml, feed.source);
      allItems.push(...items);
    } catch {
      // Feed nicht erreichbar — überspringen
    }
  }

  // Sortieren nach Datum (neueste zuerst)
  allItems.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  // Deduplizieren nach Titel
  const seen = new Set<string>();
  const deduped = allItems.filter((item) => {
    const key = item.title.slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length > 0) {
    newsCache = deduped.slice(0, 20);
    lastFetch = now;
  }

  return newsCache;
}

export const newsRouter = router({
  getLatest: publicProcedure.query(async () => {
    const items = await fetchNews();
    return { items, fetchedAt: new Date().toISOString() };
  }),
});
