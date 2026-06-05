export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "movienova123.pages.dev") {
    return Response.redirect(
      `https://movienova.xyz${url.pathname}${url.search}`,
      301
    );
  }

  return context.next();
}
