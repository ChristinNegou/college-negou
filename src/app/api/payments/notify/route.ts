import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/cinetpay";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transactionId = body.cpm_trans_id;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    const verification = await verifyPayment(transactionId);

    const payment = await prisma.payment.findUnique({
      where: { cinetpayTransId: transactionId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const status = verification.data.status === "ACCEPTED" ? "COMPLETED" : "FAILED";
    const method = verification.data.payment_method?.includes("MOMO")
      ? "MTN_MOMO"
      : verification.data.payment_method?.includes("OM")
      ? "ORANGE_MONEY"
      : undefined;

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: status as never,
        method: method as never,
        cinetpayData: verification.data as never,
        paidAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
