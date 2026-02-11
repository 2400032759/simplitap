import { createClient } from "@supabase/supabase-js";

// Hardcoding keys
const SUPABASE_URL = "https://ianxrjcskywenqgntbuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbnhyamNza3l3ZW5xZ250YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDUwNjcsImV4cCI6MjA4MTgyMTA2N30.5tiDhmAhnI4PIOvdY6su8w1UhBNQuN8vZpZH_edyE2Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testWrite() {
    console.log("Testing Supabase Write (Anon)...");

    // Random ID to avoid collisions
    const randomId = "test_user_" + Math.floor(Math.random() * 10000);

    const startTime = Date.now();

    try {
        const { data, error } = await supabase
            .from("profiles")
            .insert({
                clerk_user_id: randomId,
                first_name: "Test",
                last_name: "User",
                job_title: "Tester",
                company: "Test Co",
                updated_at: new Date().toISOString()
            })
            .select();

        const duration = Date.now() - startTime;
        console.log(`Operation took ${duration}ms`);

        if (error) {
            console.error("Supabase Write Error:", JSON.stringify(error, null, 2));
        } else {
            console.log("Supabase Write Success:", data);
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

testWrite();
