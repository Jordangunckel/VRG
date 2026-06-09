// ───────────────────────────────────────────────────────────────────────────
// RoofSmartr SOP Builder — master configuration
// Single source of truth. The app renders itself from this file.
// Add or edit a service / automation / message here and the hub updates.
// ───────────────────────────────────────────────────────────────────────────

import { VOICE_COPY } from './voicesCopy.js'

export const BRAND_VOICES = [
  { id: 'straight-shooter',  name: 'The Straight Shooter',  blurb: 'Short, direct, sounds like the owner texted it from his truck.' },
  { id: 'friendly-neighbor', name: 'The Friendly Neighbor', blurb: 'Warm and personable. A neighbor who happens to do roofs.' },
  { id: 'buttoned-up',       name: 'The Buttoned-Up',       blurb: 'Polished and professional. Never a "hey," never an exclamation point.' },
]

export const CRMS = [
  { id: 'acculynx',  name: 'AccuLynx',  engine: 'Trigger → Action (one action per automation)' },
  { id: 'jobnimbus', name: 'JobNimbus', engine: 'When / If / Then (multiple actions per automation)' },
]

// Built-in user roles per CRM (the role a team member holds in their system)
export const CRM_ROLES = {
  jobnimbus: ['Admin', 'Admin + Billing', 'Office (Full Access)', 'Sales (Limited Access)', 'Production', 'Subcontractor'],
  acculynx:  ['Admin', 'Manager', 'Office Staff', 'Sales Rep', 'Field Worker / Crew', 'Subcontractor'],
}
export function rolesForCrm(crm) { return CRM_ROLES[crm] || [] }

export const STAGES = ['Leads', 'Presale', 'Production', 'Post Sale']

