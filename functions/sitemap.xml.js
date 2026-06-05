export async function onRequest(context) {

  const BASE_URL =
    "https://movienova.xyz";

  const MAX_JSON_FILES = 500;

  function slugify(text){

    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/(^-|-$)/g,'');
  }

  let urls = [];

  for(let i = 1; i <= MAX_JSON_FILES; i++){

    try{

      const response = await fetch(
        `${BASE_URL}/json/posts${i}.json`
      );

      if(!response.ok){
        break;
      }

      const data = await response.json();

      const posts =
        data.feed?.entry || [];

      posts.forEach(post => {

        const title =
          post.title?.$t || "";

        if(!title) return;

        const slug =
          slugify(title);

        urls.push(`
  <url>
    <loc>${BASE_URL}/${slug}</loc>
  </url>`);
      });

    }catch(err){
      break;
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${BASE_URL}</loc>
  </url>

${urls.join("\n")}

</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
