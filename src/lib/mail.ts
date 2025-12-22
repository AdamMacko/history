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
      secure: port === 465,
      auth: { user, pass },
    })
    : null;

export type ReservationMailPayload = {
  email: string;
  fullName: string;
  dateStr: string;
  timeStr: string;
  partySize: number;
  tablesText: string;
  note?: string;
};

export async function sendReservationEmails(payload: ReservationMailPayload) {
  if (!transporter) return; // nech nepadá, keď chýbajú env

  const { email, fullName, dateStr, timeStr, partySize, tablesText, note } =
    payload;

  const subject = `Potvrdenie prijatia rezervácie – History Art & Music Club`;
  const textBody = `
Ahoj ${fullName},

ďakujeme za tvoju rezerváciu v History Art & Music Club 🤍

Rekapitulácia rezervácie:
- Dátum a čas: ${dateStr} ${timeStr}
- Počet osôb: ${partySize}
- Sektor / stôl: ${tablesText || "-"}
${note ? `- Poznámka: ${note}` : ""}

Tento email slúži ako potvrdenie o prijatí rezervácie.
Ak by bolo potrebné niečo doplniť alebo upraviť, ozveme sa ti emailom.

Ak potrebuješ rezerváciu zmeniť alebo zrušiť, odpíš prosím na tento email.

Tešíme sa na tvoju návštevu ✨

History Art & Music Club
`;


  const htmlBody = `
<p>Ahoj ${fullName},</p>

<p>
ďakujeme za tvoju rezerváciu v <strong>History Art & Music Club</strong> 🤍
</p>

<p><strong>Rekapitulácia rezervácie:</strong></p>

<ul>
  <li><strong>Dátum a čas:</strong> ${dateStr} ${timeStr}</li>
  <li><strong>Počet osôb:</strong> ${partySize}</li>
  <li><strong>Sektor / Stôl:</strong> ${tablesText || "-"}</li>
  ${note ? `<li><strong>Poznámka:</strong> ${note}</li>` : ""}
</ul>

<p>
Tento email slúži ako potvrdenie o <strong>prijatí rezervácie</strong>.
</p>

<p>
V prípade potreby ťa budeme kontaktovať emailom.
Ak potrebuješ rezerváciu <strong>zmeniť alebo zrušiť</strong>, stačí odpovedať na tento email.
</p>

<p>
Tešíme sa na tvoju návštevu ✨<br/>
<strong>History Art &amp; Music Club</strong>
</p>
`;


  // mail pre zákazníka
  await transporter.sendMail({
    from,
    to: email,
    subject,
    text: textBody,
    html: htmlBody,
  });

  // kópia pre klub
  await transporter.sendMail({
    from,
    to: user,
    subject: `Kópia rezervácie – ${fullName} – ${dateStr} ${timeStr}`,
    text: textBody,
  });
}