// ── The 10 services (final names locked 2026-06-06) ─────────────────────────
export const SERVICES = [
  {
    id: 'lead-nurture', number: 1, name: 'Lead Nurture System', stage: 'Leads', perStatus: true,
    summary: 'Keep every new lead moving until they book an inspection or tell you no. Each lead status runs its own sequence — set them up one at a time.',
    groups: [
      {
        status: 'Hot Leads',
        goal: 'Get the inspection scheduled before the lead cools off.',
        recommended: 'Daily — alternating call and message across 7 days.',
        automations: [
          { id: 'hot-entry', kind: 'call',    timing: { unit: 'entry' }, task: 'Call the new lead right away' },
          { id: 'hot-day1',  kind: 'message', channel: 'text',  timing: { unit: 'day', n: 1 }, messageKey: 'hot-day1' },
          { id: 'hot-day2',  kind: 'call',    timing: { unit: 'day', n: 2 } },
          { id: 'hot-day3',  kind: 'message', channel: 'email', timing: { unit: 'day', n: 3 }, messageKey: 'hot-day3' },
          { id: 'hot-day4',  kind: 'call',    timing: { unit: 'day', n: 4 } },
          { id: 'hot-day5',  kind: 'message', channel: 'text',  timing: { unit: 'day', n: 5 }, messageKey: 'hot-day5' },
          { id: 'hot-day6',  kind: 'call',    timing: { unit: 'day', n: 6 } },
          { id: 'hot-day7',  kind: 'message', channel: 'email', timing: { unit: 'day', n: 7 }, messageKey: 'hot-day7' },
          { id: 'hot-exit',  kind: 'exit',    timing: { unit: 'day', n: 7 }, exitTo: 'Warm Leads', exitType: 'auto', note: 'no response' },
        ],
      },
      {
        status: 'Warm Leads',
        goal: 'Keep the conversation going until they’re ready to schedule.',
        recommended: 'Daily for 4 days, then it cools to Cold Leads.',
        automations: [
          { id: 'warm-day1', kind: 'message', channel: 'text',  timing: { unit: 'day', n: 1 }, messageKey: 'warm-day1' },
          { id: 'warm-day2', kind: 'call',    timing: { unit: 'day', n: 2 } },
          { id: 'warm-day3', kind: 'message', channel: 'email', timing: { unit: 'day', n: 3 }, messageKey: 'warm-day3' },
          { id: 'warm-day4', kind: 'call',    timing: { unit: 'day', n: 4 } },
          { id: 'warm-exit', kind: 'exit',    timing: { unit: 'day', n: 4 }, exitTo: 'Cold Leads', exitType: 'auto', note: 'no response' },
        ],
      },
      {
        status: 'Cold Leads',
        goal: 'Stay top of mind until they’re ready, or confirm they’re not moving forward.',
        recommended: 'Weekly for about 7 weeks.',
        automations: [
          { id: 'cold-wk1',  kind: 'call',    timing: { unit: 'week', n: 1 } },
          { id: 'cold-wk2',  kind: 'message', channel: 'email', timing: { unit: 'week', n: 2 }, messageKey: 'cold-wk2' },
          { id: 'cold-wk4',  kind: 'message', channel: 'email', timing: { unit: 'week', n: 4 }, messageKey: 'cold-wk4' },
          { id: 'cold-exit', kind: 'exit',    timing: { unit: 'week', n: 7 }, exitTo: 'Lost Customer Campaign', exitType: 'auto', note: 'no response' },
        ],
      },
      {
        status: 'Initial Appointments',
        goal: 'Confirm the appointment and route the file after the inspection.',
        recommended: 'A reminder the day before, then your team routes it after the visit.',
        automations: [
          { id: 'initial-reminder', kind: 'message', channel: 'text', timing: { unit: 'beforeAppt', n: 1 }, messageKey: 'initial-appt-reminder' },
          { id: 'initial-exit',     kind: 'exit',    timing: { unit: 'apptDate' }, exitTo: 'Need Adjuster Appt or Inspected, Unsigned', exitType: 'manual', note: 'after the appointment', clientOnly: true },
        ],
      },
      {
        status: 'Inspected, Unsigned',
        goal: 'Get the agreement signed before the file goes cold.',
        recommended: 'Weekly for about 7 weeks.',
        automations: [
          { id: 'uns-wk1',  kind: 'call',    timing: { unit: 'week', n: 1 } },
          { id: 'uns-wk2',  kind: 'message', channel: 'email', timing: { unit: 'week', n: 2 }, messageKey: 'unsigned-wk2' },
          { id: 'uns-wk3',  kind: 'message', channel: 'text',  timing: { unit: 'week', n: 3 }, messageKey: 'unsigned-wk3' },
          { id: 'uns-wk5',  kind: 'message', channel: 'email', timing: { unit: 'week', n: 5 }, messageKey: 'unsigned-wk5' },
          { id: 'uns-wk6',  kind: 'message', channel: 'text',  timing: { unit: 'week', n: 6 }, messageKey: 'unsigned-wk6' },
          { id: 'uns-exit', kind: 'exit',    timing: { unit: 'week', n: 7 }, exitTo: 'Lost Customer Campaign', exitType: 'auto', note: 'no response' },
        ],
      },
    ],
  },

  {
    id: 'adjuster-coordination', number: 2, name: 'Adjuster Coordination', stage: 'Presale',
    summary: 'Get the adjuster appointment set and confirmed without the back-and-forth.',
    groups: [
      {
        status: 'Need Adjuster Appointment', goal: 'Get the adjuster appointment locked on the calendar.',
        automations: [
          { id: 'naa-entry', kind: 'task', timing: { unit: 'entry' }, task: 'Begin adjuster coordination — contact homeowner + carrier for a date' },
          { id: 'naa-day2', kind: 'message', channel: 'text', timing: { unit: 'day', n: 2 }, messageKey: 'naa-day2' },
          { id: 'naa-day4', kind: 'task', timing: { unit: 'day', n: 4 }, task: 'Call the carrier for an appointment date' },
          { id: 'naa-day6', kind: 'message', channel: 'text', timing: { unit: 'day', n: 6 }, messageKey: 'naa-day6' },
          { id: 'naa-day8', kind: 'task', timing: { unit: 'day', n: 8 }, task: 'Call homeowner + carrier, escalate' },
          { id: 'naa-exit', kind: 'exit', timing: { unit: 'day', n: 8 }, exitTo: 'Adjuster Appointments', exitType: 'auto', note: 'date secured' },
        ],
      },
      {
        status: 'Adjuster Appointments', goal: 'Be on the roof when the adjuster is.',
        automations: [
          { id: 'aa-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Confirm adjuster appointment details' },
          { id: 'aa-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Add prep notes — carrier, stories, access' },
          { id: 'aa-2before', kind: 'message', channel: 'text', timing: { unit: 'beforeAppt', n: 2 }, messageKey: 'adjuster-reminder' },
          { id: 'aa-1before-a', kind: 'task', timing: { unit: 'beforeAppt', n: 1 }, task: 'Narrow the adjuster arrival window' },
          { id: 'aa-1before-b', kind: 'task', timing: { unit: 'beforeAppt', n: 1 }, task: 'Assign a rep to attend the appointment' },
          { id: 'aa-exit', kind: 'exit', timing: { unit: 'apptDate' }, exitTo: 'Scope of Work', exitType: 'auto', note: 'appointment complete' },
        ],
      },
    ],
  },
  {
    id: 'claim-follow-up', number: 3, name: 'Claim Follow-up', stage: 'Presale',
    summary: 'Chase the scope and supplement until the revised estimate lands.',
    groups: [
      {
        status: 'Scope of Work', goal: 'Get the insurance estimate in hand.',
        automations: [
          { id: 'sow-entry', kind: 'task', timing: { unit: 'entry' }, task: 'Begin scope follow-up with the carrier' },
          { id: 'sow-day4', kind: 'task', timing: { unit: 'day', n: 4 }, task: 'Call the carrier on estimate status' },
          { id: 'sow-day7', kind: 'message', channel: 'text', timing: { unit: 'day', n: 7 }, messageKey: 'sow-day7' },
          { id: 'sow-day10', kind: 'task', timing: { unit: 'day', n: 10 }, task: 'Call the carrier again' },
          { id: 'sow-day14', kind: 'task', timing: { unit: 'day', n: 14 }, task: 'Escalate — estimate is two weeks out' },
          { id: 'sow-exit', kind: 'exit', timing: { unit: 'day', n: 14 }, exitTo: 'Re-Inspect, Supplement, or Build Order', exitType: 'manual', note: 'estimate received' },
        ],
      },
      {
        status: 'Re-Inspect', goal: 'Get a second adjuster look on a denied or shorted claim.',
        automations: [
          { id: 'ri-entry', kind: 'task', timing: { unit: 'entry' }, task: 'Request a reinspection with the carrier' },
          { id: 'ri-day3', kind: 'task', timing: { unit: 'day', n: 3 }, task: 'Follow up on the reinspection request' },
          { id: 'ri-day7', kind: 'task', timing: { unit: 'day', n: 7 }, task: 'Call the carrier, escalate the request' },
          { id: 'ri-exit', kind: 'exit', timing: { unit: 'day', n: 7 }, exitTo: 'Adjuster Appointments', exitType: 'auto', note: 'reinspection scheduled' },
        ],
      },
      {
        status: 'Supplement', goal: 'Chase the supplement until the revised estimate lands. We follow up, we don’t write them.',
        automations: [
          { id: 'sup-entry', kind: 'task', timing: { unit: 'entry' }, task: 'Confirm the supplement was submitted to the carrier' },
          { id: 'sup-wk1', kind: 'task', timing: { unit: 'week', n: 1 }, task: 'Call the carrier on supplement status' },
          { id: 'sup-wk2', kind: 'task', timing: { unit: 'week', n: 2 }, task: 'Follow up with the carrier' },
          { id: 'sup-wk3', kind: 'task', timing: { unit: 'week', n: 3 }, task: 'Escalate — supplement three weeks unanswered' },
          { id: 'sup-exit', kind: 'exit', timing: { unit: 'week', n: 3 }, exitTo: 'Build Order', exitType: 'auto', note: 'revised estimate received' },
        ],
      },
    ],
  },
  {
    id: 'pre-build-prep', number: 4, name: 'Pre-Build Prep', stage: 'Presale',
    summary: 'Order measurements, build the order, and flag jobs under your margin before they go out.',
    groups: [
      {
        status: 'Build Order', goal: 'Measurements pulled, the order built, the margin clear.',
        automations: [
          { id: 'bo-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Order measurements (EagleView / Hover)' },
          { id: 'bo-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Build the material + labor order draft' },
          { id: 'bo-day2', kind: 'task', timing: { unit: 'day', n: 2 }, task: 'Confirm measurements received, finalize the order' },
          { id: 'bo-exit', kind: 'exit', timing: { unit: 'day', n: 2 }, exitTo: 'Approved?', exitType: 'auto', note: 'build order complete' },
        ],
      },
      {
        status: 'Approved?', goal: 'Nothing enters production half-baked: profit checked, first check in, price signed.',
        automations: [
          { id: 'ap-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Run profit analysis vs. the margin target' },
          { id: 'ap-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Confirm the homeowner received the first check (ACV)' },
          { id: 'ap-entry3', kind: 'task', timing: { unit: 'entry' }, task: 'Get the signed agreement with the final price' },
          { id: 'ap-day3', kind: 'task', timing: { unit: 'day', n: 3 }, task: 'Chase any open green-flag item' },
          { id: 'ap-day7', kind: 'task', timing: { unit: 'day', n: 7 }, task: 'Escalate a stalled approval to the owner' },
          { id: 'ap-exit', kind: 'exit', timing: { unit: 'day', n: 7 }, exitTo: 'Pull Permits', exitType: 'auto', note: 'all green' },
          { id: 'ap-exit2', kind: 'exit', timing: { unit: 'day', n: 7 }, exitTo: 'Lost Customer Campaign', exitType: 'manual', note: 'falls through' },
        ],
      },
    ],
  },
  {
    id: 'build-prep', number: 5, name: 'Build Prep', stage: 'Production',
    summary: 'Material delivered, the home prepped, the first check collected before the crew shows up.',
    groups: [
      {
        status: 'Pre-Conditions', goal: 'Everything verified before the crew arrives. Protect the homeowner, protect the company.',
        automations: [
          { id: 'pc-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Collect the first check (if not already in hand)' },
          { id: 'pc-entry2', kind: 'message', channel: 'email', timing: { unit: 'entry' }, messageKey: 'preconditions-expect' },
          { id: 'pc-2before', kind: 'task', timing: { unit: 'beforeBuild', n: 2 }, task: 'Confirm material delivery is scheduled' },
          { id: 'pc-1before-a', kind: 'task', timing: { unit: 'beforeBuild', n: 1 }, task: 'Verify material dropped + house prepped' },
          { id: 'pc-1before-b', kind: 'task', timing: { unit: 'beforeBuild', n: 1 }, task: 'Upload pre-condition photos (legal documentation)' },
          { id: 'pc-exit', kind: 'exit', timing: { unit: 'beforeBuild', n: 1 }, exitTo: 'Job in Progress', exitType: 'auto', note: 'all verified' },
        ],
      },
    ],
  },
  {
    id: 'permits', number: 6, name: 'Permits', stage: 'Production',
    summary: 'Pull every permit, every jurisdiction, before install day.',
    groups: [
      {
        status: 'Pull Permits', goal: 'Permitted, paid, ready to schedule. No install-day surprises.',
        automations: [
          { id: 'pp-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Check jurisdiction requirements + submit the permit application' },
          { id: 'pp-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Pay the permit fees' },
          { id: 'pp-day5', kind: 'task', timing: { unit: 'day', n: 5 }, task: 'Follow up with the jurisdiction on permit status' },
          { id: 'pp-day10', kind: 'task', timing: { unit: 'day', n: 10 }, task: 'Call the jurisdiction, escalate to the owner if still pending' },
          { id: 'pp-exit', kind: 'exit', timing: { unit: 'day', n: 10 }, exitTo: 'Schedule Build', exitType: 'auto', note: 'permit in hand' },
        ],
      },
    ],
  },
  {
    id: 'coc-invoices', number: 7, name: 'C.O.C & Invoices', stage: 'Post Sale',
    summary: 'Send the Certificate of Completion and invoice the moment the crew rolls off.',
    groups: [
      {
        status: 'Closeout & Invoice', goal: 'Closeout docs and the invoice out the moment the crew rolls off. The CoC steps fire on insurance jobs only.',
        automations: [
          { id: 'coc-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Create the Certificate of Completion (insurance jobs)' },
          { id: 'coc-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Compile the depreciation release packet — CoC, final invoice, photos, permit docs (insurance jobs)' },
          { id: 'inv-entry', kind: 'task', timing: { unit: 'entry' }, task: 'Create + send the final invoice' },
          { id: 'inv-day1', kind: 'message', channel: 'email', timing: { unit: 'day', n: 1 }, messageKey: 'invoice-delivered' },
          { id: 'coc-day1', kind: 'task', timing: { unit: 'day', n: 1 }, task: 'Send the depreciation packet to the carrier (insurance jobs)' },
          { id: 'coc-day7', kind: 'task', timing: { unit: 'day', n: 7 }, task: 'Confirm the carrier received the packet; follow up on the release (insurance jobs)' },
          { id: 'close-exit', kind: 'exit', timing: { unit: 'day', n: 7 }, exitTo: 'Reviews & Referrals or Customer Service', exitType: 'manual', note: 'rep decides if they’re happy' },
        ],
      },
    ],
  },
  {
    id: 'payment-collection', number: 8, name: 'Payment Collection', stage: 'Post Sale',
    summary: 'Chase carrier and homeowner payments — politely, persistently — until the money lands.',
    groups: [
      {
        status: 'Accounts Receivable', goal: 'Collect the carrier depreciation and the homeowner balance.',
        automations: [
          { id: 'ar-entry', kind: 'task', timing: { unit: 'entry' }, task: 'Confirm the outstanding balance (carrier depreciation + homeowner portion)' },
          { id: 'ar-day7', kind: 'message', channel: 'email', timing: { unit: 'day', n: 7 }, messageKey: 'payment-reminder-1' },
          { id: 'ar-day14', kind: 'task', timing: { unit: 'day', n: 14 }, task: 'Call the homeowner and/or carrier on payment status' },
          { id: 'ar-day21', kind: 'message', channel: 'text', timing: { unit: 'day', n: 21 }, messageKey: 'payment-reminder-2' },
          { id: 'ar-exit', kind: 'exit', timing: { unit: 'day', n: 21 }, exitTo: 'Send Warranty', exitType: 'auto', note: 'paid in full' },
          { id: 'ar-exit2', kind: 'exit', timing: { unit: 'day', n: 30 }, exitTo: 'Debt Collection', exitType: 'auto', note: 'unpaid at day 30' },
        ],
      },
      {
        status: 'Debt Collection', goal: 'Recover the balance while protecting lien rights.',
        automations: [
          { id: 'dc-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Send the formal past-due notice' },
          { id: 'dc-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Check the mechanic’s lien deadline with the owner (state-specific, unforgiving)' },
          { id: 'dc-exit', kind: 'exit', timing: { unit: 'entry' }, exitTo: 'Send Warranty', exitType: 'manual', note: 'once collected' },
        ],
      },
    ],
  },
  {
    id: 'closing-documents', number: 9, name: 'Closing Documents', stage: 'Post Sale',
    summary: 'Register warranties, issue the workmanship warranty, send the closeout packet.',
    groups: [
      {
        status: 'Send Warranty', goal: 'Register the warranties and get the closeout packet out the door.',
        automations: [
          { id: 'sw-entry1', kind: 'task', timing: { unit: 'entry' }, task: 'Register the manufacturer warranty' },
          { id: 'sw-entry2', kind: 'task', timing: { unit: 'entry' }, task: 'Issue the workmanship warranty in writing' },
          { id: 'sw-entry3', kind: 'message', channel: 'email', timing: { unit: 'entry' }, messageKey: 'warranty-cover' },
          { id: 'sw-exit', kind: 'exit', timing: { unit: 'entry' }, exitTo: 'Past Customer Campaign', exitType: 'auto', note: 'closeout sent' },
        ],
      },
    ],
  },
  {
    id: 'reputation-referrals', number: 10, name: 'Reputation & Referrals', stage: 'Post Sale',
    summary: 'Ask for the review while the job’s fresh and the referral while neighbors are noticing. Thank-you gifts included.',
    groups: [
      {
        status: 'Reviews & Referrals', goal: 'Ask while the install is fresh and the neighbors are still noticing.',
        automations: [
          { id: 'rr-entry', kind: 'message', channel: 'text', timing: { unit: 'entry' }, messageKey: 'review-request' },
          { id: 'rr-day3', kind: 'message', channel: 'email', timing: { unit: 'day', n: 3 }, messageKey: 'review-reminder' },
          { id: 'rr-day7', kind: 'task', timing: { unit: 'day', n: 7 }, task: 'Call to ask for referrals (“any neighbors thinking about their roof?”)' },
          { id: 'rr-gift', kind: 'task', timing: { unit: 'day', n: 7 }, task: 'Send the thank-you gift' },
          { id: 'rr-exit', kind: 'exit', timing: { unit: 'day', n: 7 }, exitTo: 'Accounts Receivable', exitType: 'auto', note: 'asks sent' },
        ],
      },
    ],
  },
]

