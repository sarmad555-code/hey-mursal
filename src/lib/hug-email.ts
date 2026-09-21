function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function siteUrl() {
  const explicit = process.env.APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "";
}

export function hugEmailHtml(options: {
  to: "sarmad" | "mursal";
  note?: string;
  mood?: string;
}) {
  const forHim = options.to === "sarmad";
  const note = options.note?.trim();
  const mood = options.mood?.trim();
  const origin = siteUrl();
  const actionHref = forHim ? `${origin}/sarmadaccess` : origin;
  const actionLabel = forHim ? "Send her a hug" : "Open your pocket";

  const headline = forHim ? "She sent you a hug" : "A hug just landed";
  const lede = forHim
    ? "Mursal just reached for you from her pocket."
    : "You don't have to explain anything. This one was sent back to you.";
  const signoff = forHim ? "From her pocket" : "Love, Sarmad xx";

  const moodBlock = mood
    ? `<p style="margin:22px 0 0;padding:14px 16px;border-left:3px solid #ff9eb8;background:#fff7fb;border-radius:0 16px 16px 0;color:#5d6f8a;font-size:15px;line-height:1.5;text-align:left;">She's feeling<br><span style="color:#1f2d44;font-size:16px;">${escapeHtml(mood)}</span></p>`
    : "";

  const noteBlock = note
    ? `<p style="margin:18px 0 0;padding:18px 18px 16px;background:#ffffff;border-radius:18px;color:#1f2d44;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.45;text-align:center;">${escapeHtml(note)}</p>`
    : "";

  const button =
    origin && actionHref
      ? `<a href="${escapeHtml(actionHref)}" style="display:inline-block;margin-top:26px;background:#4d8fd6;color:#f7fbff;text-decoration:none;border-radius:16px;padding:14px 26px;font-size:16px;font-weight:600;">${actionLabel}</a>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#eef5ff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef5ff;">
      <tr>
        <td align="center" style="padding:28px 14px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#f7faff;border-radius:28px;overflow:hidden;">
            <tr>
              <td style="height:8px;background:#4d8fd6;background-image:linear-gradient(90deg,#4d8fd6,#a8d0f5,#ff9eb8);font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:34px 28px 32px;font-family:Georgia,'Iowan Old Style','Times New Roman',serif;color:#1f2d44;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#4d8fd6;">Hey Mursal</p>
                <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:22px auto 8px;">
                  <tr>
                    <td align="center" width="76" height="76" style="width:76px;height:76px;border-radius:38px;background:#d7ebff;color:#4d8fd6;font-size:30px;line-height:76px;">&#9829;</td>
                  </tr>
                </table>
                <h1 style="margin:14px 0 0;font-size:32px;line-height:1.15;font-weight:500;">${headline}</h1>
                <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#5d6f8a;">${lede}</p>
                ${moodBlock}
                ${noteBlock}
                ${button}
                <p style="margin:26px 0 0;font-size:16px;color:#ff9eb8;">${signoff}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
