
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPlans() {
    console.log("Creating ₹1 Unit Plans for Simplify Tap...");

    try {
        // 1. Create Plus Plan (₹1 per unit, yearly)
        const plusPlan = await razorpay.plans.create({
            period: 'yearly',
            interval: 1,
            item: {
                name: "Plus Plan Yearly (₹1 Unit)",
                amount: 100, // 100 paise = ₹1
                currency: "INR",
                description: "Dynamic pricing yearly plan for individual professionals"
            }
        });
        console.log("✅ Created Plus Plan (Yearly):", plusPlan.id);

        // 2. Create Teams Plan (₹1 per unit, yearly)
        const teamsPlan = await razorpay.plans.create({
            period: 'yearly',
            interval: 1,
            item: {
                name: "Teams Plan Yearly (₹1 Unit)",
                amount: 100, // 100 paise = ₹1
                currency: "INR",
                description: "Dynamic pricing yearly plan for organizations"
            }
        });
        console.log("✅ Created Teams Plan (Yearly):", teamsPlan.id);

        // 3. Update .env file
        const envPath = path.resolve(process.cwd(), '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');

        envContent = envContent.replace(/RAZORPAY_PLAN_ID_PLUS=.*/, `RAZORPAY_PLAN_ID_PLUS=${plusPlan.id}`);
        envContent = envContent.replace(/RAZORPAY_PLAN_ID_TEAMS=.*/, `RAZORPAY_PLAN_ID_TEAMS=${teamsPlan.id}`);

        fs.writeFileSync(envPath, envContent);
        console.log("✅ Updated .env file with new Plan IDs.");

    } catch (error) {
        console.error("❌ Error creating plans:", error);
    }
}

createPlans();
