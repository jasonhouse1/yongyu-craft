import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const NOTIFY_EMAIL = process.env.INQUIRY_NOTIFY_EMAIL ?? "yongyucraft@gmail.com";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[EmailService] RESEND_API_KEY is not set. Email sending is disabled.");
    return null;
  }

  return new Resend(apiKey);
}

export interface InquiryEmailData {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  workId?: string;
  budgetRange?: string;
}

export const emailService = {
  async sendInquiryNotification(data: InquiryEmailData): Promise<void> {
    const resend = getResendClient();
    if (!resend) return;

    await resend.emails.send({
      from: FROM,
      to: NOTIFY_EMAIL,
      subject: `新詢價通知 - ${data.name}（${data.inquiryType}）`,
      html: `
        <h2>永裕工藝 · 新詢價通知</h2>
        <table>
          <tr><td><strong>詢價編號</strong></td><td>${data.inquiryId}</td></tr>
          <tr><td><strong>姓名</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>電話</strong></td><td>${data.phone ?? "未提供"}</td></tr>
          <tr><td><strong>詢價類型</strong></td><td>${data.inquiryType}</td></tr>
          ${data.workId ? `<tr><td><strong>作品 ID</strong></td><td>${data.workId}</td></tr>` : ""}
          ${data.budgetRange ? `<tr><td><strong>預算區間</strong></td><td>${data.budgetRange}</td></tr>` : ""}
          <tr><td><strong>說明</strong></td><td>${data.message}</td></tr>
        </table>
      `,
    });
  },

  async sendInquiryConfirmation(data: {
    name: string;
    email: string;
    inquiryId: string;
  }): Promise<void> {
    const resend = getResendClient();
    if (!resend) return;

    await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: "永裕工藝 · 詢價確認",
      html: `
        <h2>感謝您的詢價</h2>
        <p>親愛的 ${data.name}，</p>
        <p>我們已收到您的詢價（編號：${data.inquiryId}），將盡快與您聯繫。</p>
        <p>永裕工藝 敬上</p>
      `,
    });
  },
};
