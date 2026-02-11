const Razorpay = require('razorpay');
require('dotenv').config();

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function test() {
    console.log("Testing Razorpay Config...");
    console.log("Key ID:", process.env.RAZORPAY_KEY_ID);
    console.log("Plan ID (Plus):", process.env.RAZORPAY_PLAN_ID_PLUS);

    try {
        console.log("1. Creating Dummy Customer...");
        const customer = await rzp.customers.create({
            name: "Debug Test",
            email: "debug.test@example.com",
            contact: "9000090000"
        });
        console.log("✅ Customer Created:", customer.id);

        console.log("2. Creating Subscription...");
        const sub = await rzp.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID_PLUS,
            total_count: 120,
            quantity: 1,
            customer_notify: 1,
            notes: { debug: 'true' }
        });
        console.log("✅ Subscription Created:", sub.id);

    } catch (err) {
        console.error("❌ FAILURE:");
        if (err.error) {
            console.error(JSON.stringify(err.error, null, 2));
        } else {
            console.error(err);
        }
    }
}

test();
