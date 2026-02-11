import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ianxrjcskywenqgntbuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbnhyamNza3l3ZW5xZ250YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDUwNjcsImV4cCI6MjA4MTgyMTA2N30.5tiDhmAhnI4PIOvdY6su8w1UhBNQuN8vZpZH_edyE2Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testUpdate() {
    console.log("Testing Supabase Update (Anon)...");

    // 1. Create a user
    const randomId = "test_update_" + Math.floor(Math.random() * 10000);
    console.log("Creating user:", randomId);

    const { error: insertError } = await supabase
        .from("profiles")
        .insert({
            clerk_user_id: randomId,
            first_name: "Original",
            last_name: "User",
            job_title: "Test",
            company: "Co",
            updated_at: new Date().toISOString()
        });

    if (insertError) {
        console.error("Setup Insert Failed:", JSON.stringify(insertError, null, 2));
        return;
    }

    // 2. Try to Update it
    console.log("Attempting Update...");
    const { data, error: updateError } = await supabase
        .from("profiles")
        .update({ first_name: "Updated Name" })
        .eq("clerk_user_id", randomId)
        .select();

    if (updateError) {
        console.error("Update Failed:", JSON.stringify(updateError, null, 2));
    } else {
        console.log("Update Success. Data:", data);
    }
}

testUpdate();
