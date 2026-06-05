import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

// ─── Quiz Questions ─────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 0,
    question: 'When a new lead comes in, how do you capture their information?',
    options: [
      { letter: 'A', text: 'Written notes, email, or loose files', score: 1 },
      { letter: 'B', text: 'Basic spreadsheet or notes app', score: 2 },
      { letter: 'C', text: 'CRM, but not everything gets entered', score: 3 },
      { letter: 'D', text: 'CRM with automated lead capture', score: 5 },
    ],
  },
  {
    id: 1,
    question: 'How do you track follow-ups with leads after initial contact?',
    options: [
      { letter: 'A', text: 'No formal tracking — we hope we remember', score: 1 },
      { letter: 'B', text: 'Manual calendar or task list', score: 2 },
      { letter: 'C', text: 'CRM reminders, but inconsistently', score: 3 },
      { letter: 'D', text: 'Automated CRM workflows handle it', score: 5 },
    ],
  },
  {
    id: 2,
    question: 'What % of your leads get a callback or follow-up within 24 hours?',
    options: [
      { letter: 'A', text: 'Less than 25%', score: 1 },
      { letter: 'B', text: '25–50%', score: 2 },
      { letter: 'C', text: '50–75%', score: 3 },
      { letter: 'D', text: '75% or more', score: 5 },
    ],
  },
  {
    id: 3,
    question: 'How do you identify which leads are "hot" vs. "cold" right now?',
    options: [
      { letter: 'A', text: 'Gut feeling and memory', score: 1 },
      { letter: 'B', text: 'Manual notes or tags', score: 2 },
      { letter: 'C', text: 'Some categorization, but inconsistent', score: 3 },
      { letter: 'D', text: 'Automated lead scoring system', score: 5 },
    ],
  },
  {
    id: 4,
    question: 'Can you instantly see if a lead has been contacted recently?',
    options: [
      { letter: 'A', text: 'No — I have to search or ask someone', score: 1 },
      { letter: 'B', text: 'Maybe, depends on how well notes were kept', score: 2 },
      { letter: 'C', text: 'Yes, but it takes manual checking', score: 3 },
      { letter: 'D', text: 'Yes — full automatic timeline with all touchpoints', score: 5 },
    ],
  },
  {
    id: 5,
    question: 'How many reps or team members actively use your CRM daily?',
    options: [
      { letter: 'A', text: "Nobody — we don't really have a CRM", score: 1 },
      { letter: 'B', text: 'Just me (owner only)', score: 2 },
      { letter: 'C', text: 'Some use it, some don\'t', score: 3 },
      { letter: 'D', text: 'Everyone on the team uses it every day', score: 5 },
    ],
  },
  {
    id: 6,
    question: 'How do you track your lead conversion rate and ROI by source?',
    options: [
      { letter: 'A', text: "We don't really track it", score: 1 },
      { letter: 'B', text: 'Rough estimates or gut feel', score: 2 },
      { letter: 'C', text: 'Spreadsheet, reviewed manually sometimes', score: 3 },
      { letter: 'D', text: 'Live dashboards with ROI broken down by source', score: 5 },
    ],
  },
  {
    id: 7,
    question: "When an estimate goes out, what happens if they don't respond?",
    options: [
      { letter: 'A', text: "Usually nothing — we move on", score: 1 },
      { letter: 'B', text: 'Random follow-up, very inconsistent', score: 2 },
      { letter: 'C', text: 'One follow-up if we remember', score: 3 },
      { letter: 'D', text: 'Automated multi-touch follow-up sequence', score: 5 },
    ],
  },
  {
    id: 8,
    question: 'How often do leads disappear with no outcome or reason?',
    options: [
      { letter: 'A', text: "Very often — it's a real problem", score: 1 },
      { letter: 'B', text: 'Pretty often, multiple times a week', score: 2 },
      { letter: 'C', text: 'Sometimes, roughly once a week', score: 3 },
      { letter: 'D', text: 'Almost never — the system flags everything', score: 5 },
    ],
  },
  {
    id: 9,
    question: "If a rep left tomorrow, how hard would it be to take over their leads?",
    options: [
      { letter: 'A', text: "Very hard — info is in their head or scattered", score: 1 },
      { letter: 'B', text: "Hard — would take days to piece together", score: 2 },
      { letter: 'C', text: "Manageable — documented but not standardized", score: 3 },
      { letter: 'D', text: "Easy — full history is logged and instantly readable", score: 5 },
    ],
  },
]

