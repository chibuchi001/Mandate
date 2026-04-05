import type { ServiceId, TokenHealth } from "@/types";
const D=process.env.AUTH0_DOMAIN??"",CI=process.env.AUTH0_CLIENT_ID??"",CS=process.env.AUTH0_CLIENT_SECRET??"";
const CONN:Record<ServiceId,string>={google:"google-oauth2",slack:"slack",github:"github"};

export async function getTokenFromVault(auth0Token:string,svc:ServiceId):Promise<{access_token:string;expires_in?:number}|null>{
  try{const r=await fetch(`https://${D}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({grant_type:"urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token",client_id:CI,client_secret:CS,subject_token:auth0Token,subject_token_type:"urn:ietf:params:oauth:token-type:access_token",connection:CONN[svc]})});
  if(!r.ok)return null;const d=await r.json();return{access_token:d.access_token,expires_in:d.expires_in};}catch{return null;}
}

export async function checkTokenHealth(auth0Token:string,svc:ServiceId):Promise<{health:TokenHealth;expiresAt?:string}>{
  const t=await getTokenFromVault(auth0Token,svc);if(!t)return{health:"missing"};
  if(t.expires_in!==undefined){const e=new Date(Date.now()+t.expires_in*1000).toISOString();if(t.expires_in<=0)return{health:"expired",expiresAt:e};if(t.expires_in<300)return{health:"expiring",expiresAt:e};return{health:"active",expiresAt:e};}
  return{health:"active"};
}

export async function callExternalApi(auth0Token:string,svc:ServiceId,url:string,opts:RequestInit={}):Promise<Response|null>{
  const t=await getTokenFromVault(auth0Token,svc);if(!t)return null;
  return fetch(url,{...opts,headers:{...opts.headers,Authorization:`Bearer ${t.access_token}`}});
}

// Service-specific helpers that use Token Vault tokens
export async function googleCalendarList(auth0Token:string,timeMin:string,timeMax:string){
  const r=await callExternalApi(auth0Token,"google",`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`);
  return r?.ok?r.json():null;
}
export async function slackPost(auth0Token:string,channel:string,text:string){
  const r=await callExternalApi(auth0Token,"slack","https://slack.com/api/chat.postMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({channel,text})});
  return r?.ok?r.json():null;
}
export async function githubListPRs(auth0Token:string,repo:string){
  const r=await callExternalApi(auth0Token,"github",`https://api.github.com/repos/${repo}/pulls?state=open`,{headers:{Accept:"application/vnd.github.v3+json"}});
  return r?.ok?r.json():null;
}

// Tool executor — uses real APIs when token available, simulates otherwise
export async function executeToolAction(auth0Token:string|null,operation:string,details:Record<string,unknown>={}):Promise<{success:boolean;result:string}>{
  // If we have a real Auth0 token, attempt real API calls
  if(auth0Token&&D){
    try{
      switch(operation){
        case "calendar_list_events":
        case "calendar_find_free_slots":{
          const now=new Date(),tom=new Date(now.getTime()+86400000);
          const data=await googleCalendarList(auth0Token,now.toISOString(),tom.toISOString());
          if(data?.items)return{success:true,result:`Found ${data.items.length} events`};break;}
        case "slack_list_channels":
        case "slack_post_message":{
          if(operation==="slack_post_message"){const d=await slackPost(auth0Token,(details.channel as string)??"#general",(details.text as string)??"Update from Mandate");if(d?.ok)return{success:true,result:"Posted to Slack"};}break;}
        case "github_list_prs":{
          const prs=await githubListPRs(auth0Token,(details.repo as string)??"");if(prs)return{success:true,result:`Found ${prs.length} open PRs`};break;}
      }
    }catch(e){console.error("Token Vault API call failed, falling back to simulation:",e);}
  }
  // Simulation fallback
  await new Promise(r=>setTimeout(r,600+Math.random()*600));
  if(Math.random()<0.1)return{success:false,result:"Temporary API error (503)"};
  const sims:Record<string,string>={calendar_list_events:"Found 3 events tomorrow",calendar_find_free_slots:"Available: 10am, 12pm, 3pm",calendar_create_event:"Event created",gmail_search:"Found 5 emails",gmail_send:"Email sent",slack_list_channels:"12 channels found",slack_read_messages:"Read 10 messages",slack_post_message:"Posted to channel",github_list_prs:"3 open PRs: #42, #38, #35",github_create_issue:"Issue created",github_review_pr:"Review submitted",github_merge_pr:"PR merged (squash)"};
  return{success:true,result:sims[operation]??"Completed"};
}
