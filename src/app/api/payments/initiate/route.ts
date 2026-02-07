import { NextRequest, NextResponse } from "next/server";
import { initiatePayment } from "@/lib/cinetpay";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const feeType = searchParams.get("feeType");
  const amount = searchParams.get("amount");
  const yearId = searchParams.get("yearId");

  if (!studentId || !feeType || !amount || !yearId) {
    return NextResponse.json({ error: "Parametres manquants" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Eleve introuvable" }, { status: 404 });
  }

  const transactionId = `CPN-${randomUUID().slice(0, 8).toUpperCase()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await initiatePayment({
      amount: parseInt(amount),
      currency: "XAF",
      transactionId,
      description: `Paiement ${feeType} - ${student.lastName} ${student.firstName}`,
      returnUrl: `${appUrl}/api/payments/verify?transaction_id=${transactionId}`,
      notifyUrl: `${appUrl}/api/payments/notify`,
      customerName: `${student.lastName} ${student.firstName}`,
      customerEmail: student.user.email,
    });

    if (response.code === "201") {
      await prisma.payment.create({
        data: {
          studentId,
          academicYearId: yearId,
          feeType: feeType as never,
          amount: parseInt(amount),
          cinetpayTransId: transactionId,
          cinetpayPaymentUrl: response.data.payment_url,
        },
      });

      return NextResponse.redirect(response.data.payment_url);
    }

    return NextResponse.redirect(`${appUrl}/dashboard/mes-paiements?error=init_failed`);
  } catch {
    return NextResponse.redirect(`${appUrl}/dashboard/mes-paiements?error=init_error`);
  }
}
