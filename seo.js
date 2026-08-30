// seo.js

// =========================
// BASIC SEO CONFIG
// =========================

const seoData = {
  title: "Latest Panjabi Collection in Bangladesh",
  description:
    "Buy stylish Panjabi for men in Bangladesh. Explore white Panjabi, Kabli Panjabi, black Panjabi, and Eid collections.",
    
  keywords: [
    "panjabi",
    "panjabi for men",
    "panjabi collection",
    "white panjabi",
    "black panjabi",
    "kabli panjabi",
    "white panjabi design",
    "panjabi price in bd",
    "eid panjabi",
    "mens panjabi bd"
  ],

  author: "Your Brand Name",
  siteUrl: "https://yourwebsite.com",
  image: "https://yourwebsite.com/images/panjabi.jpg"
};

// =========================
// SET META TAGS
// =========================

document.title = seoData.title;

function setMeta(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

// Basic SEO
setMeta("description", seoData.description);
setMeta("keywords", seoData.keywords.join(", "));
setMeta("author", seoData.author);

// =========================
// OPEN GRAPH SEO
// =========================

function setOG(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

setOG("og:title", seoData.title);
setOG("og:description", seoData.description);
setOG("og:image", seoData.image);
setOG("og:url", seoData.siteUrl);
setOG("og:type", "website");

// =========================
// TWITTER SEO
// =========================

setMeta("twitter:card", "summary_large_image");
setMeta("twitter:title", seoData.title);
setMeta("twitter:description", seoData.description);
setMeta("twitter:image", seoData.image);

// =========================
// CANONICAL URL
// =========================

let canonical = document.querySelector("link[rel='canonical']");

if (!canonical) {
  canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  document.head.appendChild(canonical);
}

canonical.setAttribute("href", seoData.siteUrl);

// =========================
// SCHEMA MARKUP
// =========================

const schema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Your Brand Name",
  "url": seoData.siteUrl,
  "image": seoData.image,
  "description": seoData.description
};

const script = document.createElement("script");
script.type = "application/ld+json";
script.text = JSON.stringify(schema);

document.head.appendChild(script);

// =========================
// IMAGE ALT SEO
// =========================

document.querySelectorAll("img").forEach((img, index) => {
  if (!img.alt) {
    img.alt = `Panjabi collection image ${index + 1}`;
  }
});




console.log("SEO Applied Successfully");



(function () {

  const SEO = {
    siteName: "Your Brand Name",
    siteUrl: window.location.origin,
    description: "Default description for your website",
    image: "/images/og.jpg",
    twitter: "@yourhandle"
  };

  function setMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  }

  function setProperty(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  }

  function setCanonical(url) {
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }

  function injectSchema() {

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SEO.siteName,
      "url": SEO.siteUrl,
      "description": SEO.description
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  function optimizeTitle() {
    if (!document.title || document.title.length < 10) {
      document.title = SEO.siteName + " | Best Services";
    }
  }

  function optimizeDescription() {
    setMeta("description", SEO.description);
  }

  function openGraph() {
    setProperty("og:title", document.title);
    setProperty("og:description", SEO.description);
    setProperty("og:type", "website");
    setProperty("og:url", window.location.href);
    setProperty("og:image", SEO.image);
  }

  function twitterCard() {
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", SEO.description);
  }

  function viewport() {
    let vp = document.querySelector("meta[name='viewport']");
    if (!vp) {
      vp = document.createElement("meta");
      vp.name = "viewport";
      document.head.appendChild(vp);
    }
    vp.content = "width=device-width, initial-scale=1.0";
  }

  function autoH1Fix() {
    if (!document.querySelector("h1")) {
      const h1 = document.createElement("h1");
      h1.innerText = document.title;
      h1.style.display = "none";
      document.body.prepend(h1);
    }
  }

  function run() {
    optimizeTitle();
    optimizeDescription();
    setCanonical(window.location.href);
    injectSchema();
    openGraph();
    twitterCard();
    viewport();
    autoH1Fix();
  }

  document.addEventListener("DOMContentLoaded", run);

})();