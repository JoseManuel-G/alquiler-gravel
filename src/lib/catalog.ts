import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { previewResorts, type Resort } from "./resorts";
export const getResorts = cache(async function getResorts(): Promise<{
  resorts: Resort[];
  demo: boolean;
  error: boolean;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    return { resorts: previewResorts, demo: true, error: false };
  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await db
    .from("resorts")
    .select("*")
    .order("position");
  return { resorts: (data || []) as Resort[], demo: false, error: !!error };
});
