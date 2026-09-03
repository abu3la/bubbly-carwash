/**
 * SMS delivery, behind one interface.
 *
 * Supabase's built-in phone auth only speaks to Twilio, MessageBird, Vonage and
 * Textlocal. Sama sends to Saudi numbers, where the sensible providers are
 * local — Taqnyat, Msegat — and none of them are on that list. So Supabase does
 * not talk to a provider at all: it generates the code and hands it to us
 * through the Send SMS Hook, and we deliver it.
 *
 * The consequence worth keeping: the provider is ours, not the vendor's.
 * Switching from one to another is a file in here, not a dashboard migration
 * and not a re-auth of every user.
 */
export interface SmsMessage {
  /** E.164, e.g. +966551234567. */
  to: string;
  body: string;
}

export interface SmsProvider {
  readonly name: string;
  send(msg: SmsMessage): Promise<void>;
}

/**
 * Development. Writes the message to the Worker log and sends nothing.
 *
 * This is what makes a real login possible before any provider account exists:
 * the auth flow is genuine — Supabase issues a real session — and only the
 * delivery leg is stubbed. Read the code with `wrangler tail`.
 */
export class LogSmsProvider implements SmsProvider {
  readonly name = 'log';
  async send(msg: SmsMessage): Promise<void> {
    console.log(`[sms:log] to=${msg.to} body=${JSON.stringify(msg.body)}`);
  }
}

/**
 * Taqnyat (taqnyat.sa). Sketched, not live: it needs a bearer token and an
 * approved sender name, and the sender name requires CITC registration, which
 * in turn generally requires a Saudi CR. Until that exists this cannot work, so
 * it throws rather than pretending to send.
 */
export class TaqnyatSmsProvider implements SmsProvider {
  readonly name = 'taqnyat';
  constructor(
    private readonly bearer: string,
    private readonly sender: string,
  ) {}

  async send(msg: SmsMessage): Promise<void> {
    const res = await fetch('https://api.taqnyat.sa/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.bearer}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: [msg.to.replace(/^\+/, '')],
        body: msg.body,
        sender: this.sender,
      }),
    });
    if (!res.ok) {
      throw new Error(`taqnyat ${res.status}: ${await res.text()}`);
    }
  }
}

/**
 * Picks the provider from what is configured.
 *
 * Falls back to logging rather than throwing: a missing provider must not stop
 * a developer signing in, and in production the absence is visible in the log
 * line rather than as a silent success.
 */
export function resolveSmsProvider(env: {
  TAQNYAT_BEARER?: string;
  TAQNYAT_SENDER?: string;
}): SmsProvider {
  if (env.TAQNYAT_BEARER && env.TAQNYAT_SENDER) {
    return new TaqnyatSmsProvider(env.TAQNYAT_BEARER, env.TAQNYAT_SENDER);
  }
  return new LogSmsProvider();
}
