import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = 'info@desifest.ca';
const FROM_EMAIL = 'DESIFEST <noreply@desifest.ca>';
const FROM_SATHISH = 'Sathish Bala via DESIFEST <noreply@desifest.ca>';

let AVATAR_BUFFER = null;
try {
  const avatarPath = path.join(__dirname, '..', 'public', 'images', 'sathish-avatar.png');
  AVATAR_BUFFER = fs.readFileSync(avatarPath);
} catch (e) {
  AVATAR_BUFFER = null;
}
const AVATAR_CID = 'sathish-avatar';
const AVATAR_SRC = AVATAR_BUFFER ? `cid:${AVATAR_CID}` : 'https://desifest.ca/images/sathish-avatar.png';

function getAvatarAttachments() {
  if (!AVATAR_BUFFER) return [];
  return [{ content: AVATAR_BUFFER, filename: 'sathish-avatar.png', contentId: AVATAR_CID }];
}

async function sendEmail(opts) {
  const hasAvatar = opts.html && opts.html.includes(`cid:${AVATAR_CID}`);
  if (hasAvatar) {
    opts.attachments = [...(opts.attachments || []), ...getAvatarAttachments()];
  }
  return resend.emails.send(opts);
}

function wrap(title, bodyRows) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;" bgcolor="#f4f4f4">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:30px 10px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-collapse:collapse;">

<tr><td bgcolor="#1B3A2D" style="background-color:#1B3A2D;padding:30px 40px;border-radius:8px 8px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:bold;color:#ffffff;padding-bottom:5px;letter-spacing:2px;">DESIFEST</td>
    </tr>
    <tr>
      <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#A8C5A0;">Canada's Largest South Asian Music & Arts Festival</td>
    </tr>
  </table>
</td></tr>

<tr><td bgcolor="#264D38" style="background-color:#264D38;padding:20px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;">${title}</td></tr>
  </table>
</td></tr>

<tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:30px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${bodyRows}
  </table>
</td></tr>

<tr><td bgcolor="#1B3A2D" style="background-color:#1B3A2D;padding:20px 40px;border-radius:0 0 8px 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#A8C5A0;text-align:center;">
      DESIFEST 2026 &mdash; <a href="https://desifest.ca" style="color:#ffffff;text-decoration:none;">desifest.ca</a>
    </td></tr>
  </table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function sathishSignature() {
  return `<tr><td style="padding:25px 0 0 0;border-top:1px solid #e5e5e5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="60" valign="top" style="padding-right:15px;">
        <img src="${AVATAR_SRC}" alt="Sathish Bala" width="50" height="50" style="width:50px;height:50px;border-radius:50%;display:block;object-fit:cover;border:2px solid #100422;" />
      </td>
      <td valign="middle">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#1B3A2D;margin:0;">Sathish Bala</p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;margin:2px 0 0 0;">Founder, DESIFEST</p>
      </td>
    </tr>
  </table>
</td></tr>`;
}

function wrapPersonal(title, bodyRows) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;" bgcolor="#f4f4f4">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:30px 10px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-collapse:collapse;">

<tr><td bgcolor="#100422" style="background-color:#100422;padding:25px 40px;border-radius:8px 8px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="55" valign="middle" style="padding-right:15px;">
        <img src="${AVATAR_SRC}" alt="Sathish Bala" width="50" height="50" style="width:50px;height:50px;border-radius:50%;display:block;object-fit:cover;border:2px solid #EEFE08;" />
      </td>
      <td valign="middle">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;margin:0;">Sathish Bala</p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#BCA6DF;margin:2px 0 0 0;">Founder, DESIFEST</p>
      </td>
      <td align="right" valign="middle">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#EEFE08;letter-spacing:2px;">DESIFEST</span>
      </td>
    </tr>
  </table>
</td></tr>

<tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:30px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${bodyRows}
    ${sathishSignature()}
  </table>
</td></tr>

<tr><td bgcolor="#100422" style="background-color:#100422;padding:15px 40px;border-radius:0 0 8px 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#BCA6DF;text-align:center;">
      DESIFEST 2026 &mdash; Canada's Largest South Asian Music & Arts Festival<br/>
      <a href="https://desifest.ca" style="color:#EEFE08;text-decoration:none;">desifest.ca</a>
    </td></tr>
  </table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function fieldRow(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#555555;padding:8px 0;width:160px;vertical-align:top;text-transform:uppercase;letter-spacing:0.5px;">${label}</td>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222222;padding:8px 0;vertical-align:top;">${value}</td>
  </tr>`;
}

function sectionHeader(text) {
  return `<tr><td colspan="2" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#1B3A2D;padding:20px 0 8px 0;border-bottom:2px solid #6B8F71;">${text}</td></tr>`;
}

