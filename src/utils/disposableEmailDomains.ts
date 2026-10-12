// Client-side mirror of the domain list seeded into Supabase's
// disposable_email_domains table (supabase/schema.sql) - this is UX only,
// so a normal signup gets an instant "that's a throwaway address" message
// instead of waiting on a round trip to find out. It is NOT the real
// security boundary: anyone can call Supabase Auth's REST API directly and
// skip this file entirely, so the actual block is the "before user
// created" Postgres Auth Hook (hook_reject_disposable_email in schema.sql)
// - see that file's own comment for why signup has to be enforced there,
// not here, to actually hold. Keep this list and that table in sync by
// hand; they're two separate copies by necessity (one runs in the browser,
// one runs inside Supabase's Auth service).
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'mailinator.net', 'mailinator.org', 'sogetthis.com',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
  'guerrillamail.de', 'guerrillamail.info', 'guerrillamailblock.com', 'grr.la', 'sharklasers.com',
  '10minutemail.com', '10minutemail.net', '20minutemail.com', 'anonbox.net',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'tempmailo.com', 'tempmail.net',
  'tempmail.plus', 'tempmail.dev', 'tmpmail.org', 'tmpeml.com', 'tmail.ws', 'mail-temp.com',
  'mailtemp.info', 'mailtemporaire.com', 'mail-temporaire.fr', 'correotemporal.org',
  'yopmail.com', 'yopmail.net', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'jetable.org',
  'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'trashmail.me', 'trash-mail.com',
  'dispostable.com', 'discard.email', 'discardmail.com', 'mytrashmail.com', 'deadaddress.com',
  'getnada.com', 'fakeinbox.com', 'fakemailgenerator.com', 'emailfake.com', 'inboxkitten.com',
  'maildrop.cc', 'mailnesia.com', 'mailcatch.com', 'mailnull.com', 'spamgourmet.com',
  'moakt.com', 'moakt.cc', 'mohmal.com', 'pokiemail.com', 'spam4.me', 'spambog.com',
  'spamex.com', 'spamavert.com', 'burnermail.io', 'dropmail.me', 'crazymailing.com',
  'mintemail.com', 'mytemp.email', 'emailondeck.com', '1secmail.com', '1secmail.net',
  '1secmail.org', 'einrot.com', 'kurzepost.de', 'spoofmail.de', 'trbvm.com', 'tafmail.com',
  'boximail.com', 'tempail.com', 'disposablemail.com', 'byom.de', 'wegwerfemail.de',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org',
])

/** Case-insensitive; only looks at the domain after the last `@` (matching
 * the Postgres side's `split_part(email, '@', 2)`) - not exhaustive (new
 * throwaway providers appear constantly), just the common well-known ones. */
export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split('@').pop()
  if (!domain) return false
  return DISPOSABLE_EMAIL_DOMAINS.has(domain)
}
