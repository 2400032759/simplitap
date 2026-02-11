const Razorpay = require('razorpay');
const fs = require('fs');

const rzp = new Razorpay({
    key_id: 'rzp_live_SDKYqL9DJVoMEq',
    key_secret: 'CgY17dZB62mG65M36kLmCkBE'
});

const createPlan = async () => {
    try {

        console.log("Creating 'Simplify Tap Plus' Plan (49 INR/month)...");
        const plusPlan = await rzp.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: "Simplify Tap Plus",
                amount: 4900, // ₹49.00
                currency: "INR",
                description: "Premium Digital Card Features"
            }
        });
        console.log("✅ Plus Plan ID:", plusPlan.id);

        console.log("Creating 'Simplify Tap Teams' Plan (999 INR/yearly)...");
        const teamsPlan = await rzp.plans.create({
            period: "yearly",
            interval: 1,
            item: {
                name: "Simplify Tap Teams",
                amount: 99900, // ₹999.00
                currency: "INR",
                description: "Teams Management & Admin Features"
            }
        });
        console.log("✅ Teams Plan ID:", teamsPlan.id);

        const output = `PLUS_ID=${plusPlan.id}\nTEAMS_ID=${teamsPlan.id}`;
        fs.writeFileSync('new_49_plan_output.txt', output);
        console.log("✅ Plans Created Successfully:");
        console.log(output);

    } catch (err) {
        console.error("❌ Error creating plan:", err);
        fs.writeFileSync('new_49_plan_output.txt', "ERROR: " + JSON.stringify(err));
    }
};

createPlan();