function textBlock(label, text) {
  if (!text) return '';
  return `<tr><td colspan="2" style="padding:15px 0 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td bgcolor="#f8f8f8" style="background-color:#f8f8f8;padding:15px 20px;border-radius:6px;border-left:4px solid #6B8F71;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#888888;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;margin:0;line-height:1.6;">${text}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

function linkValue(url) {
  if (!url) return '';
  return `<a href="${url}" style="color:#1B3A2D;text-decoration:underline;">${url}</a>`;
}

function emailValue(addr) {
  if (!addr) return '';
  return `<a href="mailto:${addr}" style="color:#1B3A2D;text-decoration:underline;">${addr}</a>`;
}

function buildContactEmail(data) {
  const { name, email, message, consent, phone_code, phone, source } = data;
  const phoneDisplay = [phone_code, phone].filter(Boolean).join(' ');
  const prefix = source ? `[${source}]` : '';
  const body = [
    source ? fieldRow('Source', source) : '',
    fieldRow('Name', name),
    fieldRow('Email', emailValue(email)),
    fieldRow('Phone', phoneDisplay),
    fieldRow('Consent', consent ? 'Yes' : 'No'),
    textBlock('Message', message),
  ].join('');

  const title = source ? `New Contact Form - ${source}` : 'New Contact Form Submission';
  return {
    subject: source ? `${prefix} New Contact Form - ${name}` : `New Contact Form - ${name}`,
    html: wrap(title, body)
  };
}

function buildArtistEmail(data) {
  const d = data;
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ');
  const phone = [d.phoneCode, d.phone].filter(Boolean).join(' ');
  const managerPhone = [d.managerPhoneCode, d.managerPhone].filter(Boolean).join(' ');
  const managerName = [d.managerFirstName, d.managerLastName].filter(Boolean).join(' ');
  const pastLinks = Array.isArray(d.pastLinks) ? d.pastLinks.filter(Boolean).join(', ') : (d.pastLinks || '');
  const address = [d.address, d.city, d.province, d.postalCode, d.country].filter(Boolean).join(', ');

  const body = [
    sectionHeader('Personal Information'),
    fieldRow('Event', d.event),
    fieldRow('Name', fullName),
    fieldRow('Email', emailValue(d.email)),
    fieldRow('Phone', phone),
    fieldRow('Address', address),

    sectionHeader('Social Media'),
    fieldRow('Facebook', linkValue(d.facebook)),
    fieldRow('YouTube', linkValue(d.youtube)),
    fieldRow('Instagram', linkValue(d.instagram)),
    fieldRow('TikTok', linkValue(d.tiktok)),
    fieldRow('Spotify', linkValue(d.spotify)),
    fieldRow('Website', linkValue(d.website)),

    sectionHeader('Performance Details'),
    fieldRow('Genre', d.genre),
    fieldRow('Other Genre', d.otherGenre),
    fieldRow('Language', d.performanceLanguage),
    fieldRow('Band/Group', d.isBand),
    fieldRow('Performed Before', d.performedBefore),
    fieldRow('Performance Type', d.performanceType),
    fieldRow('SOCAN Registered', d.socanRegistered),

    managerName ? sectionHeader('Manager Information') : '',
    managerName ? fieldRow('Name', managerName) : '',
    managerName ? fieldRow('Email', emailValue(d.managerEmail)) : '',
    managerName ? fieldRow('Phone', managerPhone) : '',

    textBlock('Past Performance Links', pastLinks),
    textBlock('Ideas / Additional Info', d.ideas),
    fieldRow('Consent', d.consent ? 'Yes' : 'No'),
  ].join('');

  return {
    subject: `New Artist Application - ${fullName}`,
    html: wrap('New Artist Application', body)
  };
}

function buildVolunteerEmail(data) {
  const d = data;
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ');
  const phone = [d.phoneCode, d.phone].filter(Boolean).join(' ');
  const address = [d.address, d.city, d.province, d.postalCode, d.country].filter(Boolean).join(', ');

  const body = [
    fieldRow('Name', fullName),
    fieldRow('Email', emailValue(d.email)),
    fieldRow('Phone', phone),
    fieldRow('LinkedIn', linkValue(d.linkedin)),
    fieldRow('Address', address),
    fieldRow('Genre Interest', d.genre),
    textBlock('How Can You Help?', d.howCanYouHelp),
    textBlock('How Can We Help You?', d.howCanWeHelpYou),
    fieldRow('Consent', d.consent ? 'Yes' : 'No'),
  ].join('');

  return {
    subject: `New Volunteer Application - ${fullName}`,
    html: wrap('New Volunteer Application', body)
  };
}

function buildBlogPublishedEmail(data) {
  const { title, slug, description, sections, imageUrl, reelScript } = data;
  const blogUrl = `https://desifest.ca/blog/${slug}`;

  const contentPreview = [];
  if (Array.isArray(sections)) {
    for (const s of sections) {
      if (s.type === 'intro' || s.type === 'paragraph') {
        contentPreview.push(s.text);
        if (contentPreview.length >= 3) break;
      }
    }
  }
  const previewText = contentPreview.join('<br/><br/>') || description || '';

  const imageRow = imageUrl ? `<tr><td style="padding:0 0 20px 0;">
    <img src="https://desifest.ca${imageUrl}" alt="${title}" style="width:100%;max-width:520px;height:auto;border-radius:6px;" />
  </td></tr>` : '';

  const reelRow = reelScript ? `<tr><td style="padding:30px 0 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f3;border-radius:8px;border-left:4px solid #1B3A2D;">
      <tr><td style="padding:20px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#1B3A2D;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:1px;">60-Second Reel Script</p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666666;margin:0 0 12px 0;">Ready-to-read narration for Instagram Reels / TikTok / YouTube Shorts</p>
        <p style="font-family:Georgia,serif;font-size:14px;color:#333333;line-height:1.8;margin:0;white-space:pre-wrap;">${reelScript}</p>
      </td></tr>
    </table>
  </td></tr>` : '';

  const body = [
    imageRow,
    `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:20px;">
      ${previewText}
    </td></tr>`,
    `<tr><td style="padding:10px 0 0 0;">
      <a href="${blogUrl}" style="display:inline-block;background-color:#1B3A2D;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Read Full Article</a>
    </td></tr>`,
    reelRow,
  ].join('');

  return {
    subject: `New Blog Published: ${title}`,
    html: wrap(`Blog Published: ${title}`, body)
  };
}

