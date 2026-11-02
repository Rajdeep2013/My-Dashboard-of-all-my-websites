// Supabase Edge Function: dashboard-stats
// Supabase Auth JWT required, plus explicit DASHBOARD_ADMIN_UID allowlist.
// Never return raw events or student identities.
import {createClient} from 'npm:@supabase/supabase-js@2';
Deno.serve(async req=>{
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':Deno.env.get('DASHBOARD_ORIGIN')||'null','Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'GET,OPTIONS','Vary':'Origin'};
 if(req.method==='OPTIONS')return new Response(null,{headers});
 if(req.method!=='GET')return new Response('Method not allowed',{status:405,headers});
 const auth=req.headers.get('authorization')||'';
 if(!auth.startsWith('Bearer '))return new Response('Unauthorized',{status:401,headers});
 const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!;
 const userClient=createClient(url,anon);
 const {data:{user},error:authError}=await userClient.auth.getUser(auth.slice(7));
 if(authError||!user||user.id!=='07428ae1-3c18-4d14-99e9-8d1bed806019')return new Response('Forbidden',{status:403,headers});
 const admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 const from=new Date(Date.now()-30*86400000).toISOString();
 const {data,error}=await admin.from('analytics_events').select('site,event,created_at').gte('created_at',from).limit(10000);
 if(error)return new Response('Server error',{status:500,headers});
 const counts={notes:{},study:{}};
 for(const row of data||[])counts[row.site][row.event]=(counts[row.site][row.event]||0)+1;
 return new Response(JSON.stringify({counts,window:'30 days',capped:(data||[]).length===10000}),{headers});
});
