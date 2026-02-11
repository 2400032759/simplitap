const Razorpay = require('razorpay');

// Keys provided by user in chat
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
                amount: 49900, // ₹499.00
                currency: "INR",
                description: "Premium Digital Card Features"
            }
        });
        console.log("✅ Plus Plan ID:", plusPlan.id);

        console.log("Creating 'Simplify Tap Teams' Plan...");
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

    } catch (err) {
        console.error("❌ Error creating plans:", err);
    }
};

createPlans();