export async function sendBlogPublishedEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping blog publish email');
    return;
  }
  try {
    const emailContent = buildBlogPublishedEmail(data);
    const result = await sendEmail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    console.log('Blog published email sent:', result);
  } catch (err) {
    console.error('Failed to send blog published email:', err);
  }
}

export async function sendWelcomeEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping welcome email');
    return;
  }
  try {
    const { email, firstName, role } = data;
    const name = firstName || 'friend';
    const isArtist = role === 'artist';

    const dashboardUrl = 'https://desifest.ca/dashboard';
    const directoryUrl = 'https://desifest.ca/community';

    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const artistBody = [
      p(`Hey ${name},`),
      p(`I'm Sathish — I started DESIFEST because I believed South Asian artists in Canada deserved a real stage, not a side stage. Thanks for signing up. Seriously. Every artist who joins makes this community stronger.`),
      p(`Right now, your profile is a blank canvas. Here's what I'd love for you to do:`),
      p(`<strong>1. Tell your story.</strong> Add your bio, your genre, your city. The stuff that makes you <em>you</em>.<br/><br/>
         <strong>2. Add a press photo.</strong> People book with their eyes first. A good photo goes a long way.<br/><br/>
         <strong>3. Hang tight.</strong> I personally review every profile before it goes live. I want to make sure we're putting our best foot forward together.`),
      p(`Once you're approved, event organizers and venues across Canada can find you and book you directly. No middleman. No gatekeepers.`),
      `<tr><td style="padding:10px 0 20px 0;">
        <a href="${dashboardUrl}" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Set Up Your Profile</a>
      </td></tr>`,
      p(`If you ever need anything — and I mean anything — just reply to this email. I read every one.`),
      p(`Welcome to the family.<br/><br/>— Sathish`),
    ].join('');

    const clientBody = [
      p(`Hey ${name},`),
      p(`I'm Sathish — the person behind DESIFEST. Thanks for joining us. Whether you're planning a wedding, a corporate event, a house party, or a community celebration — you just got access to some of the most talented South Asian artists in Canada.`),
      p(`Here's the thing I want you to know: every artist in our directory is someone I've personally reviewed. These aren't random profiles. These are real, verified, incredible performers.`),
      p(`<strong>Browse around.</strong> Find someone who speaks to your vibe. When you're ready, send them a booking request right through the platform — it's that simple.`),
      `<tr><td style="padding:10px 0 20px 0;">
        <a href="${directoryUrl}" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Browse Artists</a>
      </td></tr>`,
      p(`Need help finding the right artist for your event? Just reply to this email. I'm happy to point you in the right direction.`),
      p(`Glad you're here.<br/><br/>— Sathish`),
    ].join('');

    const html = wrapPersonal('Welcome', isArtist ? artistBody : clientBody);

    await sendEmail({
      from: FROM_SATHISH,
      replyTo: TO_EMAIL,
      to: email,
      subject: isArtist ? `Welcome to DESIFEST, ${name} — let's get you set up` : `Welcome to DESIFEST, ${name}`,
      html,
    });
    console.log('Welcome email sent to:', email);
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}

