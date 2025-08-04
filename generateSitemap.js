import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fayl joylashuvi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON fayldan ma’lumotlar olish
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "public", "url.json"), "utf-8")
);

// Asosiy sozlamalar
const BASE_URL = "https://poyzen.uz";
const now = new Date().toISOString();
const LANGS = ["ru", "uz"];

// URL blok generatsiya qiluvchi funksiya
function generateUrlTag(basePath, changefreq = "weekly", priority = "0.5") {
  return LANGS.map((lang) => {
    const loc = basePath.replace("/ru", `/${lang}`);

    const hreflangs = LANGS.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${l}" href="${basePath.replace(
          "/ru",
          `/${l}`
        )}"/>`
    ).join("\n");

    return `
  <url>
    <loc>${loc}</loc>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="${basePath}"/>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("\n");
}

// Statik sahifalar
const staticPages = [
  { loc: `${BASE_URL}/ru`, changefreq: "daily", priority: "1.0" },
  { loc: `${BASE_URL}/ru/products`, changefreq: "weekly", priority: "0.8" },
  { loc: `${BASE_URL}/ru/brands`, changefreq: "monthly", priority: "0.6" },
  { loc: `${BASE_URL}/ru/likes`, changefreq: "weekly", priority: "0.5" },
  { loc: `${BASE_URL}/ru/cart`, changefreq: "weekly", priority: "0.5" },
];

// Dinamik sahifalar
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

// Har bir sahifa uchun <url> bloklarini generatsiya qilish
const urls = [
  ...staticPages.flatMap((p) =>
    generateUrlTag(p.loc, p.changefreq, p.priority)
  ),
  ...dynamicPages.flatMap((p) =>
    generateUrlTag(p.loc, p.changefreq, p.priority)
  ),
];

// XML faylga yozish
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
