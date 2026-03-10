"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name: string;
  company: string;
  email: string;
  message: string;
};

export async function sendContactEmail(
  data: ContactPayload
): Promise<{ success: boolean }> {
  try {
    await resend.emails.send({
      from: "シラフ株式会社 サイト <noreply@ciraf.jp>",
      to: "info@ciraf.jp",
      replyTo: data.email,
      subject: `【お問い合わせ】${data.name}様`,
      text: [
        `お名前　: ${data.name}`,
        `会社名　: ${data.company || "—"}`,
        `メール　: ${data.email}`,
        ``,
        `【お問い合わせ内容】`,
        data.message,
      ].join("\n"),
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