export async function sendProfileApprovedEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping profile approved email');
    return;
  }
  try {
    const { email, firstName, slug } = data;
    const name = firstName || 'friend';
    const profileUrl = slug ? `https://desifest.ca/our-artists/${slug}` : 'https://desifest.ca/community';

    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const body = [
      p(`Hey ${name},`),
      p(`Just wanted to personally let you know — I've reviewed your profile and it's now <strong>live in the DESIFEST Artist Directory</strong>.`),
      p(`That means anyone looking for South Asian talent in Canada can now find you, hear your story, and reach out to book you. Your profile is out there working for you.`),
      `<tr><td style="padding:10px 0 20px 0;">
        <a href="${profileUrl}" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">See Your Live Profile</a>
      </td></tr>`,
      p(`Quick tip — profiles with a strong photo, a real bio, and social links get way more attention. If you haven't filled those in yet, now's a great time.`),
      p(`I'm genuinely excited to have you as part of this. Let's make something happen.<br/><br/>— Sathish`),
    ].join('');

    const html = wrapPersonal('You\'re Live!', body);

    await sendEmail({
      from: FROM_SATHISH,
      replyTo: TO_EMAIL,
      to: email,
      subject: `You're live, ${name} — your DESIFEST profile is up`,
      html,
    });
    console.log('Profile approved email sent to:', email);
  } catch (err) {
    console.error('Failed to send profile approved email:', err);
  }
}

export async function sendProfileRejectedEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping profile rejected email');
    return;
  }
  try {
    const { email, firstName, reason } = data;
    const name = firstName || 'friend';

    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const reasonBlock = reason ? `<tr><td style="padding:0 0 15px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td bgcolor="#f8f6f3" style="background-color:#f8f6f3;padding:15px 20px;border-radius:6px;border-left:4px solid #100422;">
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;margin:0;line-height:1.6;">${reason}</p>
        </td></tr>
      </table>
    </td></tr>` : '';

    const body = [
      p(`Hey ${name},`),
      p(`I took a look at your profile, and it's not quite ready to go live yet — but that doesn't mean it won't be. I just want to make sure every artist in the directory is putting their best self forward.`),
      reasonBlock,
      p(`Here's what I'd suggest: hop into your dashboard, update the things mentioned above, and I'll take another look. Most profiles get approved on the second pass.`),
      `<tr><td style="padding:10px 0 20px 0;">
        <a href="https://desifest.ca/dashboard" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Update Your Profile</a>
      </td></tr>`,
      p(`If you're not sure what to change or need a hand, just reply to this email. I'm here to help, not gatekeep.`),
      p(`Talk soon.<br/><br/>— Sathish`),
    ].join('');

    const html = wrapPersonal('A Quick Note About Your Profile', body);

    await sendEmail({
      from: FROM_SATHISH,
      to: email,
      replyTo: TO_EMAIL,
      subject: `${name}, a quick note about your DESIFEST profile`,
      html,
    });
    console.log('Profile rejected email sent to:', email);
  } catch (err) {
    console.error('Failed to send profile rejected email:', err);
  }
}

