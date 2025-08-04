import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "url.json"), "utf-8")
);

const BASE_URL = "https://poyzen.uz";
const now = new Date().toISOString();
const LANGS = ["ru", "uz"];

function generateUrlTag(loc, changefreq = "weekly", priority = "0.5") {
  const hreflangs = LANGS.map(
    (lang) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc.replace(
        "/ru",
        `/${lang}`
      )}"/>`
  ).join("\n");

  return `
  <url>
    <loc>${loc}</loc>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 1. Statik sahifalar
const staticPages = [
  { loc: `${BASE_URL}/ru`, changefreq: "daily", priority: "1.0" },
  { loc: `${BASE_URL}/ru/products`, changefreq: "weekly", priority: "0.8" },
  { loc: `${BASE_URL}/ru/brands`, changefreq: "monthly", priority: "0.6" },
  { loc: `${BASE_URL}/ru/likes`, changefreq: "weekly", priority: "0.5" },
  { loc: `${BASE_URL}/ru/cart`, changefreq: "weekly", priority: "0.5" },
];

// 2. Dinamik sahifalar
const brandSet = new Set();
const dynamicPages = [];

data.forEach(({ id, brand, nameUrl }) => {
  const brandSlug = brand.toLowerCase().replace(/\s+/g, "-");

  // Brend sahifasi
  if (!brandSet.has(brandSlug)) {
    brandSet.add(brandSlug);
    dynamicPages.push({
      loc: `${BASE_URL}/ru/brand/${brandSlug}`,
      changefreq: "weekly",
      priority: "0.6",
    });
  }

  // Mahsulot sahifasi
  dynamicPages.push({
    loc: `${BASE_URL}/ru/${brandSlug}/${nameUrl}/${id}`,
    changefreq: "daily",
    priority: "0.7",
  });
});

// XML taglarini yig‘ish
const urls = [
  ...staticPages.map((p) => generateUrlTag(p.loc, p.changefreq, p.priority)),
  ...dynamicPages.map((p) => generateUrlTag(p.loc, p.changefreq, p.priority)),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

fs.writeFileSync(
  path.join(__dirname, "public", "sitemap.xml"),
  sitemapXml,
  "utf-8"
);

console.log("✅ sitemap.xml fayl muvaffaqiyatli yaratildi!");