// ── Copy library, keyed by voice → message ─────────────────────────────
// Straight Shooter is wired now; the other two voices load during rollout.
export const COPY = {
  'straight-shooter': {
    'hot-day1': { body: `[First Name], it's [Rep First Name] with [Company Name]. Got your request. I can come out this week and take a look, no charge. What day works? (Reply STOP to opt out)` },
    'hot-day3': { subject: `Free 20-minute inspection: what day works?`, body: `Hi [First Name],
Still want to get eyes on your project. A 20-minute look tells you if there's real damage or nothing to worry about.
If nothing's wrong, I'll tell you that too. Either way, you keep the photos.
What's a good day this week?
[Rep First Name]
[Company Name] · [Phone]` },
    'hot-day5': { body: `[First Name], [Rep First Name] again. The schedule's filling up this week. Want me to hold a spot for your inspection?` },
    'hot-day7': { subject: `Last one from me (for now)`, body: `Hi [First Name],
I've reached out a few times about your project and I don't want to be a pest. If the timing's wrong, no problem. I'll check back down the road.
If you want that inspection (still on us), it takes one call: [Phone].
[Rep First Name]` },
    'warm-day1': { body: `Hey [First Name], [Rep First Name] with [Company Name]. Still happy to take a look at your project whenever you're ready. No charge, no pressure. Want me on the schedule for you? (Reply STOP to opt out)` },
    'warm-day3': { subject: `A 20-minute look beats a wet ceiling`, body: `Hi [First Name],
No rush from my end. Most people find out about damage when a stain shows up on the ceiling, and by then the fix costs a lot more.
An inspection now won't cost you a dime. If we find nothing, you get photos proving your home's in good shape. Handy to have when you sell.
I'm around all week.
[Rep First Name] · [Phone]` },
    'cold-wk2': { subject: `Two signs worth a quick glance`, body: `Hi [First Name],
We're still around when you need us. After any big wind, two things are worth a glance: shingles in the yard, and a new stain on a ceiling inside. Either one shows up, that's your cue to call.
Until then, no pressure.
[Rep First Name] · [Company Name] · [Phone]` },
    'cold-wk4': { subject: `That inspection's still on the table`, body: `Hi [First Name],
The no-cost inspection doesn't expire. Twenty minutes, photos of anything we find, straight answers about whether it needs attention now or can wait.
If a storm's rolled through since we last talked, it's worth the look.
[Rep First Name] · [Phone]` },
    'initial-appt-reminder': { body: `Reminder: [Rep First Name] from [Company Name] comes by tomorrow at [Appointment Time] for your inspection. You don't need to do anything. But grab us for 10 minutes after and we'll show you what we found, photos included.` },
    'unsigned-wk2': { subject: `What we found at your place`, body: `Hi [First Name],
The photos from your inspection are on file, and the damage we documented doesn't fix itself. Happy to walk through them with you again: what we found, what your out-of-pocket typically looks like, and what happens next.
Fifteen minutes, your kitchen table or the phone. Your call.
[Rep First Name] · [Phone]` },
    'unsigned-wk3': { body: `[First Name], it's [Rep First Name]. Your inspection photos are still on file. Want me to walk you through what they showed and what your options are? Ten minutes.` },
    'unsigned-wk5': { subject: `Your inspection is still good`, body: `Hi [First Name],
Nothing up there has gotten better on its own. The documentation we built is still good, and so is the path: we handle the legwork so it's easy on your end.
Want to pick it back up?
[Rep First Name] · [Phone]` },
    'unsigned-wk6': { body: `[First Name], storm season won't wait, and claim windows don't either. Worth a 10-minute talk this week? — [Rep First Name]` },
    'naa-day2': { body: `Hi [First Name], [Rep First Name] here. Has your insurance called to set the adjuster visit yet? If they gave you a date, send it over and we'll be there.` },
    'naa-day6': { body: `[First Name], still nothing from insurance on the adjuster date? Happy to get them on the phone with you. Sometimes that's all it takes to speed them up. — [Rep First Name]` },
    'adjuster-reminder': { body: `Heads up: your insurance adjuster comes [Appointment Date]. [Rep First Name] will be on site with them, making sure nothing gets missed. You don't need to do a thing.` },
    'sow-day7': { body: `[First Name], quick check: did your insurance estimate land in your mail or email yet? They sometimes send it to you before they send it to us. — [Rep First Name]` },
    'preconditions-expect': { subject: `Your build day: what to expect`, body: `Hi [First Name],
Build day's coming. Five minutes of prep saves headaches:
Cars out of the driveway the night before. Material drops there, and the crew needs the access.
Pictures and anything fragile off the walls. Hammering shakes the whole house, and that's normal.
Pets inside, kids away from the work zones. Nails fall before we sweep.
Mark anything in the yard you're worried about: flower beds, koi pond, the gnome.
We drop material the day before and the crew starts around 7am the next morning. You don't need to be home. We run magnets through the yard for stray nails before we leave.
Anything at all: [Rep First Name], [Phone].` },
    'invoice-delivered': { subject: `Your invoice + easy ways to pay`, body: `Hi [First Name],
Invoice [Invoice #] is attached. Pay online at [Payment Link], or a check works fine too.
If any line item doesn't make sense, call me before you sit and wonder about it. Thirty seconds and I'll explain it.
Thanks for trusting us with your project.
[Rep First Name] · [Phone]` },
    'payment-reminder-1': { subject: `Friendly reminder: invoice [Invoice #]`, body: `Hi [First Name],
Quick reminder that invoice [Invoice #] ([Amount]) is open. Pay online anytime: [Payment Link]
If it's already on the way, ignore this. If something's holding it up, call me. It's easier to fix now than later.
[Rep First Name] · [Phone]` },
    'payment-reminder-2': { body: `[First Name], [Rep First Name] here. The balance on your project ([Amount]) is still open. Anything holding it up? Call me and we'll sort it: [Phone]` },
    'warranty-cover': { subject: `Your project is covered: warranty enclosed`, body: `Hi [First Name],
Everything that protects the work we did is in this packet: your manufacturer warranty (already registered, nothing for you to do) and our workmanship warranty, in writing.
Keep it with your house documents. If you ever sell, the warranty transfers. Buyers love that.
It was a pleasure. You know where to find us.
[Rep First Name] · [Company Name] · [Phone]` },
    'review-request': { body: `[First Name], thanks for trusting us with your project. If we earned it, a quick review goes a long way: [Review Link] (60 seconds). — [Rep First Name]` },
    'review-reminder': { subject: `60 seconds, big favor`, body: `Hi [First Name],
Most of our work comes from neighbors reading about other neighbors. If you've got 60 seconds, a review helps more than any ad we could buy: [Review Link]
And if you know anyone whose home took the same storm yours did, I'd be grateful for the introduction.
[Rep First Name]` },
  },
}