export async function sendBookingRequestEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping booking request email');
    return;
  }
  try {
    const { booking, artistName, artistEmail, clientEmail } = data;
    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const artistFirstName = artistName.split(' ')[0];

    const personalBody = [
      p(`Hey ${artistFirstName},`),
      p(`Someone wants to book you! Here are the details:`),
      fieldRow('Event Date', booking.event_date),
      fieldRow('Event Type', booking.event_type),
      fieldRow('Audience Size', booking.audience_size),
      fieldRow('City', booking.city),
      fieldRow('Venue', booking.venue),
      fieldRow('Budget Range', booking.budget_range),
      textBlock('Message from Client', booking.message),
      `<tr><td style="padding:15px 0 20px 0;">
        <a href="https://desifest.ca/dashboard" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">View in Dashboard</a>
      </td></tr>`,
      p(`Log into your dashboard to accept, decline, or send a counter offer. Don't leave them hanging!`),
      p(`This is what it's all about.<br/><br/>— Sathish`),
    ].join('');

    const artistHtml = wrapPersonal('You Got a Booking Request!', personalBody);

    if (artistEmail) {
      await sendEmail({
        from: FROM_SATHISH,
        replyTo: TO_EMAIL,
        to: artistEmail,
        subject: `${artistFirstName}, you got a booking request!`,
        html: artistHtml,
      });
    }

    const adminBody = [
      sectionHeader('New Booking Request'),
      fieldRow('Artist', artistName),
      fieldRow('Artist Email', emailValue(artistEmail)),
      fieldRow('Client Email', emailValue(clientEmail)),
      fieldRow('Event Date', booking.event_date),
      fieldRow('Event Type', booking.event_type),
      fieldRow('Audience Size', booking.audience_size),
      fieldRow('City', booking.city),
      fieldRow('Venue', booking.venue),
      fieldRow('Budget Range', booking.budget_range),
      textBlock('Message', booking.message),
    ].join('');

    await sendEmail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Booking Request for ${artistName}`,
      html: wrap('New Booking Request', adminBody),
    });

    console.log('Booking request email sent');
  } catch (err) {
    console.error('Failed to send booking request email:', err);
  }
}

export async function sendBookingResponseEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping booking response email');
    return;
  }
  try {
    const { booking, artistName, clientEmail, status } = data;
    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    let messageText;
    if (status === 'accepted') {
      messageText = [
        p(`Hey there,`),
        p(`Good news — <strong>${artistName}</strong> has accepted your booking request! You're all set.`),
        fieldRow('Event Date', booking.event_date),
        fieldRow('Event Type', booking.event_type),
        booking.artist_response ? textBlock(`A note from ${artistName.split(' ')[0]}`, booking.artist_response) : '',
        `<tr><td style="padding:15px 0 20px 0;">
          <a href="https://desifest.ca/dashboard" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">View in Dashboard</a>
        </td></tr>`,
        p(`Love seeing these connections happen. This is exactly why we built this.<br/><br/>— Sathish`),
      ].join('');
    } else if (status === 'counter') {
      messageText = [
        p(`Hey there,`),
        p(`<strong>${artistName}</strong> is interested in your booking — they've sent back a counter offer. Take a look:`),
        booking.counter_price ? fieldRow('Proposed Price', booking.counter_price) : '',
        booking.counter_date ? fieldRow('Proposed Date', booking.counter_date) : '',
        booking.artist_response ? textBlock(`A note from ${artistName.split(' ')[0]}`, booking.artist_response) : '',
        `<tr><td style="padding:15px 0 20px 0;">
          <a href="https://desifest.ca/dashboard" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Review the Offer</a>
        </td></tr>`,
        p(`Log into your dashboard to accept or keep the conversation going.<br/><br/>— Sathish`),
      ].join('');
    } else {
      messageText = [
        p(`Hey there,`),
        p(`Unfortunately, <strong>${artistName}</strong> isn't available for this one. Don't take it personally — schedules are tight and these things happen.`),
        booking.artist_response ? textBlock(`A note from ${artistName.split(' ')[0]}`, booking.artist_response) : '',
        `<tr><td style="padding:15px 0 20px 0;">
          <a href="https://desifest.ca/community" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Browse More Artists</a>
        </td></tr>`,
        p(`There are plenty of incredible artists in the directory. I'm sure we'll find the right match for your event.<br/><br/>— Sathish`),
      ].join('');
    }

    const statusLabel = status === 'counter' ? 'Counter Offer' : status.charAt(0).toUpperCase() + status.slice(1);
    const html = wrapPersonal(`Booking ${statusLabel}`, messageText);

    await sendEmail({
      from: FROM_SATHISH,
      replyTo: TO_EMAIL,
      to: clientEmail,
      subject: status === 'accepted' ? `${artistName} accepted your booking!`
             : status === 'counter' ? `${artistName} sent you a counter offer`
             : `Booking update — ${artistName}`,
      html,
    });
    console.log('Booking response email sent');
  } catch (err) {
    console.error('Failed to send booking response email:', err);
  }
}

