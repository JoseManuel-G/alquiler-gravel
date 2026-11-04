import { createHash } from 'node:crypto';
export function approvedUrl(value, domains) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443')) return null;
    const host = u.hostname.toLowerCase();
    if (!domains.some(d => host === d || host.endsWith('.' + d))) return null;
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/i.test(key)) u.searchParams.delete(key);
    u.searchParams.sort(); return u.href;
  } catch { return null; }
}
export function sourceKey(category, name, sourceUrl) {
  const normalized = name.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return createHash('sha256').update(`${category}|${sourceUrl}|${normalized}`).digest('hex');
}
export function validateCandidate(candidate, { domains, citedUrls, now = new Date() }) {
  if (!candidate || !['restaurant','apres','event','activity'].includes(candidate.category)) return null;
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : '';
  const description = typeof candidate.description === 'string' ? candidate.description.trim() : '';
  const source_url = approvedUrl(candidate.source_url, domains);
  if (!name || name.length > 180 || description.length > 800 || !source_url || !citedUrls.some(u => approvedUrl(u, domains) === source_url)) return null;
  const timestamp = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v.slice(0,10)).toISOString().slice(0,10) === v.slice(0,10) ? new Date(v).toISOString() : null;
  const starts_at = timestamp(candidate.starts_at), ends_at = timestamp(candidate.ends_at);
  if ((candidate.starts_at && !starts_at) || (candidate.ends_at && !ends_at) || (ends_at && (!starts_at || ends_at < starts_at))) return null;
  if (candidate.category === 'event' && (!starts_at || !ends_at)) return null;
  return {
    source_key: sourceKey(candidate.category,name,source_url), category: candidate.category, name, description,
    location: typeof candidate.location === 'string' ? candidate.location.slice(0,250) : '',
    latitude: null, longitude: null, starts_at, ends_at, source_url,
    source_name: new URL(source_url).hostname,
    booking_url: approvedUrl(candidate.booking_url, domains),
    // Model output never licenses an image. Images require a separately verified rights record.
    image_url: null, image_license: null, subtype: null, distance_km: null, elevation_m: null, difficulty: null,
    winter_status: 'unknown', status: candidate.status === 'cancelled' ? 'cancelled' : ends_at && Date.parse(ends_at) < now.getTime() ? 'expired' : 'review',
    verified_at: now.toISOString(), expires_at: new Date(now.getTime() + 7 * 86400000).toISOString(),
    evidence: [{ url:source_url, method:'openai_web_search', publication:'pending_structured_verification' }],
  };
}
export function extractEvents(html) {
  const events = [];
  const walk = v => { if (Array.isArray(v)) { v.forEach(walk); return; } if (!v || typeof v !== 'object') return; const types = [].concat(v['@type'] || []); if (types.some(t => typeof t === 'string' && /(?:^|\/)Event$/.test(t))) events.push(v); if (v['@graph']) walk(v['@graph']); if (v.itemListElement) walk(v.itemListElement); if (v.item) walk(v.item); };
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(regex)) { try { walk(JSON.parse(match[1])); } catch { /* Invalid structured blocks are not evidence. */ } }
  return events;
}
export function verifyEvent(item, events) {
  const normalize = v => String(v || '').normalize('NFKD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const matches = events.filter(e => normalize(e.name) === normalize(item.name));
  if (matches.length !== 1) return item;
  const event = matches[0];
  const status = String(event.eventStatus || '');
  if (/EventCancelled$/.test(status)) return { ...item, status:'cancelled', evidence:[...item.evidence,{method:'authorized_jsonld',eventStatus:status}] };
  if (/EventPostponed$/.test(status)) return { ...item, status:'review' };
  if (!event.startDate || !event.endDate || !/[zZ]|[+-]\d\d:\d\d$/.test(event.startDate) || !/[zZ]|[+-]\d\d:\d\d$/.test(event.endDate)) return item;
  const start = Date.parse(event.startDate), end = Date.parse(event.endDate);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return item;
  const ends_at = new Date(end).toISOString();
  return { ...item, starts_at:new Date(start).toISOString(), ends_at, status:end < Date.parse(item.verified_at) ? 'expired' : 'active', evidence:[...item.evidence,{method:'authorized_jsonld',name:event.name,startDate:event.startDate,endDate:event.endDate}] };
}
