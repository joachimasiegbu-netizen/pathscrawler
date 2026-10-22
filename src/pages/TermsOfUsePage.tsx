import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ScrollText } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import { LEGAL_LAST_UPDATED, MINIMUM_ACCOUNT_AGE, contactEmailText, operatorNameText } from '../data/legal'

// Same plain-language approach as PrivacyPolicyPage.tsx: readers include
// 13-17 year olds, so rules are written as things you can and can't do.

// scroll-mt-6 matches PrivacyPolicyPage's Section and StudentHubFaqPage's:
// these ids are deep-link targets, and FiguresDisclaimer links to
// #information-not-advice from nine pages, so without it the heading someone
// jumps to lands flush against the top edge of a phone viewport (worst where
// the browser's own UI overlaps it) instead of under a little breathing room.
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

const linkClass = 'font-semibold text-primary underline dark:text-primary-light'

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BackButton to="/" label="Home" />

      <div className="mt-6 space-y-10">
        <PageHeader
          icon={ScrollText}
          eyebrow="Legal"
          title="Terms of use"
          subtitle={`The rules for using PathScrawler. Last updated ${LEGAL_LAST_UPDATED}.`}
        />

        <Section id="about" title="About these terms">
          <p>
            PathScrawler is run by {operatorNameText()} ("we", "us"). By using PathScrawler, you agree to these terms.
            If you don't agree, please don't use it.
          </p>
          <p>
            How we handle your information is explained in our{' '}
            <Link to="/privacy" className={linkClass}>
              Privacy policy
            </Link>
            .
          </p>
        </Section>

        <Section id="who-can-use" title="Who can use PathScrawler">
          <List>
            <li>Anyone can use PathScrawler without an account.</li>
            <li>You need to be {MINIMUM_ACCOUNT_AGE} or older to create an account.</li>
            <li>If you're under 18, please read these terms with a parent or carer.</li>
          </List>
        </Section>

        <Section id="information-not-advice" title="Information, not advice">
          <p>
            Careers, salaries, job market statistics, qualification routes, student finance figures and the Student
            Debt Calculator are general information and estimates. They may be out of date, and they can't take
            account of your own situation. They aren't careers, financial, legal or immigration advice.
          </p>
          <p>Before you make a big decision, check with an official source, for example:</p>
          <List>
            <li>the National Careers Service, or a careers adviser at your school, college or university</li>
            <li>UCAS for university applications</li>
            <li>GOV.UK and Student Finance England for student loans and repayments</li>
            <li>
              a regulated immigration adviser for anything to do with immigration or asylum (in the UK, only
              regulated advisers are allowed to give immigration advice)
            </li>
          </List>
        </Section>

        <Section id="roll-a-job" title="Roll a Job and the leaderboard">
          <List>
            <li>Roll a Job is a game. Careers are picked at random, weighted by how many people do each job.</li>
            <li>Points and titles have no money value. They can't be bought, sold or swapped.</li>
            <li>
              Your username, title, quote and score appear on the public leaderboard when you play while signed in.
            </li>
            <li>
              We can correct scores, remove leaderboard entries or reset the leaderboard, for example if someone
              cheats.
            </li>
          </List>
        </Section>

        <Section id="your-account" title="Your account">
          <List>
            <li>Use an email address that's yours and that you can get to.</li>
            <li>Keep your password private, and don't share your account.</li>
            <li>One account per person.</li>
            <li>
              If you think someone else has used your account, change your password and email us at{' '}
              <strong>{contactEmailText()}</strong>.
            </li>
          </List>
        </Section>

        <Section id="usernames" title="Usernames and quotes">
          <p>Everyone can see your username and graduation quote, so they must not:</p>
          <List>
            <li>be rude, offensive, hateful, bullying or sexual</li>
            <li>pretend to be someone else</li>
            <li>include personal details such as your full name, school, address, phone number or social media</li>
            <li>advertise anything</li>
          </List>
          <p>We can change or remove a username or quote that breaks these rules, or replace it with a random name.</p>
        </Section>

        <Section id="misuse" title="Don't misuse PathScrawler">
          <p>You must not:</p>
          <List>
            <li>try to get into someone else's account, or into parts of PathScrawler you're not meant to reach</li>
            <li>use bots or scripts to roll, earn titles or climb the leaderboard</li>
            <li>copy PathScrawler's content in bulk with automated tools</li>
            <li>overload or attack the service, or get around its security or the age check</li>
          </List>
          <p>If you break these rules, we can suspend or delete your account.</p>
        </Section>

        <Section id="our-content" title="Our content">
          <p>
            PathScrawler's design, text and features belong to us or to the people who license them to us. You can
            use them for your own personal, non-commercial use. Some statistics come from public sources such as the
            Office for National Statistics and are used under the Open Government Licence. The pages that show them
            name their sources.
          </p>
        </Section>

        <Section id="other-websites" title="Links to other websites">
          <p>
            PathScrawler links to other websites, such as course providers and official guidance. We don't control
            them and aren't responsible for what's on them.
          </p>
        </Section>

        <Section id="availability" title="Keeping PathScrawler running">
          <p>
            PathScrawler is free. We work to keep it running and accurate, but we can't promise it will always be
            available or error-free. We may change features, or pause or stop the service.
          </p>
        </Section>

        <Section id="responsibility" title="Our responsibility to you">
          <p>
            We're responsible for loss you suffer that was a foreseeable result of us not using reasonable care and
            skill. We aren't responsible for decisions you make based on general information in PathScrawler (see
            "Information, not advice" above).
          </p>
          <p>
            Nothing in these terms limits our responsibility for death or personal injury caused by our negligence,
            for fraud, or for anything else the law doesn't let us limit. Your legal rights as a consumer aren't
            affected.
          </p>
        </Section>

        <Section id="ending" title="Stopping using PathScrawler">
          <p>
            You can stop using PathScrawler at any time. To delete your account, email us (see the{' '}
            <Link to="/privacy#your-rights" className={linkClass}>
              Privacy policy
            </Link>
            ). If we suspend or delete an account for breaking these terms, we'll tell you why where we can.
          </p>
        </Section>

        <Section id="changes" title="Changes to these terms">
          <p>
            We may update these terms. When we do, we'll change the date at the top of this page, and we'll tell you
            in the app about important changes. If you keep using PathScrawler after a change, the new terms apply.
          </p>
        </Section>

        <Section id="law" title="Which law applies">
          <p>
            These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland,
            you can also bring a claim in your local courts.
          </p>
        </Section>

        <Section id="contact" title="Contact us">
          <p>
            Email <strong>{contactEmailText()}</strong>.
          </p>
        </Section>
      </div>
    </div>
  )
}
