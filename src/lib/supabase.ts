import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "./config";

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

export const createClerkSupabaseClient = (clerkToken: string | null) => {
    return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: clerkToken ? `Bearer ${clerkToken}` : "",
            },
        },
    });
};
