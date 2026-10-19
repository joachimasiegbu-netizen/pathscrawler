import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import {
  DEVICE_STORAGE,
  LEGAL_LAST_UPDATED,
  MINIMUM_ACCOUNT_AGE,
  contactEmailText,
  operatorNameText,
} from '../data/legal'

// Written for the people who actually use PathScrawler - including 13-17
// year olds (see MINIMUM_ACCOUNT_AGE in legal.ts) - so plain words first,
// legal terms only in brackets where the law names something. Every claim
// here has to match the code: update it alongside any change to what the app
// stores or sends.

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="text-xl font-bold text-slate-950 dark:text-slate-50">{title}</h2>
      <div className="space-y-3 leading-7 text-slate-700 dark:text-slate-200">{children}</div>
    </section>
  )
}

function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5">{children}</ul>
}

function DataRow({ what, why }: { what: string; why: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="font-semibold text-slate-900 dark:text-slate-50">{what}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-300">{why}</p>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  const location = useLocation()

  // /privacy#device-storage (the storage notice links here). App.tsx scrolls
  // to the top on every route change after this effect runs, so wait a frame.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [location.hash])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BackButton to="/" label="Home" />

      <div className="mt-6 space-y-10">
        <PageHeader
          icon={ShieldCheck}
          eyebrow="Legal"
          title="Privacy policy"
          subtitle={`What PathScrawler collects, why, and what you can do about it. Last updated ${LEGAL_LAST_UPDATED}.`}
        />

        <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-5 dark:border-primary/30 dark:bg-primary/10">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">The short version</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-700 dark:text-slate-200">
            <li>You can use most of PathScrawler without an account. Then everything you choose is saved only on your own device, and we never see it.</li>
            <li>
              If you create an account, we keep your email address, your username, your Roll a Job results, and the
              careers you add to your Binder or save as pathways.
            </li>
            <li>Your username, title, quote and Roll a Job score appear on the public leaderboard. Your email address is never shown.</li>
            <li>There are no adverts, no tracking cookies, and we never sell your information.</li>
            <li>You need to be {MINIMUM_ACCOUNT_AGE} or older to create an account.</li>
          </ul>
        </div>

        <Section id="who-we-are" title="Who we are">
          <p>
            PathScrawler is run by {operatorNameText()}. We decide how your personal information is used and we're
            responsible for looking after it (in data protection law, we're the "controller").
          </p>
          <p>
            Questions, requests or worries about your information: email <strong>{contactEmailText()}</strong>.
          </p>
        </Section>

        <Section id="without-an-account" title="Using PathScrawler without an account">
          <p>
            Without an account, nothing about your choices is sent to us. The starting point you pick, your subjects,
            any support needs you select, your quick-assessment answers, careers you compare or save, your Roll a Job
            totals and your settings are saved only in your browser on your device, so the app remembers them next
            time.
          </p>
          <p>
            Some of these choices can be personal, such as support needs or choosing the pages for refugees and
            asylum seekers. They stay on your device too. We can't see them, and nobody else can unless they use your
            device.
          </p>
          <p>
            To remove them, clear this site's data in your browser settings. The full list is in{' '}
            <a href="#device-storage" className="font-semibold text-primary underline dark:text-primary-light">
              What we save on your device
            </a>{' '}
            below.
          </p>
        </Section>

        <Section id="with-an-account" title="If you create an account">
          <p>This is what we keep on our servers, and why:</p>
          <div className="grid gap-3">
            <DataRow
              what="Your email address and password"
              why="To create your account, sign you in, and send account emails such as confirming your address or resetting your password. Your password is stored scrambled (hashed) by our sign-in provider. Nobody at PathScrawler can see it."
            />
            <DataRow
              what="Your username, the title you show, and your graduation quote (if you earn one)"
              why="To show you on the leaderboard. We also record when you last changed your username, because names can only be changed once every 7 days."
            />
            <DataRow
              what="Your Roll a Job results"
              why="Each roll (the career, its rarity tier, its points and the time), each title you unlock, and your score, best cards, roll count and best tier worked out from them. This is what runs the leaderboard."
            />
            <DataRow
              what="Your Career Binder and saved pathways"
              why="The cards in your Binder (career, tier, salary and when you rolled it) and the careers you saved as pathways, so they're there on any device you sign in on. Only you can see them. If you used them before signing in on this device, they're added to your account when you sign in."
            />
          </div>
          <p>
            We use this information because you asked us to give you an account, a place on the leaderboard and a
            Binder that follows you between devices (in data protection law, "performance of a contract").
          </p>
          <p>
            Your compare list, the choices you make along your journey and your settings stay on your device even
            when you're signed in. They aren't copied to our servers.
          </p>
        </Section>

        <Section id="technical" title="Technical information">
          <p>
            Like every website, PathScrawler can't reach you without some technical information. When you visit, the
            services that host the app automatically receive your IP address and basic details about your browser and
            device. They use these to deliver the pages and to keep the service secure, for example by spotting
            attacks. Those services are:
          </p>
          <List>
            <li>Vercel, which hosts the website.</li>
            <li>Supabase, which runs our database and sign-in.</li>
            <li>Google Fonts and cdnfonts.com, which supply the app's fonts.</li>
          </List>
          <p>
            We rely on our "legitimate interests" in running a website that works and is secure. We don't use this
            information to track you, build a profile of you, or show you adverts. PathScrawler has no analytics and
            never asks for your location.
          </p>
        </Section>

        <Section id="public" title="What other people can see">
          <p>
            The leaderboard is public. Anyone can see it, including people without an account. For each player it
            shows the username, the equipped title, the graduation quote, the score, the number of rolls, the best
            cards and the best rarity tier.
          </p>
          <p>
            Your email address is never shown. Please don't put personal details in your username or quote, such as
            your full name, your school, or how to contact you.
          </p>
        </Section>

        <Section id="sharing" title="Who we share information with">
          <p>
            We never sell your information or share it with advertisers. We only use these service providers, who act
            on our instructions and must keep your information safe:
          </p>
          <List>
            <li>
              <strong>Supabase</strong> stores account, leaderboard, Binder and saved-pathway information. Our
              database is in London, UK.
            </li>
            <li>
              <strong>Vercel</strong> hosts the website from servers around the world, including in the United States.
            </li>
            <li>
              <strong>Google Fonts</strong> and <strong>cdnfonts.com</strong> receive your IP address when your browser
              downloads the fonts.
            </li>
          </List>
          <p>
            Some of these companies are based in, or may handle information in, countries outside the UK, including
            the United States. When that happens, the safeguards UK law requires apply, such as the UK International
            Data Transfer Agreement or the UK–US "data bridge".
          </p>
          <p>We may also share information if the law requires us to, for example in response to a court order.</p>
        </Section>

        <Section id="how-long" title="How long we keep it">
          <List>
            <li>
              <strong>Account information</strong> (email, username, title, quote, Roll a Job results, Binder and
              saved pathways): until you ask us to delete your account. We then delete it within one month. Copies in our providers' backups are
              removed when those backups expire.
            </li>
            <li>
              <strong>Technical information</strong> in our providers' logs: for a short time, as set by those
              providers.
            </li>
            <li>
              <strong>Information on your device</strong>: until you clear it in your browser. Signing out removes
              the sign-in token.
            </li>
          </List>
        </Section>

        <Section id="your-rights" title="Your rights">
          <p>You have the right to:</p>
          <List>
            <li>get a copy of the information we hold about you</li>
            <li>have it corrected if it's wrong</li>
            <li>have it deleted, including your whole account</li>
            <li>ask us to limit how we use it, or object to how we use it</li>
            <li>get your information in a format you can take elsewhere</li>
          </List>
          <p>
            To do any of these, email <strong>{contactEmailText()}</strong> from the address on your account. There
            isn't a delete-account button in the app yet, so email us and we'll do it for you. It's free, and we'll
            reply within one month.
          </p>
          <p>
            If you're unhappy with how we've handled your information, you can complain to the Information
            Commissioner's Office (ICO), the UK's data protection regulator, at{' '}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline dark:text-primary-light"
            >
              ico.org.uk/make-a-complaint
            </a>{' '}
            or on 0303 123 1113. We'd like the chance to sort it out first, so please contact us before you do.
          </p>
        </Section>

        <Section id="children" title="Children and young people">
          <p>
            PathScrawler is made for people planning their future, and that includes school pupils. You need to be{' '}
            {MINIMUM_ACCOUNT_AGE} or older to create an account. If you're younger, you can still use everything that
            doesn't need an account. Your choices are only saved on your own device.
          </p>
          <p>
            When you sign up, we ask for the month and year you were born. Your browser checks this on your device.
            We don't store it or send it anywhere.
          </p>
          <p>
            If we find out that someone under {MINIMUM_ACCOUNT_AGE} has an account, we'll delete it. Parents and
            carers can contact us at <strong>{contactEmailText()}</strong>.
          </p>
          <p>
            If you're under 18, we don't show you adverts, we don't build profiles of you for marketing, and we never
            ask for your location.
          </p>
        </Section>

        <Section id="device-storage" title="What we save on your device">
          <p>
            PathScrawler doesn't use cookies. It saves information in your browser's storage instead ("local
            storage", which stays until you clear it, and "session storage", which your browser deletes when you
            close it). Each item is needed for a feature you chose to use or a setting you picked, so the law doesn't
            require us to ask first, but we do have to tell you. There's nothing for advertising or tracking.
          </p>
          <div className="grid gap-3">
            {DEVICE_STORAGE.map((item) => (
              <div key={item.key} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <code className="break-all font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">{item.key}</code>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.where}</span>
                </div>
                <p className="mt-2 text-slate-700 dark:text-slate-200">{item.what}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Saved: {item.whenSaved}</p>
              </div>
            ))}
          </div>
          <p>
            The font services listed above follow their own privacy policies when your browser downloads fonts from
            them. To remove everything PathScrawler saved, clear this site's data in your browser settings.
          </p>
        </Section>

        <Section id="changes" title="Changes to this policy">
          <p>
            If we change how we use your information, we'll update this page and the date at the top. If a change is
            important, we'll tell you in the app.
          </p>
          <p>
            See also our{' '}
            <Link to="/terms" className="font-semibold text-primary underline dark:text-primary-light">
              Terms of use
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  )
}