// Merge in the Friendly Neighbor + Buttoned-Up libraries
Object.assign(COPY, VOICE_COPY)

// ── Helpers ─────────────────────────────────────────────────────────────────
export function getCopy(voiceId, messageKey) {
  const lib = COPY[voiceId] || COPY['straight-shooter']
  return lib[messageKey] || COPY['straight-shooter'][messageKey] || { body: '' }
}

export function timingLabel(timing) {
  if (!timing) return ''
  switch (timing.unit) {
    case 'entry':       return 'On entry'
    case 'day':         return `Day ${timing.n}`
    case 'week':        return `Week ${timing.n}`
    case 'beforeAppt':  return `${timing.n} day before`
    case 'beforeBuild': return `${timing.n} day before build`
    case 'apptDate':    return 'On appointment date'
    default:           return ''
  }
}

// Render an automation in the language of the chosen CRM. mapFn maps status names
// to the client's own labels.
export function renderAutomation(auto, status, crmId, mapFn = (x) => x) {
  const t = auto.timing
  const isJN = crmId === 'jobnimbus'
  const S = mapFn(status)

  // Build the trigger phrase
  let trigger
  if (t.unit === 'entry') {
    trigger = isJN ? `Status changes to "${S}"` : `Job enters "${S}"`
  } else if (t.unit === 'day' || t.unit === 'week') {
    const span = `${t.n} ${t.unit === 'day' ? (t.n === 1 ? 'day' : 'days') : (t.n === 1 ? 'week' : 'weeks')}`
    trigger = isJN ? `Job in "${S}" for ${span}` : `${span} in "${S}"`
  } else if (t.unit === 'beforeAppt') {
    trigger = `${t.n} day before the appointment date`
  } else if (t.unit === 'beforeBuild') {
    trigger = `${t.n} day before the build date`
  } else if (t.unit === 'apptDate') {
    trigger = 'On the appointment date'
  }
  if (auto.note && auto.kind === 'exit') trigger += `, ${auto.note}`

  // Build the action phrase
  let action
  if (auto.kind === 'call' || auto.kind === 'task') {
    action = 'Create task: ' + (auto.task || 'Call the lead')
  } else if (auto.kind === 'message') {
    const verb = auto.channel === 'text' ? 'Send text' : 'Send email'
    action = isJN && auto.channel === 'text' ? 'Send text (needs Engage — installs as email without it)' : verb
  } else if (auto.kind === 'exit') {
    const ex = mapFn(auto.exitTo)
    if (auto.exitType === 'auto') {
      action = isJN
        ? `Change status → ${ex}`
        : `Create task: Change status to ${ex}`
    } else {
      action = `Team routes the file → ${ex}`
    }
  }

  return { trigger, action, format: isJN ? 'whenthen' : 'trigaction' }
}

