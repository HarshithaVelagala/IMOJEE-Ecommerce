import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = body.amount; // amount in paise
    const receipt = body.receipt || `rcpt_${Date.now()}`;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Missing Razorpay credentials" }, { status: 500 });
    }

    const orderPayload = {
      amount,
      currency: "INR",
      receipt,
      payment_capture: 1,
    };

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ order: data, key: keyId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
