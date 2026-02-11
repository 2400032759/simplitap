const Razorpay = require('razorpay');
require('dotenv').config();

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const testCreate = async () => {
    try {
        console.log("Testing Subscription Creation with max_amount...");
        const sub = await rzp.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID_TEAMS, // 99 INR plan
            total_count: 120,
            quantity: 1,
            customer_notify: 1,
            // Assuming 15000 INR
            // But API expects paisa? No, plans are paisa.
            // Let's assume paisa for amount. (15000 * 100) = 1500000
            max_amount: 1500000,
        });

        console.log("Subscription Created:", sub.id);
        console.log("Details:", JSON.stringify(sub, null, 2));

    } catch (err) {
        console.error("Creation Failed:", err);
    }
};

testCreate();