// ── Pipeline statuses by stage (the auto-trigger dropdown) ──────────────────
// Canonical RoofSmartr pipeline statuses (the steps our automations route through).
// The client maps each to their own CRM label in the Company Profile; we display theirs.
export const STATUSES = {
  'Leads':      ['Hot Leads', 'Warm Leads', 'Cold Leads', 'Initial Appointments', 'Inspected, Unsigned', 'Lost Customer Campaign'],
  'Presale':    ['Need Adjuster Appointment', 'Adjuster Appointments', 'Scope of Work', 'Re-Inspect', 'Supplement', 'Build Order', 'Approved?'],
  'Production': ['Pull Permits', 'Schedule Build', 'Pre-Conditions', 'Job in Progress', 'Final Inspection'],
  'Post Sale':  ['Closeout & Invoice', 'Reviews & Referrals', 'Customer Service', 'Accounts Receivable', 'Debt Collection', 'Send Warranty', 'Past Customer Campaign'],
}
export function statusesForStage(stage) { return STATUSES[stage] || [] }

// Maps a canonical status to the client's own label (falls back to ours if unmapped
// or flagged as a gap to be added at install).
export function makeStatusMapper(statusMap) {
  return (name) => {
    const v = statusMap && statusMap[name]
    return (v && v !== '__ADD__' && String(v).trim()) || name
  }
}

