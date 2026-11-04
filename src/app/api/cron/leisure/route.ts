import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { automationEnabled, updateLeisure } from "@/lib/server/leisure-worker";
import { OFFICIAL_SOURCES } from "@/lib/leisure-sources";
export const runtime = "nodejs";
export const maxDuration = 300;
function authorized(request: Request) {
 const secret=process.env.CRON_SECRET;if(!secret) return false;
 const actual=Buffer.from(request.headers.get("authorization") || ""), expected=Buffer.from(`Bearer ${secret}`);
 return actual.length===expected.length&&timingSafeEqual(actual,expected);
}
export async function GET(request: Request) {
 if(!authorized(request)) return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!automationEnabled()) return NextResponse.json({disabled:true,reason:"Cost approval and activation required"});
 const station=new URL(request.url).searchParams.get("station") || "";
 if(!Object.hasOwn(OFFICIAL_SOURCES,station)) return NextResponse.json({error:"Invalid station"},{status:400});
 try { return NextResponse.json(await updateLeisure(station)); }
 catch { return NextResponse.json({error:"Refresh failed. Check server configuration and leisure_jobs."},{status:500}); }
}
