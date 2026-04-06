import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, company, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: '必須項目が入力されていません' }, { status: 400 });
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: 'ciraf inc. <send@ciraf.jp>',
        to: process.env.CONTACT_TO_EMAIL!,
        replyTo: email,
        subject: `【ciraf.jp】お問い合わせ：${name}様`,
        text: `お名前：${name}\n会社名：${company || 'なし'}\nメール：${email}\n\nお問い合わせ内容：\n${message}`,
      }),
      resend.emails.send({
        from: 'ciraf inc. <send@ciraf.jp>',
        to: email,
        subject: '【ciraf inc.】お問い合わせありがとうございます',
        text: `${name} 様\n\nお問い合わせいただきありがとうございます。\n内容を確認の上、5営業日以内にご連絡いたします。\n\nなお、内容によってはご返信できない場合がございます。\nあらかじめご了承ください。\n\n─────────────────\nciraf inc.\nhttps://ciraf.jp\n─────────────────`,
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '送信に失敗しました' }, { status: 500 });
  }
}
