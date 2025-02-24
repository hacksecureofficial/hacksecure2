import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST() {
  // Check for environment variables
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials are missing.');
    return NextResponse.json(
      { error: 'Server misconfiguration: Missing Razorpay credentials.' },
      { status: 500 }
    );
  }

  // Initialize Razorpay
  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  try {
    // Create an order with amount (in paise), currency, and a unique receipt
    const order = await razorpay.orders.create({
      amount: 100000, // Amount in paise (₹1000)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order.' },
      { status: 500 }
    );
  }
}