// ─── Health Report Data ─────────────────────────────────────────────────────
const REPORTS = {
  1: {
    level: 1,
    name: 'Starting From Zero',
    tagline: "Every day without a system is revenue you'll never get back.",
    emoji: '🚨',
    color: '#DC2626',
    bg: '#fef2f2',
    scoreRange: '0–20',
    description: "You're managing leads on memory, scattered notes, and hope. Leads are slipping away daily — and the painful part is you don't even know which ones or how many.",
    stats: ['Lead loss rate: 30–50% estimated', 'Follow-up within 24hrs: under 25%', 'Pipeline visibility: near zero'],
    impact: 'Companies at this stage typically close 8–12% of leads. With a basic system in place, that number jumps to 20–25% within 90 days — without buying a single new lead.',
    steps: [
      { title: 'Get your CRM set up this week', detail: 'Commit to using it fully. Every lead gets entered — name, phone, email, address. No exceptions.' },
      { title: 'Create one simple follow-up rule', detail: 'Call within 24 hours. Send estimate within 48 hours. Follow up twice if no response. Write it down.' },
      { title: 'Make data entry non-negotiable', detail: 'Every lead = full contact info logged. Build the habit before anything else.' },
      { title: 'Get your whole team aligned', detail: 'One meeting. Explain why the system matters. Make it clear this is how the business runs now.' },
    ],
    timeline: '60–90 days to reach Weekend Warrior',
    crmTip: {
      acculynx: 'AccuLynx has a mobile app — use it on every site visit and call. Get every lead into the system the moment it comes in.',
      jobnimbus: 'JobNimbus has a quick-add contact feature from mobile. Add leads in the field, before you forget. Set that habit first.',
    },
  },
  2: {
    level: 2,
    name: 'Out of Shape',
    tagline: "You have a CRM. It's just not working hard enough for you.",
    emoji: '🟠',
    color: '#EA580C',
    bg: '#fff7ed',
    scoreRange: '21–35',
    description: "You're using a CRM but the adoption is inconsistent. Some leads get tracked, others don't. The system exists — you're just not getting the return you should be.",
    stats: ['CRM adoption: partial', 'Follow-up cadence: random', 'Estimated close rate: 10–15%'],
    impact: 'Most companies at this stage could nearly double their close rate within 60 days just by enforcing a consistent process. No new tools. No new leads.',
    steps: [
      { title: 'Make CRM usage mandatory — no shortcuts', detail: 'Every call, every note, every update goes in the system. Manager reviews it daily.' },
      { title: 'Document your follow-up sequence', detail: 'HOT leads: 7 touches in 7 days. WARM: 5 touches in 14 days. COLD: weekly. Put it in writing and enforce it.' },
      { title: 'Turn on the automations you already have', detail: 'SMS reminders, email follow-ups, stage-change task triggers. You\'re probably already paying for these.' },
      { title: 'Connect CRM performance to compensation', detail: 'Show reps their numbers: leads worked, follow-ups completed, close rate. Make it their report card.' },
    ],
    timeline: '45–60 days to reach Weekend Warrior',
    crmTip: {
      acculynx: 'In AccuLynx, set up workflow automations that trigger follow-up tasks the moment a lead changes stage. Stop relying on memory.',
      jobnimbus: 'JobNimbus automation rules can fire texts and emails automatically when a job moves stages. These are already built — go turn them on.',
    },
  },
  3: {
    level: 3,
    name: 'Weekend Warrior',
    tagline: "You're functional. But inconsistency is costing you real jobs every month.",
    emoji: '⚡',
    color: '#D97706',
    bg: '#fffbeb',
    scoreRange: '36–50',
    description: "Your CRM works — most of the time. There's a follow-up process and the team mostly uses the system. But it's inconsistent. And that inconsistency is the difference between a good month and a great one.",
    stats: ['CRM adoption: moderate', 'Follow-up: varies by rep', 'Estimated close rate: 15–22%'],
    impact: 'Getting your process consistent — without touching your lead volume — typically recovers 20–30% more revenue from your existing pipeline within 90 days.',
    steps: [
      { title: 'Enforce a documented lead cadence for everyone', detail: 'HOT → 5 touches in 7 days. WARM → 4 touches in 14 days. COLD → weekly. Written. Non-negotiable.' },
      { title: 'Eliminate manual work with automation', detail: 'If your team is manually sending follow-up emails, the process will always break down. Automate the sequences.' },
      { title: 'Build a daily visible dashboard', detail: 'New leads, inspections booked, estimates sent, follow-ups overdue — visible to the whole team, every morning.' },
      { title: 'Review metrics every week', detail: 'Conversion rate, days-to-close, missed follow-ups by rep. Find the bottleneck. Fix it. Repeat.' },
    ],
    timeline: '60–90 days to reach In the Zone',
    crmTip: {
      acculynx: "AccuLynx's production board is your daily command center — customize the columns to show lead stage, last contact date, and days since last touch.",
      jobnimbus: "Use JobNimbus's board view to visualize your full pipeline. Filter by 'no activity in 7 days' and you'll immediately see where jobs are stalling.",
    },
  },
  4: {
    level: 4,
    name: 'In the Zone',
    tagline: "Solid system. Now it's time to optimize for maximum output.",
    emoji: '💪',
    color: '#2563EB',
    bg: '#eff6ff',
    scoreRange: '51–70',
    description: "Your CRM is working well. The team uses it, follow-up is mostly consistent, and you can see your key metrics. You're already outperforming most competitors. Now it's time to squeeze more out of what you've built.",
    stats: ['CRM adoption: high', 'Follow-up: mostly consistent', 'Estimated close rate: 22–30%'],
    impact: 'At this stage, targeted optimization — not more leads — adds 10–15% more closed revenue. The ceiling is still well above where you are now.',
    steps: [
      { title: 'Add lead scoring and automatic prioritization', detail: 'Score leads by engagement, job size, and behavior. Let the system surface the best opportunities automatically.' },
      { title: 'Build segment-specific follow-up sequences', detail: 'Insurance claims, retail, and commercial all need different workflows. One-size-fits-all is leaving conversions behind.' },
      { title: 'Automate your weekly reporting', detail: 'Conversion by source, by rep, by job type. The goal is zero manual report-building — only reviewing and deciding.' },
      { title: 'Integrate your full tech stack', detail: 'Connect CRM to SMS, email, scheduling, and accounting. Every manual handoff eliminated is time reclaimed.' },
    ],
    timeline: '90+ days to reach Elite Operator',
    crmTip: {
      acculynx: "AccuLynx integrates with EagleView, GAF, and QuickBooks — if you're not using these connections, you're doing manual work that doesn't need to exist.",
      jobnimbus: "JobNimbus's Zapier integration can connect to 5,000+ tools. Build the automations that eliminate your biggest time sinks.",
    },
  },
  5: {
    level: 5,
    name: 'Elite Operator',
    tagline: "Your CRM is a competitive weapon. You're winning on process.",
    emoji: '🏆',
    color: '#059669',
    bg: '#ecfdf5',
    scoreRange: '71–100',
    description: "You've built a system that runs without you. Every lead is tracked, every follow-up is automated, every metric is visible. You're converting at 2–3x the industry average and closing faster than your competition.",
    stats: ['CRM adoption: full team', 'Follow-up: automated & consistent', 'Estimated close rate: 30–40%+'],
    impact: 'Your CRM generates 20–30% more revenue than competitors running the same lead volume on manual processes. The gap widens every year.',
    steps: [
      { title: 'Optimize for revenue quality, not just volume', detail: 'Analyze lead sources by ROI. Double down on winners. Cut or reprice what underperforms.' },
      { title: 'Implement predictive pipeline analytics', detail: 'Use historical close data to forecast monthly revenue with accuracy. Stop guessing.' },
      { title: 'Build a new-rep onboarding system', detail: 'New hires should be fully productive in 2 weeks, not 2 months. Your system should do the training.' },
      { title: 'Document everything and scale with confidence', detail: 'Your process is a competitive moat. Treat it like one. Protect it. Refine it. Scale it.' },
    ],
    timeline: 'Maintain. Scale. Dominate.',
    crmTip: {
      acculynx: "At this level, explore AccuLynx's advanced reporting, custom field configurations, and API access to build truly custom workflows.",
      jobnimbus: "You're ready for JobNimbus's enterprise features — custom APIs, advanced reporting exports, and deep integrations that give you a real structural edge.",
    },
  },
}

