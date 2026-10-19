import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return NextResponse.json({ verified: false, error: "Missing secret" }, { status: 500 });

    const generated = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = generated === razorpay_signature;

    return NextResponse.json({ verified });
  } catch (err) {
    return NextResponse.json({ verified: false, error: String(err) }, { status: 500 });
  }
}
