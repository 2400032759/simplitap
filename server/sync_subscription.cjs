const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// --- CONFIG ---
// Correct ID taken from previous context
const USER_ID_TO_SYNC = 'user_37Y7n22kOp5sbrgoNREuH9ZeMqW';

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
    console.log(`🔍 Searching Razorpay Subscriptions for User: ${USER_ID_TO_SYNC}...`);

    try {
        // Fetch last 100 subscriptions (increased count)
        const result = await rzp.subscriptions.all({ count: 100 });

        // Find the one belonging to our user
        // We check 'notes.userId' OR 'notes.userId_clerk'
        const userSub = result.items.find(sub => {
            const hasNote = sub.notes && (sub.notes.userId === USER_ID_TO_SYNC || sub.notes.userId_clerk === USER_ID_TO_SYNC);
            const isActive = sub.status !== 'cancelled' && sub.status !== 'expired';
            return hasNote && isActive;
        });

        if (!userSub) {
            console.log("❌ No active/authenticated subscription found for this user in Razorpay.");
            console.log("Debug Info - Found these notes:", result.items.map(s => s.notes));
            return;
        }

        console.log(`✅ Found Subscription: ${userSub.id} [${userSub.status}]`);

        // Force Database Sync
        console.log("⚡ Syncing to Database...");

        // 1. Update Subscriptions Table
        const { error: subError } = await supabase.from('subscriptions').upsert({
            id: userSub.id,
            user_id: USER_ID_TO_SYNC,
            plan_id: userSub.plan_id,
            status: userSub.status,
            created_at: new Date(userSub.created_at * 1000).toISOString(),
            updated_at: new Date().toISOString()
        });

        if (subError) console.error("Error updating subscriptions table:", subError);

        // 2. Update Profile
        const isPremium = (userSub.status === 'active' || userSub.status === 'authenticated');
        // Check both plan IDs just in case
        const isTeam = (userSub.plan_id === process.env.RAZORPAY_PLAN_ID_TEAMS);

        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                is_premium: isPremium,
                plan_type: isTeam ? 'teams' : 'plus',
                razorpay_subscription_id: userSub.id,
                subscription_status: userSub.status
            })
            .eq('clerk_user_id', USER_ID_TO_SYNC);

        if (profileError) {
            console.error("Error updating profile:", profileError);
        } else {
            console.log("🎉 SUCCESS! Profile marked as Premium.");
        }

    } catch (err) {
        console.error("Script Error:", err);
    }
}

sync();
