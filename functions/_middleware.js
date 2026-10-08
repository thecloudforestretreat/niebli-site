// Custom staging domains do not inherit Pages preview indexing protection.
export async function onRequest({request, next}) {
  const response = await next();
  const hostname = new URL(request.url).hostname;
  if (hostname !== 'staging.niebli.com' && !hostname.endsWith('.niebli-site.pages.dev')) return response;
  const protectedResponse = new Response(response.body, response);
  protectedResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return protectedResponse;
}