// ─── Score Utilities ────────────────────────────────────────────────────────
function calcScore(answers) {
  const vals = Object.values(answers)
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length / 5) * 100)
}

function getLevel(score) {
  if (score >= 71) return 5
  if (score >= 51) return 4
  if (score >= 36) return 3
  if (score >= 21) return 2
  return 1
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function LeadMagnet({ onBack }) {
  const [view, setView]       = useState('hero')   // hero | form | quiz | results
  const [contact, setContact] = useState({ name: '', email: '', phone: '', company: '' })
  const [crm, setCrm]         = useState('')
  const [answers, setAnswers] = useState({})
  const [currentQ, setCurrent] = useState(0)
  const [error, setError]     = useState('')
  const [selected, setSelected] = useState(null)   // brief highlight on selection

  const score  = calcScore(answers)
  const report = REPORTS[getLevel(score)]
  const crmName = crm === 'acculynx' ? 'AccuLynx' : 'JobNimbus'

  // ── Form → Quiz ────────────────────────────────────────────────────────────
  const handleFormNext = () => {
    const { name, email, phone, company } = contact
    if (!name.trim() || !email.trim() || !phone.trim() || !company.trim()) {
      setError('Please fill in all fields.'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.'); return
    }
    if (!crm) { setError('Please select which CRM you use.'); return }
    setError('')
    setView('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Quiz answer selection (auto-advance) ───────────────────────────────────
  const handleAnswer = (answerScore) => {
    setSelected(answerScore)
    setTimeout(() => {
      const qId = QUESTIONS[currentQ].id
      const newAnswers = { ...answers, [qId]: answerScore }
      setAnswers(newAnswers)
      setSelected(null)
      if (currentQ < QUESTIONS.length - 1) {
        setCurrent(q => q + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // Save lead to Supabase (fire-and-forget)
        supabase.from('crm_health_leads').insert([{
          name: contact.name, email: contact.email,
          phone: contact.phone, company: contact.company,
          crm, score: calcScore(newAnswers),
          level: getLevel(calcScore(newAnswers)),
          answers: newAnswers,
        }]).then(() => {})
        setView('results')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 220)
  }

  const restart = () => {
    setView('hero'); setContact({ name: '', email: '', phone: '', company: '' })
    setCrm(''); setAnswers({}); setCurrent(0); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HERO
  // ══════════════════════════════════════════════════════════════════════════
  if (view === 'hero') return (
    <div className="lm-page lm-page-white">

      {/* ── TOP NAV ── */}
      <div className="lm-topnav-white">
        <button className="lm-back-link-dark" onClick={onBack}>← RoofSmartr</button>
        <div className="lm-nav-free-badge">Free Assessment</div>
      </div>

      {/* ── HERO ── */}
      <section className="lm-hero-white">
        <div className="lm-hero-white-inner">

          {/* Social proof */}
          <div className="lm-social-proof">
            <div className="lm-proof-dots">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="lm-proof-dot" style={{ background: ['#2DD4BF','#071B4A','#2DD4BF','#B7D94D','#071B4A'][i] }} />
              ))}
            </div>
            <span>Requested by <strong>500+ roofing company owners</strong></span>
          </div>

          {/* Headline */}
          <h1 className="lm-hero-white-h1">
            Get Your Free Personalized<br/>
            <span className="lm-h1-product">CRM Health Report™</span>
          </h1>
          <p className="lm-hero-white-sub">
            Built for AccuLynx &amp; JobNimbus roofing companies.
            Ready in under 3 minutes.
          </p>

          {/* ── PRODUCT MOCKUP ── */}
          <div className="lm-mockup-scene">
            <div className="lm-mockup-shadow" />
            <div className="lm-mockup-card">
              {/* Card header */}
              <div className="lm-mock-header">
                <div className="lm-mock-logo">RS</div>
                <div>
                  <div className="lm-mock-title">CRM Health Report™</div>
                  <div className="lm-mock-sub">RoofSmartr · Personalized Assessment</div>
                </div>
                <div className="lm-mock-crm-badge">AccuLynx</div>
              </div>

              {/* Score row */}
              <div className="lm-mock-score-row">
                <div className="lm-mock-score-circle">
                  <span className="lm-mock-score-num">78</span>
                  <span className="lm-mock-score-den">/100</span>
                </div>
                <div className="lm-mock-score-right">
                  <div className="lm-mock-level-badge">💪 In the Zone</div>
                  <div className="lm-mock-score-bar-wrap">
                    <div className="lm-mock-score-bar" style={{ width: '78%' }} />
                  </div>
                  <div className="lm-mock-score-label">Overall CRM Health Score</div>
                </div>
              </div>

              {/* Metric rows */}
              <div className="lm-mock-metrics">
                {[
                  { label: 'Lead Capture',        pct: 85, tag: 'Strong'  },
                  { label: 'Follow-Up Cadence',   pct: 60, tag: 'Fair'    },
                  { label: 'Pipeline Visibility', pct: 80, tag: 'Good'    },
                  { label: 'Team Adoption',       pct: 70, tag: 'Good'    },
                ].map(m => (
                  <div key={m.label} className="lm-mock-metric-row">
                    <span className="lm-mock-metric-label">{m.label}</span>
                    <div className="lm-mock-metric-bar-wrap">
                      <div className="lm-mock-metric-bar" style={{ width: `${m.pct}%` }} />
                    </div>
                    <span className="lm-mock-metric-tag">{m.tag}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="lm-mock-footer">
                <span>4 personalized action items included</span>
                <span className="lm-mock-footer-arrow">↓</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="lm-cta-btn lm-cta-large" onClick={() => setView('form')}>
            Get My Free CRM Health Report →
          </button>
          <p className="lm-hero-fine-dark">$0.00 &nbsp;·&nbsp; Takes 3 minutes &nbsp;·&nbsp; No sales call required</p>

        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="lm-inside-section">
        <div className="container">
          <p className="lm-inside-eyebrow">What's inside your report</p>
          <div className="lm-inside-grid">
            {[
              { num: '01', title: 'Your CRM Health Score',     desc: 'A 0–100 score showing where your pipeline management stands today — and what it\'s costing you.' },
              { num: '02', title: 'Revenue Leak Breakdown',    desc: 'The specific stages where leads are falling out of your process, with estimated dollar impact.' },
              { num: '03', title: 'Personalized Action Plan',  desc: '4 prioritized next steps built specifically for your CRM — AccuLynx or JobNimbus.' },
              { num: '04', title: 'CRM-Specific Playbook',     desc: 'Exact features and settings in your platform you should be using to fix each identified gap.' },
            ].map(w => (
              <div key={w.num} className="lm-inside-card">
                <div className="lm-inside-num">{w.num}</div>
                <h3 className="lm-inside-title">{w.title}</h3>
                <p className="lm-inside-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="lm-bottom-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="lm-bottom-cta-h2">Find out where you stand.<br/>Free. Right now.</h2>
          <p className="lm-bottom-cta-sub">3 minutes. 10 questions. A custom report built for your CRM.</p>
          <button className="lm-cta-btn" onClick={() => setView('form')}>
            Start My Free Assessment →
          </button>
        </div>
      </section>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // FORM
  // ══════════════════════════════════════════════════════════════════════════
  if (view === 'form') return (
    <div className="lm-page lm-light-bg">
      <div className="lm-topnav">
        <button className="lm-back-link" onClick={onBack}>← Back to RoofSmartr</button>
      </div>
      <div className="lm-form-outer">
        <div className="lm-form-card">
          <div className="lm-form-top">
            <div className="lm-step-pill">Step 1 of 2 — About You</div>
            <h2 className="lm-form-title">Who should we send your report to?</h2>
            <p className="lm-form-sub">We'll personalize the results for your exact CRM setup.</p>
          </div>

          <div className="lm-input-grid">
            {[
              { field: 'name',    label: 'Your Name',      placeholder: 'John Smith',              type: 'text' },
              { field: 'company', label: 'Company Name',   placeholder: 'Smith Roofing LLC',       type: 'text' },
              { field: 'email',   label: 'Email Address',  placeholder: 'john@smithroofing.com',   type: 'email' },
              { field: 'phone',   label: 'Phone Number',   placeholder: '(555) 000-0000',          type: 'tel' },
            ].map(f => (
              <div key={f.field} className="lm-field">
                <label className="lm-label">{f.label}</label>
                <input
                  className="lm-input"
                  type={f.type}
                  placeholder={f.placeholder}
                  value={contact[f.field]}
                  onChange={e => { setError(''); setContact({ ...contact, [f.field]: e.target.value }) }}
                />
              </div>
            ))}
          </div>

          <div className="lm-crm-section">
            <label className="lm-label">Which CRM do you currently use?</label>
            <div className="lm-crm-cards">
              {[
                { id: 'acculynx',  name: 'AccuLynx',   desc: 'Roofing-specific CRM & project management',   color: '#1d4ed8' },
                { id: 'jobnimbus', name: 'JobNimbus',   desc: 'Sales & production tracking platform',        color: '#ea580c' },
              ].map(c => (
                <button
                  key={c.id}
                  className={`lm-crm-card${crm === c.id ? ' lm-crm-selected' : ''}`}
                  onClick={() => { setError(''); setCrm(c.id) }}
                  style={crm === c.id ? { borderColor: c.color, background: `${c.color}12` } : {}}
                >
                  {crm === c.id && <span className="lm-crm-check" style={{ color: c.color }}>✓</span>}
                  <div className="lm-crm-name" style={crm === c.id ? { color: c.color } : {}}>{c.name}</div>
                  <div className="lm-crm-desc">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="lm-error">{error}</div>}

          <button className="lm-cta-btn lm-full-width" onClick={handleFormNext}>
            Start My Assessment →
          </button>
          <p className="lm-form-fine">🔒 Your information is private and never sold or spammed.</p>
        </div>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ
  // ══════════════════════════════════════════════════════════════════════════
  if (view === 'quiz') {
    const q   = QUESTIONS[currentQ]
    const pct = Math.round((currentQ / QUESTIONS.length) * 100)
    return (
      <div className="lm-page lm-light-bg">
        <div className="lm-quiz-topnav">
          <button className="lm-back-link"
            onClick={() => { setSelected(null); currentQ === 0 ? setView('form') : setCurrent(n => n - 1) }}>
            ← Back
          </button>
          <span className="lm-q-counter">Question {currentQ + 1} of {QUESTIONS.length}</span>
        </div>

        <div className="lm-progress-wrap">
          <div className="lm-progress-track">
            <div className="lm-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="lm-quiz-outer">
          <div className="lm-quiz-card">
            <div className="lm-q-step">Question {currentQ + 1}</div>
            <h2 className="lm-q-text">{q.question}</h2>
            <div className="lm-answers">
              {q.options.map(opt => (
                <button
                  key={opt.letter}
                  className={`lm-answer-card${selected === opt.score ? ' lm-answer-selected' : ''}`}
                  onClick={() => handleAnswer(opt.score)}
                >
                  <span className="lm-answer-letter">{opt.letter}</span>
                  <span className="lm-answer-text">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ══════════════════════════════════════════════════════════════════════════
  if (view === 'results') {
    const tip = report.crmTip[crm] || ''
    return (
      <div className="lm-page lm-light-bg">
        <div className="lm-topnav">
          <button className="lm-back-link" onClick={onBack}>← Back to RoofSmartr</button>
        </div>

        <div className="lm-results-outer">

          {/* Score header */}
          <div className="lm-results-header" style={{ borderTopColor: report.color }}>
            <div className="lm-score-circle" style={{ background: report.color }}>
              <span className="lm-score-num">{score}</span>
              <span className="lm-score-denom">/100</span>
            </div>
            <div className="lm-results-title-wrap">
              <div className="lm-results-level" style={{ color: report.color }}>
                {report.emoji}&nbsp; {report.name}
              </div>
              <h1 className="lm-results-tagline">{report.tagline}</h1>
              <p className="lm-results-desc">{report.description}</p>
            </div>
          </div>

          {/* CRM-specific callout */}
          {tip && (
            <div className="lm-crm-tip" style={{ borderLeftColor: report.color }}>
              <strong>{crmName} Insight:</strong> {tip}
            </div>
          )}

          {/* Key stats */}
          <div className="lm-report-stats">
            {report.stats.map((s, i) => (
              <div key={i} className="lm-report-stat" style={{ borderTopColor: report.color }}>
                {s}
              </div>
            ))}
          </div>

          {/* Business impact */}
          <div className="lm-impact-box" style={{ background: report.bg, borderColor: report.color }}>
            <div className="lm-impact-label">The Business Impact</div>
            <p className="lm-impact-text">{report.impact}</p>
          </div>

          {/* Action plan */}
          <div className="lm-steps-section">
            <h3 className="lm-steps-title">Your Personalized Action Plan</h3>
            <p className="lm-steps-sub">Built for {crmName} users at the {report.name} stage.</p>
            <div className="lm-steps-list">
              {report.steps.map((step, i) => (
                <div key={i} className="lm-step">
                  <div className="lm-step-num" style={{ background: report.color }}>{i + 1}</div>
                  <div className="lm-step-body">
                    <div className="lm-step-title">{step.title}</div>
                    <div className="lm-step-detail">{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="lm-timeline-box">
            <strong>Path Forward:&nbsp;</strong>{report.timeline}
          </div>

          {/* CTA */}
          <div className="lm-results-cta">
            <h3 className="lm-results-cta-h3">Want help actually implementing this?</h3>
            <p className="lm-results-cta-p">
              RoofSmartr builds and runs your back office inside {crmName} — so you
              don't have to figure it out yourself.
            </p>
            <button className="lm-cta-btn" onClick={onBack}>
              See How RoofSmartr Works →
            </button>
            <button className="lm-retake-btn" onClick={restart}>
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
