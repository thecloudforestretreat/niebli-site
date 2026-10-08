const json = (body, status=200) => new Response(JSON.stringify(body), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Robots-Tag':'noindex','X-Content-Type-Options':'nosniff'}});

// Reuse this gate inside the future form handler, before any email or data write.
// A separate browser verification request must never authorize a later submission.
export async function verifyTurnstile(token, secret, expectedHostname, expectedAction, fetcher=fetch) {
  if (!secret) return {ok:false, status:503};
  if (typeof token!=='string' || !token || token.length>2048) return {ok:false, status:400};
  try {
    const response=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:token}),signal:AbortSignal.timeout(10000)});
    if (!response.ok) return {ok:false,status:503};
    const result=await response.json();
    return result.success===true && result.hostname===expectedHostname && result.action===expectedAction ? {ok:true,status:200} : {ok:false,status:403};
  } catch { return {ok:false,status:503}; }
}

export async function onRequestPost({request,env}) {
  const url=new URL(request.url);
  // Diagnostics are limited to the named staging branch and its stable URL.
  if (!['staging.niebli-site.pages.dev', 'staging.niebli.com'].includes(url.hostname)) return json({error:'Not found'},404);
  if (request.headers.get('Origin')!==url.origin) return json({error:'Forbidden'},403);
  if (Number(request.headers.get('Content-Length'))>10000) return json({error:'Request too large'},413);
  let payload;
  try { const raw=await request.text();if(raw.length>10000)return json({error:'Request too large'},413);payload=JSON.parse(raw); } catch {return json({error:'Invalid request'},400);}
  const verified=await verifyTurnstile(payload?.token,env.TURNSTILE_SECRET_KEY,url.hostname,'staging_check');
  if(!verified.ok)return json({error:verified.status===503?'Verification unavailable':'Verification failed'},verified.status);
  return json({verified:true,message:'Server verified hostname, action, and single-use token. No personal data was submitted or saved.'});
}

export const onRequestGet=()=>json({error:'Method not allowed'},405);
