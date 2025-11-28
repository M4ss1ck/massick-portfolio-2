import type { Payload } from 'payload';
import https from 'https';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface SubmissionField {
    field: string;
    value: string;
}

interface FormSubmission {
    submissionData?: SubmissionField[];
    form?: {
        title?: string;
    };
}

function sendTelegramMessage(chatId: string, text: string, parseMode?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode,
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
            timeout: 30000,
            family: 4, // Force IPv4 - IPv6 causes timeout issues
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else {
                    reject(new Error(`Telegram API error: ${res.statusCode} - ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(data);
        req.end();
    });
}

export async function sendToTelegram(submission: FormSubmission, formTitle?: string): Promise<void> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram credentials not configured');
        return;
    }

    const fields = submission.submissionData
        ? JSON.stringify(submission.submissionData, null, 2)
        : '';

    const message = `<strong>${formTitle ?? 'New Submission'}</strong>\n<pre>${fields}</pre>`;

    try {
        await sendTelegramMessage(TELEGRAM_CHAT_ID, message, 'HTML');
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

export async function sendEmail(
    payload: Payload,
    submission: FormSubmission,
    toEmail?: string
): Promise<void> {
    if (!toEmail) {
        console.warn('No email address provided for notification');
        return;
    }

    const fields = submission.submissionData
        ?.map((field) => `<strong>${field.field}:</strong> ${field.value}`)
        .join('<br>') ?? '';

    try {
        await payload.sendEmail({
            to: toEmail,
            subject: `New Form Submission: ${submission.form?.title ?? 'Contact'}`,
            html: `<h2>New Form Submission</h2><p>${fields}</p>`,
        });
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}
