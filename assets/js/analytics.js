/* Niebli analytics: one GTM loader, opt-in analytics, public content IDs only. */
(() => {
  'use strict';
  if (window.niebliAnalytics) return;
  const production = /^(www\.)?niebli\.com$/.test(location.hostname);
  const key = 'niebli_analytics_consent_v1';
  let accepted = false, loaded = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
  const clean = value => /^[a-z0-9_-]{1,80}$/i.test(value || '') ? value : undefined;
  const allowed = new Set(['story_view','story_progress','story_engaged','timeline_select','family_branch_select','gallery_open','map_interaction','business_view','business_referral','contact_click','sign_up','generate_lead','oral_history_start','oral_history_progress','oral_history_complete']);
  function track(name, values = {}) {
    if (!accepted || !production || !allowed.has(name)) return;
    const params = {};
    for (const field of ['story_id','content_section','historical_period','business_id','interaction_id','contact_method']) {
      const v = clean(values[field]); if (v) params[field] = v;
    }
    for (const field of ['percent','engaged_seconds']) {
      if (Number.isFinite(values[field]) && values[field] >= 0 && values[field] <= 86400) params[field] = values[field];
    }
    gtag('event', name, {...params, send_to:'G-JSJP1427M4'});
  }
  function load() {
    if (loaded || !production) return;
    loaded = true;
    // Keep only campaign parameters in automatically recorded page URLs.
    const url = new URL(location.href); const keep = new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term']);
    for (const p of [...url.searchParams.keys()]) if (!keep.has(p)) url.searchParams.delete(p);
    url.hash = '';
    gtag('set', {page_location:url.href, allow_google_signals:false, allow_ad_personalization_signals:false});
    dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WHL6R22F'; document.head.append(script);
  }
  const watchers = [];
  function consent(value) {
    accepted = value === 'accepted';
    try { localStorage.setItem(key, value); } catch (_) {}
    gtag('consent','update',{analytics_storage:accepted?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    if (accepted) { load(); watchers.forEach(w => w.start()); }
    document.getElementById('niebli-consent')?.remove();
  }
  window.niebliAnalytics = {track, consent, openPreferences:showPreferences};
  function showPreferences() {
    if (document.getElementById('niebli-consent')) return;
    const panel = document.createElement('aside'); panel.id = 'niebli-consent'; panel.setAttribute('aria-label','Analytics preferences');
    panel.style.cssText = 'position:fixed;z-index:9999;bottom:52px;left:16px;right:16px;max-width:560px;margin:auto;padding:18px;background:#11201d;color:#f4ede3;border:1px solid #75867b;border-radius:10px;font:14px/1.5 system-ui;box-shadow:0 8px 30px #0008';
    panel.innerHTML = '<p style="margin:0 0 12px">We use optional Google Analytics to understand visits and engagement with Niebli’s stories. Allowing analytics stores cookies and sends usage information to Google. <a href="/privacy/" style="text-decoration:underline">Privacy details</a></p><div style="display:flex;gap:12px"><button type="button" data-choice="declined">Decline analytics</button><button type="button" data-choice="accepted">Allow analytics</button></div>';
    panel.querySelectorAll('button').forEach(button => { button.style.cssText='padding:10px 14px;border:1px solid #aaa;border-radius:5px;cursor:pointer;background:#f4ede3;color:#11201d';button.onclick=()=>consent(button.dataset.choice); });
    document.body.append(panel);
  }
  function context(el) {
    const root = el.closest('[data-story-id], [data-business-id]') || el;
    return {story_id:root.dataset.storyId,business_id:root.dataset.businessId,content_section:root.dataset.contentSection,historical_period:root.dataset.historicalPeriod,interaction_id:el.dataset.interactionId,contact_method:el.dataset.contactMethod};
  }
  function init() {
    const preferences = document.createElement('button'); preferences.type='button'; preferences.textContent='Analytics preferences';
    preferences.style.cssText='position:fixed;bottom:10px;right:12px;z-index:9998;padding:6px 10px;border:1px solid #75867b;border-radius:4px;background:#11201d;color:#f4ede3;font:12px system-ui;cursor:pointer';preferences.onclick=showPreferences;document.body.append(preferences);
    document.querySelectorAll('[data-story-id]').forEach(el => {
      let viewed=false, seconds=0, progress=new Set();
      const start=()=> { if (!viewed) {viewed=true;track('story_view',context(el));} };
      const visible=()=> { const r=el.getBoundingClientRect();return r.bottom>0 && r.top<innerHeight; };
      watchers.push({start:()=>{if(visible())start();}});
      setInterval(()=>{if (!accepted || document.hidden || !visible())return;start();seconds++;if([30,60,120].includes(seconds))track('story_engaged',{...context(el),engaged_seconds:seconds});},1000);
      addEventListener('scroll',()=>{if(!accepted || !visible())return;start();const r=el.getBoundingClientRect();const pct=Math.min(100, Math.max(0,(innerHeight-r.top)/r.height*100));[25,50,75,90].forEach(p=>{if(pct>=p&&!progress.has(p)){progress.add(p);track('story_progress',{...context(el),percent:p});}});},{passive:true});
    });
    if ('IntersectionObserver' in window) {
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(accepted&&entry.isIntersecting){track('business_view',context(entry.target));observer.unobserve(entry.target);}}),{threshold:.5});
      const observe=()=>document.querySelectorAll('[data-business-id]:not(a)').forEach(el=>observer.observe(el));watchers.push({start:observe});
    }
    document.addEventListener('click',event=>{const el=event.target.closest('[data-analytics-event]');if(el)track(el.dataset.analyticsEvent,context(el));});
    document.querySelectorAll('audio[data-story-id],video[data-story-id]').forEach(media=>{
      const sent=new Set();media.addEventListener('play',()=>{if(!accepted||sent.has('start'))return;sent.add('start');track('oral_history_start',context(media));});
      media.addEventListener('timeupdate',()=>{if(!accepted||!Number.isFinite(media.duration))return;[25,50,75].forEach(p=>{if(media.currentTime/media.duration*100>=p&&!sent.has(p)){sent.add(p);track('oral_history_progress',{...context(media),percent:p});}});});
      media.addEventListener('ended',()=>track('oral_history_complete',context(media)));
    });
    let stored;try{stored=localStorage.getItem(key);}catch(_){}if(stored==='accepted')consent(stored);else if(stored!=='declined')showPreferences();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
