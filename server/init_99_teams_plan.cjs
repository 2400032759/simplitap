const Razorpay = require('razorpay');
const fs = require('fs');

const rzp = new Razorpay({
    key_id: 'rzp_live_SDKYqL9DJVoMEq',
    key_secret: 'CgY17dZB62mG65M36kLmCkBE'
});

const createPlan = async () => {
    try {
        console.log("Creating 'Simplify Tap Teams' Plan (99 INR/month)...");
        const teamsPlan = await rzp.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: "Simplify Tap Teams (Monthly 99)",
                amount: 9900, // ₹99.00
                currency: "INR",
                description: "Teams Management & Admin Features (Monthly)"
            }
        });

        const output = `TEAMS_ID=${teamsPlan.id}`;
        fs.writeFileSync('new_99_teams_plan_output.txt', output);
        console.log("✅ Teams Plan Created Successfully:");
        console.log(output);

    } catch (err) {
        console.error("❌ Error creating plan:", err);
        fs.writeFileSync('new_99_teams_plan_output.txt', "ERROR: " + JSON.stringify(err));
    }
};

createPlan();
