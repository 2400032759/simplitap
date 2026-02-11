const Razorpay = require('razorpay');
const fs = require('fs');
require('dotenv').config();

// Use keys from .env
const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createPlans = async () => {
    try {
        console.log("Creating ₹1 TEST PLANS...");

        console.log("1. Creating 'Simplify Tap Plus (₹1)' Plan...");
        const plusPlan = await rzp.plans.create({
            period: "yearly",
            interval: 1,
            item: {
                name: "Simplify Tap Plus (Test)",
                amount: 100, // ₹1.00 (100 paise)
                currency: "INR",
                description: "Premium Digital Card Features (Test)"
            }
        });
        console.log("✅ Plus Plan ID:", plusPlan.id);

        console.log("2. Creating 'Simplify Tap Teams (₹1)' Plan...");
        const teamsPlan = await rzp.plans.create({
            period: "yearly",
            interval: 1,
            item: {
                name: "Simplify Tap Teams (Test)",
                amount: 100, // ₹1.00 (100 paise)
                currency: "INR",
                description: "Teams Management (Test)"
            }
        });
        console.log("✅ Teams Plan ID:", teamsPlan.id);

        // Save to file for easy reading
        const content = `RAZORPAY_PLAN_ID_PLUS=${plusPlan.id}\nRAZORPAY_PLAN_ID_TEAMS=${teamsPlan.id}`;
        fs.writeFileSync('plans_1rupee.txt', content);
        console.log("Saved to plans_1rupee.txt");

    } catch (err) {
        console.error("❌ Error creating plans:", err);
    }
};

createPlans();
