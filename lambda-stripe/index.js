const stripe = require('stripe')('your-stripe-secret-key'); // Replace with your Stripe secret key

export async function handler(event) {
    try {
        const body = JSON.parse(event.body);
        const { amount, currency } = body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
            }),
        };
    } catch (error) {
        console.error('Error creating payment intent', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
}