export async function sendBookingConfirmedEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping booking confirmed email');
    return;
  }
  try {
    const { booking, artistName, artistEmail, clientEmail } = data;
    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const body = [
      p(`It's official — this booking is confirmed!`),
      fieldRow('Artist', artistName),
      fieldRow('Event Date', booking.event_date),
      fieldRow('Event Type', booking.event_type),
      fieldRow('Venue', booking.venue),
      fieldRow('City', booking.city),
      p(`Both sides are locked in. Now go make something amazing together.`),
      `<tr><td style="padding:10px 0 20px 0;">
        <a href="https://desifest.ca/dashboard" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">View Details</a>
      </td></tr>`,
      p(`This is my favourite part of the job — seeing artists and events come together. Let me know how it goes.<br/><br/>— Sathish`),
    ].join('');

    const html = wrapPersonal('Booking Confirmed!', body);

    const recipients = [clientEmail];
    if (artistEmail && artistEmail !== clientEmail) recipients.push(artistEmail);

    await sendEmail({
      from: FROM_SATHISH,
      replyTo: TO_EMAIL,
      to: recipients,
      subject: `It's official — ${artistName} is booked!`,
      html,
    });
    console.log('Booking confirmed email sent');
  } catch (err) {
    console.error('Failed to send booking confirmed email:', err);
  }
}

export async function sendReviewPromptEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping review prompt email');
    return;
  }
  try {
    const { clientEmail, artistName, bookingId } = data;
    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const body = [
      p(`Hey there,`),
      p(`Your event with <strong>${artistName}</strong> just wrapped up — how'd it go? I'd love to hear about it.`),
      p(`Your review helps other people find great artists, and it means the world to the performer. Even a few sentences makes a difference.`),
      `<tr><td style="padding:10px 0 20px 0;">
        <a href="https://desifest.ca/dashboard" style="display:inline-block;background-color:#100422;color:#EEFE08;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:6px;letter-spacing:0.5px;">Leave a Review</a>
      </td></tr>`,
      p(`Thanks for being part of this.<br/><br/>— Sathish`),
    ].join('');

    const html = wrapPersonal('How Was the Show?', body);

    await sendEmail({
      from: FROM_SATHISH,
      replyTo: TO_EMAIL,
      to: clientEmail,
      subject: `How was your event with ${artistName}?`,
      html,
    });
    console.log('Review prompt email sent');
  } catch (err) {
    console.error('Failed to send review prompt email:', err);
  }
}

export async function sendRequestInfoEmail(artistEmail, artistName, message) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping request info email');
    return;
  }
  try {
    const firstName = artistName.split(' ')[0];
    const p = (text) => `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;padding-bottom:15px;">${text}</td></tr>`;

    const body = [
      p(`Hey ${firstName},`),
      p(`Thanks for applying to DESIFEST — I appreciate you putting yourself out there. Before I can get your profile live, I just need a couple more things from you:`),
      `<tr><td style="padding:0 0 15px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td bgcolor="#f8f6f3" style="background-color:#f8f6f3;padding:15px 20px;border-radius:6px;border-left:4px solid #100422;">
            <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;margin:0;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
          </td></tr>
        </table>
      </td></tr>`,
      p(`Just hit reply on this email with the info and I'll take it from there. Easy.`),
      p(`Looking forward to it.<br/><br/>— Sathish`),
    ].join('');

    const html = wrapPersonal('Quick Question', body);
    const result = await sendEmail({
      from: FROM_SATHISH,
      to: artistEmail,
      replyTo: TO_EMAIL,
      subject: `${firstName}, quick question about your DESIFEST application`,
      html,
    });
    console.log('Request info email sent to:', artistEmail, result);
  } catch (err) {
    console.error('Failed to send request info email:', err);
    throw err;
  }
}

export async function sendFormEmail(formType, data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email notification');
    return;
  }

  try {
    let emailContent;
    switch (formType) {
      case 'contact':
        emailContent = buildContactEmail(data);
        break;
      case 'artist':
        emailContent = buildArtistEmail(data);
        break;
      case 'volunteer':
        emailContent = buildVolunteerEmail(data);
        break;
      default:
        console.warn(`Unknown form type: ${formType}`);
        return;
    }

    const result = await sendEmail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`Email sent for ${formType} form:`, result);
  } catch (err) {
    console.error(`Failed to send ${formType} email notification:`, err);
  }
}
