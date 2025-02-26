import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.error('Razorpay keys are missing.');
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in .env');
}

const razorpay = new Razorpay({ key_id, key_secret });

export async function POST() {
  try {
    const order = await razorpay.orders.create({
      amount: 100000, // Amount in paise (1000 INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
