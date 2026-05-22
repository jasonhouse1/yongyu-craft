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
      subject: `永裕工藝 · 新詢價 | ${data.name}`,
      html: `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080706;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080706;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:40px 40px 32px;border-bottom:1px solid #1A1810;">
          <p style="margin:0;font-size:11px;letter-spacing:0.25em;color:#6B6560;text-transform:uppercase;">YONGYU CRAFT</p>
          <h1 style="margin:12px 0 0;font-size:22px;font-weight:300;color:#C49A5A;letter-spacing:0.1em;">新詢價通知</h1>
        </td></tr>

        <!-- Client info -->
        <tr><td style="padding:32px 40px;background:#0D0D0B;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["詢價編號", data.inquiryId],
              ["姓名", data.name],
              ["Email", data.email],
              ["電話", data.phone ?? "未提供"],
              ["詢價類型", data.inquiryType],
              ...(data.workId ? [["作品 ID", data.workId]] : []),
              ...(data.budgetRange ? [["預算區間", data.budgetRange]] : []),
            ]
              .map(
                ([label, value]) => `
            <tr>
              <td style="padding:10px 0;font-size:11px;letter-spacing:0.15em;color:#6B6560;width:100px;vertical-align:top;text-transform:uppercase;">${label}</td>
              <td style="padding:10px 0;font-size:14px;color:#E8ECF0;letter-spacing:0.03em;">${value}</td>
            </tr>`
              )
              .join("")}
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:24px 40px;background:#111010;border-top:1px solid #1A1810;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.15em;color:#6B6560;text-transform:uppercase;">需求說明</p>
          <p style="margin:0;font-size:14px;color:rgba(232,236,240,0.8);line-height:1.8;letter-spacing:0.03em;">${data.message.replace(/\n/g, "<br>")}</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #1A1810;">
          <p style="margin:0;font-size:11px;color:#3A3530;letter-spacing:0.1em;">永裕工藝 · Yongyu Craft · Est. Taiwan</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
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
      subject: "永裕工藝 · 感謝您的信任",
      html: `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080706;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080706;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="padding:40px 40px 32px;border-bottom:1px solid #1A1810;">
          <p style="margin:0;font-size:11px;letter-spacing:0.25em;color:#6B6560;text-transform:uppercase;">YONGYU CRAFT</p>
          <h1 style="margin:12px 0 0;font-size:22px;font-weight:300;color:#C49A5A;letter-spacing:0.1em;">感謝您的信任</h1>
        </td></tr>

        <tr><td style="padding:40px;background:#0D0D0B;">
          <p style="margin:0 0 20px;font-size:16px;color:#E8ECF0;letter-spacing:0.05em;">親愛的 ${data.name}，</p>
          <p style="margin:0 0 20px;font-size:14px;color:rgba(232,236,240,0.7);line-height:1.9;letter-spacing:0.03em;">
            我們已收到您的詢價。師傅將在 <strong style="color:#C49A5A;">48 小時內</strong>親自回覆您，請耐心等候。
          </p>
          <p style="margin:0;font-size:11px;color:#6B6560;letter-spacing:0.1em;">詢價編號：${data.inquiryId}</p>
        </td></tr>

        <tr><td style="padding:24px 40px;border-top:1px solid #1A1810;">
          <p style="margin:0;font-size:11px;color:#3A3530;letter-spacing:0.1em;">永裕工藝 · Yongyu Craft · Est. Taiwan</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
  },
};