// ── Outreach channels ───────────────────────────────────────────────────────
export const ALL_CHANNELS = [
  { id: 'phone', label: 'Phone call' },
  { id: 'email', label: 'Email' },
  { id: 'text',  label: 'Text', needsTexting: true },
]

export const MANUAL_NOTICE = "Our system only detects assigned tasks. Tags, internal notes, and comments will not trigger this workflow. By selecting manual task creation, you agree to follow RoofSmartr's task submission instructions."

// ── Per-service defaults: channels offered, recommended cadence, custom maxes ─
export const SERVICE_DEFAULTS = {
  'lead-nurture':          { channels: ['phone', 'email', 'text'], recommended: 'Daily touches while the lead is hot, tapering to weekly as it cools.', max: { phone: 7, email: 7, text: 7 } },
  'adjuster-coordination': { channels: ['phone', 'email', 'text'], recommended: 'Every few days until the adjuster appointment is set and confirmed.', max: { phone: 5, email: 5, text: 5 } },
  'claim-follow-up':       { channels: ['phone', 'email'],         recommended: 'Every 3–4 business days until the revised estimate lands.', max: { phone: 6, email: 6, text: 3 } },
  'pre-build-prep':        { channels: ['phone', 'email'],         recommended: 'Order measurements on entry, follow up on the estimate every 2 days.', max: { phone: 4, email: 4, text: 2 } },
  'build-prep':            { channels: ['phone', 'email'],         recommended: 'Build the order on entry, one follow-up if it is not reviewed in 2 days.', max: { phone: 3, email: 3, text: 2 } },
  'permits':               { channels: ['phone', 'email'],         recommended: 'Submit on entry, follow up with the jurisdiction every 5 days.', max: { phone: 4, email: 4, text: 2 } },
  'coc-invoices':          { channels: ['email', 'text'],          recommended: 'Send on completion, one reminder if it is unpaid after a week.', max: { phone: 3, email: 3, text: 3 } },
  'payment-collection':    { channels: ['phone', 'email', 'text'], recommended: 'Weekly, politely and persistently, until the balance is paid.', max: { phone: 8, email: 8, text: 8 } },
  'closing-documents':     { channels: ['email'],                  recommended: 'Issue on closeout, one follow-up if it is not acknowledged.', max: { phone: 2, email: 2, text: 2 } },
  'reputation-referrals':  { channels: ['email', 'text'],          recommended: 'Ask once the customer is happy, one reminder, then stop.', max: { phone: 2, email: 2, text: 2 } },
}
export function serviceDefaults(id) {
  return SERVICE_DEFAULTS[id] || { channels: ['phone', 'email', 'text'], recommended: 'A steady cadence until the step is done.', max: { phone: 5, email: 5, text: 5 } }
}

