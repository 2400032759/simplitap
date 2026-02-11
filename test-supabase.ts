import { createClient } from "@supabase/supabase-js";

// Hardcoding keys from the prompt for the test script to avoid import issues with Vite envs in ts-node
const SUPABASE_URL = "https://ianxrjcskywenqgntbuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbnhyamNza3l3ZW5xZ250YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDUwNjcsImV4cCI6MjA4MTgyMTA2N30.5tiDhmAhnI4PIOvdY6su8w1UhBNQuN8vZpZH_edyE2Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    console.log("Testing Supabase Connection...");
    try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1);
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Supabase Connection Successful. Data:", data);
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

testConnection();
