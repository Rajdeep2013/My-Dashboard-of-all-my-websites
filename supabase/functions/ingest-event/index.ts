// Supabase Edge Function: ingest-event
// Deploy with verify_jwt=false. Set ALLOWED_ORIGINS to comma-separated exact website origins.
// Optional TURNSTILE_SECRET_KEY for bot mitigation can be added later.
// No user identifiers, IPs, note contents, or quiz answers are stored.
import {createClient} from 'npm:@supabase/supabase-js@2';
const allowed=new Set(['page_view','study_opened','quiz_started','quiz_completed','note_opened','note_saved','note_created']);
const sites=new Set(['notes','study']);
const origins=(Deno.env.get('ALLOWED_ORIGINS')||'').split(',').map(x=>x.trim()).filter(Boolean);
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:'null','Vary':'Origin','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'content-type','Content-Type':'application/json'};
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST'||!origins.includes(origin))return new Response('Forbidden',{status:403,headers});
 const length=Number(req.headers.get('content-length')||0);
 if(length>1024)return new Response('Too large',{status:413,headers});
 try{
  const raw=await req.text();if(raw.length>1024)return new Response('Too large',{status:413,headers});
  const payload=JSON.parse(raw);
  if(!sites.has(payload.site)||!allowed.has(payload.event))return new Response('Invalid event',{status:400,headers});
  const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const {error}=await client.from('analytics_events').insert({site:payload.site,event:payload.event});
  if(error)throw error;
  return new Response(JSON.stringify({ok:true}),{status:202,headers});
 }catch{return new Response(JSON.stringify({error:'Unable to record event'}),{status:500,headers})}
});