// Is a service "fully configured" given its saved state?
export function isServiceComplete(svcState, service) {
  if (service && service.perStatus) {
    const groups = service.groups || []
    if (!groups.length) return false
    const sts = (svcState && svcState.statuses) || {}
    return groups.every(g => {
      const st = sts[g.status]
      if (!st || st.enabled === undefined) return false
      if (st.enabled === 'no') return true
      return !!(st.channels && st.channels.length && st.frequency)
    })
  }
  if (!svcState) return false
  if (svcState.enabled === 'no') return true
  if (svcState.enabled !== 'yes') return false
  if (!svcState.identify) return false
  if (svcState.identify === 'auto' && !svcState.status) return false
  if (svcState.identify === 'manual' && !svcState.agreed) return false
  if (!svcState.channels || svcState.channels.length === 0) return false
  if (!svcState.frequency) return false
  return true
}

// ── Company profile completeness (every field is required) ───────────────────
const COMPANY_FIELDS = [
  'companyName', 'mainContact', 'callbackPhone', 'mainEmail', 'customerBase',
  'avgJobsMonthly', 'serviceArea', 'businessHours', 'quietHours', 'reviewLink',
  'escalationContact', 'voice',
]

export function companySectionComplete(d = {}) {
  return COMPANY_FIELDS.every(f => String(d[f] ?? '').trim() !== '')
}

export function crmSectionComplete(d = {}) {
  if (!d.crm) return false
  if (!d.textingEnabled) return false
  const statuses = (d.clientStatuses || []).filter(s => String(s).trim() !== '')
  if (statuses.length === 0) return false
  const allCanon = STAGES.flatMap(stage => STATUSES[stage])
  return allCanon.every(canon => !!(d.statusMap && d.statusMap[canon]))
}

export function teamSectionComplete(d = {}) {
  const team = (d.team || []).filter(m => m && String(m.name).trim() !== '' && String(m.role).trim() !== '')
  if (team.length === 0) return false
  if (String(d.teamRules ?? '').trim() === '') return false
  return true
}

export function profileSectionComplete(id, d) {
  if (id === 'company') return companySectionComplete(d)
  if (id === 'crm') return crmSectionComplete(d)
  if (id === 'team') return teamSectionComplete(d)
  return false
}

export function companyProfileComplete(d) {
  return ['company', 'crm', 'team'].every(s => profileSectionComplete(s, d))
}
