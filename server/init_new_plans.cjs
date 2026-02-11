const Razorpay = require('razorpay');
const fs = require('fs');

// NEW KEYS provided by user
const rzp = new Razorpay({
    key_id: 'rzp_live_S2U1Ky7q9xJsaH',
    key_secret: 'yFy3mgeOD8oEmYFUz8WJdmXM'
});

const createPlans = async () => {
    try {
        console.log("Creating 'Simplify Tap Plus' Plan on NEW ACCOUNT...");
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

        console.log("Creating 'Simplify Tap Teams' Plan on NEW ACCOUNT...");
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
        // Write to a separate file to be safe
        fs.writeFileSync('new_plans_output.txt', output);
        console.log("✅ Plans Created Successfully:");
        console.log(output);

    } catch (err) {
        console.error("❌ Error creating plans:", err);
        fs.writeFileSync('new_plans_output.txt', "ERROR: " + JSON.stringify(err));
    }
};

createPlans();
