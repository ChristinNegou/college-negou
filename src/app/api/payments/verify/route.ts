import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/cinetpay";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transaction_id");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!transactionId) {
    return NextResponse.redirect(`${appUrl}/dashboard/mes-paiements?error=no_transaction`);
  }

  try {
    const verification = await verifyPayment(transactionId);
    const payment = await prisma.payment.findUnique({
      where: { cinetpayTransId: transactionId },
    });

    if (payment && payment.status === "PENDING") {
      const status = verification.data.status === "ACCEPTED" ? "COMPLETED" : "FAILED";
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: status as never,
          cinetpayData: verification.data as never,
          paidAt: status === "COMPLETED" ? new Date() : undefined,
        },
      });
    }

    return NextResponse.redirect(
      `${appUrl}/dashboard/mes-paiements?${verification.data.status === "ACCEPTED" ? "success=true" : "error=payment_failed"}`
    );
  } catch {
    return NextResponse.redirect(`${appUrl}/dashboard/mes-paiements?error=verify_error`);
  }
}
