import { useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";
import { CONFIG } from "@/lib/config";

export function useSupabase() {
    const { getToken, isLoaded } = useAuth();

    const client = useMemo(() => {
        if (!isLoaded) return null;

        return createClient(
            CONFIG.SUPABASE_URL,
            CONFIG.SUPABASE_ANON_KEY,
            {
                global: {
                    fetch: async (url, options = {}) => {
                        console.log("Supabase Fetch Interceptor: Getting token...");
                        const clerkToken = await getToken({ template: "supabase" });
                        console.log("Supabase Fetch Interceptor: Token received?", !!clerkToken);

                        // @ts-ignore
                        const headers = new Headers(options?.headers);
                        if (clerkToken) {
                            headers.set("Authorization", `Bearer ${clerkToken}`);
                        }

                        return fetch(url, {
                            ...options,
                            headers,
                        });
                    },
                },
            }
        );
    }, [getToken, isLoaded]);

    return client;
}
