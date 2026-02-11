const Razorpay = require('razorpay');
const fs = require('fs');

const rzp = new Razorpay({
    key_id: 'rzp_live_S3I4QMbFyfYIiP',
    key_secret: '8YJa7YkEEOZvtMfNzAIuyl9O'
});

const createPlans = async () => {
    try {
        console.log("Creating 'Simplify Tap Plus' Plan...");
        const plusPlan = await rzp.plans.create({
            period: "yearly",
            interval: 1,
            item: {
                name: "Simplify Tap Plus",
                amount: 49900,
                currency: "INR",
                description: "Premium Digital Card Features"
            }
        });

        console.log("Creating 'Simplify Tap Teams' Plan...");
        const teamsPlan = await rzp.plans.create({
            period: "yearly",
            interval: 1,
            item: {
                name: "Simplify Tap Teams",
                amount: 99900,
                currency: "INR",
                description: "Teams Management & Admin Features"
            }
        });

        const output = `PLUS_ID=${plusPlan.id}\nTEAMS_ID=${teamsPlan.id}`;
        fs.writeFileSync('plans_output.txt', output);
        console.log(output);

    } catch (err) {
        console.error("❌ Error creating plans:", err);
        fs.writeFileSync('plans_output.txt', "ERROR: " + JSON.stringify(err));
    }
};

createPlans();
