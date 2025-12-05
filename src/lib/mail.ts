// src/lib/mail.ts
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM ?? user;

if (!host || !user || !pass) {
  console.warn("SMTP env variables are missing – emails will NOT be sent.");
}

const transporter =
  host && user && pass
    ? nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // pre Websupport väčšinou áno
        auth: { user, pass },
      })
    : null;

export type ReservationMailPayload = {
  email: string;
  fullName: string;
  dateStr: string;   // 05.12.2025
  timeStr: string;   // 20:00
  partySize: number;
  tablesText: string;
  note?: string;
};

export async function sendReservationEmails(payload: ReservationMailPayload) {
  if (!transporter) return; // nech nepadá, keď chýbajú env

  const { email, fullName, dateStr, timeStr, partySize, tablesText, note } =
    payload;

  const subject = `Rezervácia – ${dateStr} ${timeStr}`;
  const textBody = `
Ahoj ${fullName},

ďakujeme za rezerváciu v History Art & Music Club.

Rekapitulácia:
- Dátum a čas: ${dateStr} ${timeStr}
- Počet osôb: ${partySize}
- Stôl / sektor: ${tablesText || "-"}
${note ? `- Poznámka: ${note}` : ""}

Toto je automatické potvrdenie o prijatí rezervácie.
V prípade potreby vás budeme kontaktovať emailom alebo telefonicky.

History Art & Music Club
`;

  const htmlBody = `
<p>Ahoj ${fullName},</p>
<p>ďakujeme za rezerváciu v <strong>History Art & Music Club</strong>.</p>
<p><strong>Rekapitulácia:</strong></p>
<ul>
  <li><strong>Dátum a čas:</strong> ${dateStr} ${timeStr}</li>
  <li><strong>Počet osôb:</strong> ${partySize}</li>
  <li><strong>Stôl / sektor:</strong> ${tablesText || "-"}</li>
  ${note ? `<li><strong>Poznámka:</strong> ${note}</li>` : ""}
</ul>
<p>Toto je automatické potvrdenie o <strong>prijatí rezervácie</strong>.<br/>
</p>
<p>History Art &amp; Music Club</p>
`;

  // mail pre zákazníka
  await transporter.sendMail({
    from,
    to: email,
    subject,
    text: textBody,
    html: htmlBody,
  });

  // kópia pre klub (aby mali info v inboxe)
  await transporter.sendMail({
    from,
    to: user,
    subject: `Kópia rezervácie – ${fullName} – ${dateStr} ${timeStr}`,
    text: textBody,
  });
}
