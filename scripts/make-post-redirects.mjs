/**
 * Prints the redirect lines that map old WordPress post URLs onto Substack.
 *
 * Every post was moved from the old WordPress blog to Substack keeping its
 * slug, so a post published on 2024-07-13 lived at /2024/07/13/the-present/
 * and now lives at https://lirazaxelrad.substack.com/p/the-present. Google
 * still has the old URLs indexed, so each one gets a 301.
 *
 * Usage: node scripts/make-post-redirects.mjs
 * Then paste the output into the `redirects` block in astro.config.mjs.
 */

const BASE = "https://lirazaxelrad.substack.com";

async function fetchArchive() {
  const posts = [];
  // The API gives no total and returns fewer rows than the `limit` asked for,
  // so advance by what actually came back and stop on the first empty page.
  for (let offset = 0; ; ) {
    const res = await fetch(`${BASE}/api/v1/archive?sort=new&limit=50&offset=${offset}`);
    if (!res.ok) throw new Error(`Substack archive returned ${res.status}`);
    const page = await res.json();
    if (page.length === 0) return posts;
    posts.push(...page);
    offset += page.length;
  }
}

const posts = await fetchArchive();

const lines = posts
  .map((post) => {
    const [year, month, day] = post.post_date.slice(0, 10).split("-");
    const slug = post.canonical_url.split("/p/")[1];
    return { from: `/${year}/${month}/${day}/${slug}`, slug, title: post.title.trim() };
  })
  .sort((a, b) => a.from.localeCompare(b.from))
  .map(({ from, slug, title }) => `    "${from}": "${BASE}/p/${slug}", // ${title.slice(0, 48)}`);

console.log(lines.join("\n"));
console.error(`\n${lines.length} redirects`);
