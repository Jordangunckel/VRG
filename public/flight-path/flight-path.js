// ─────────────────────────────────────────────
// STAGE DATA
// ─────────────────────────────────────────────
const stages = [

  // ── SHARED ──────────────────────────────────
  {
    id: "pre-sale",
    name: "LEADS",
    category: "Leads",
    path: "Leads",
    type: "stage",
    role: "category",
    hasSupport: false,
    x: 25, y: 60, w: 160, h: 42,
    stagePurpose: "Every lead enters a shared intake lane before splitting into insurance or retail paths.",
    automations: [
      {
        type: "Status Movement",
        goal: "Route new leads into the correct insurance or retail path immediately.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "When a new job is created, use job type or a custom routing field to trigger a status change automation that moves the file into the Insurance or Retail workflow."
        },
        accuLynx: {
          method: "Automation Manager",
          setup: "Use Automation Manager to trigger a routing task when a new job is created. Staff manually update the milestone to Insurance or Retail based on the intake field."
        }
      },
      {
        type: "Required Fields/Checklist",
        goal: "Require owner assignment, lead source, and next action before the lead can move forward.",
        jobNimbus: {
          method: "Required Field Enforcement",
          setup: "Set owner, lead source, and next action as required fields on the job record. The job cannot advance until all three are filled."
        },
        accuLynx: {
          method: "Checklist Item",
          setup: "Add owner assignment, lead source, and next action as required checklist items on the job record."
        }
      },
      {
        type: "Internal Notification",
        goal: "Notify the correct rep or office user based on lead source or job type.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "Trigger an internal notification to the assigned rep or admin when a new job is created, based on job type or lead source."
        },
        accuLynx: {
          method: "Automation Manager",
          setup: "Use Automation Manager to create a notification task for the correct rep or admin when a new job is created."
        }
      }
    ],
    commonFailurePoint: "The CRM starts as a contact list instead of an operating system.",
    roofSmartrSupport: null
  },

  {
    id: "cold-leads",
    name: "Cold Leads",
    category: "Leads",
    path: "Leads",
    type: "stage",
    hasSupport: false,
    useSimplifiedDrawer: true,
    x: 25, y: 125, w: 155, h: 46,
    goal: "Keep the lead warm until they're ready — or confirm they're not moving forward.",
    steps: [
      {
        when: "Week 1",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 1 week", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 7 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Week 2",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 2 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 14 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 3",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 3 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 21 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 4",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 4 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 28 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Week 5",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 5 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 35 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 6",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 6 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 42 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 7",
        accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 7 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 49 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      }
    ],
    exitStep: {
      when: "After Week 7 — No Response",
      accuLynx: { trigger: "Milestones — Changed to Status: Cold Leads — After 7 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Dead" },
      jobNimbus: { trigger: "Time-Based — 49 days after status changes to Cold Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Dead" }
    },
    automations: [],
    commonFailurePoint: "Cold leads are abandoned entirely. A weekly touch costs almost nothing, and some of these leads will eventually respond — but only if the CRM keeps the cadence running.",
    roofSmartrSupport: null
  },

  {
    id: "warm-leads",
    name: "Warm Leads",
    category: "Leads",
    path: "Leads",
    type: "stage",
    hasSupport: false,
    useSimplifiedDrawer: true,
    x: 25, y: 195, w: 165, h: 46,
    goal: "Keep the conversation going until they're ready to schedule.",
    steps: [
      {
        when: "Day 1",
        accuLynx: { trigger: "Milestones — Changed to Status: Warm Leads — After 1 day", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 1 day after status changes to Warm Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Day 2",
        accuLynx: { trigger: "Milestones — Changed to Status: Warm Leads — After 2 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 2 days after status changes to Warm Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Day 3",
        accuLynx: { trigger: "Milestones — Changed to Status: Warm Leads — After 3 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 3 days after status changes to Warm Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Day 4",
        accuLynx: { trigger: "Milestones — Changed to Status: Warm Leads — After 4 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 4 days after status changes to Warm Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      }
    ],
    exitStep: {
      when: "After Day 4 — No Response",
      accuLynx: { trigger: "Milestones — Changed to Status: Warm Leads — After 4 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Cold Leads" },
      jobNimbus: { trigger: "Time-Based — 4 days after status changes to Warm Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Cold Leads" }
    },
    automations: [],
    commonFailurePoint: "Warm leads are treated as effectively dead. Without a system keeping the cadence going, these leads disappear at the exact point where one more touch could have booked the appointment.",
    roofSmartrSupport: null
  },

  {
    id: "hot-leads",
    name: "Hot Leads",
    category: "Leads",
    path: "Leads",
    type: "stage",
    hasSupport: false,
    useSimplifiedDrawer: true,
    x: 25, y: 265, w: 150, h: 46,
    goal: "Get the inspection scheduled before the lead cools off.",
    steps: [
      {
        when: "On Assignment",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call new lead immediately" },
        jobNimbus: { trigger: "Status Change — Changed to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call new lead immediately" }
      },
      {
        when: "Day 1",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 1 day", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 1 day after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Day 2",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 2 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 2 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Day 3",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 3 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 3 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Day 4",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 4 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 4 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Day 5",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 5 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 5 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Day 6",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 6 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 6 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Day 7",
        accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 7 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 7 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      }
    ],
    exitStep: {
      when: "After Day 7 — No Response",
      accuLynx: { trigger: "Milestones — Changed to Status: Hot Lead — After 7 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Warm Leads" },
      jobNimbus: { trigger: "Time-Based — 7 days after status changes to Hot Leads", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Warm Leads" }
    },
    automations: [],
    commonFailurePoint: "Reps call once or twice and move on. Without a structured 7-touch cadence enforced by the CRM, most hot leads go cold before anyone follows up enough.",
    roofSmartrSupport: null
  },

  // ── INSURANCE PATH ───────────────────────────
  {
    id: "insurance",
    name: "PRE-SALE",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    role: "category",
    hasSupport: false,
    x: 25, y: 390, w: 200, h: 48,
    stagePurpose: "Insurance jobs need a different workflow than retail jobs. The CRM should route the file into an insurance-specific path with the right claim information, appointment tracking, and paperwork follow-up.",
    automations: [
      {
        type: "Status Movement",
        goal: "Route the file into an insurance-specific path and confirm the job type.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "When the job is marked as Insurance type, trigger routing into the insurance workflow with required claim fields and an insurance-specific task checklist."
        },
        accuLynx: {
          method: "Automation Manager",
          setup: "Use Automation Manager to trigger a routing task when the job is categorized as Insurance. Staff manually update the job category and milestone to begin the insurance workflow."
        }
      },
      {
        type: "Required Fields/Checklist",
        goal: "Require carrier, claim number, date of loss, deductible, claim status, and policyholder info.",
        jobNimbus: {
          method: "Required Field Enforcement",
          setup: "Set carrier, claim number, date of loss, deductible, claim status, and policyholder name and contact as required fields on the insurance job record."
        },
        accuLynx: {
          method: "Checklist Item",
          setup: "Add carrier, claim number, date of loss, deductible, claim status, and policyholder information as required checklist items on the insurance job record."
        }
      },
      {
        type: "Customer Communication",
        goal: "Send the homeowner a message explaining the insurance claim process.",
        jobNimbus: {
          method: "Email/Text Template Automation",
          setup: "When the job is routed to Insurance, trigger a pre-built message explaining the insurance claim process and what to expect next."
        },
        accuLynx: {
          method: "Automation Manager",
          setup: "Use Automation Manager to send a pre-built insurance process message to the homeowner when the Insurance milestone is set."
        }
      },
      {
        type: "Task Creation",
        goal: "Create a task to confirm whether the claim has been filed.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "When the job enters the Insurance path, create a claim confirmation task assigned to the responsible rep or admin."
        },
        accuLynx: {
          method: "Automation Manager Task Setup",
          setup: "Use Automation Manager to create a claim confirmation task when the Insurance milestone is set."
        }
      }
    ],
    commonFailurePoint: "Insurance jobs are treated like retail jobs and key claim details are missed early.",
    roofSmartrSupport: null
  },

  {
    id: "insurance-sales-process",
    name: "Initial Appointment",
    category: "Leads",
    path: "Leads",
    type: "stage",
    hasSupport: false,
    useSimplifiedDrawer: true,
    x: 25, y: 325, w: 200, h: 50,
    goal: "Confirm the appointment with the homeowner and route the file after the inspection.",
    steps: [
      {
        when: "1 Day Before Appointment",
        accuLynx: { trigger: "Milestones — Appointment Date — 1 day before", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Appointment Reminder" },
        jobNimbus: { trigger: "Time-Based — 1 day before scheduled inspection date", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Appointment Reminder" }
      }
    ],
    exitStep: {
      when: "On Appointment Date",
      accuLynx: { trigger: "Milestones — Appointment Date — On date", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Need Adjuster Appointment or Inspected, Unsigned" },
      jobNimbus: { trigger: "Time-Based — On the day of the scheduled inspection", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Change Status to Need Adjuster Appointment or Inspected, Unsigned" }
    },
    automations: [],
    commonFailurePoint: "Reps complete the inspection but do not update the CRM, so the file stalls and no follow-up is triggered.",
    roofSmartrSupport: null
  },

  {
    id: "inspected-unsigned",
    name: "Inspected, Unsigned",
    category: "Leads",
    path: "Leads",
    type: "stage",
    hasSupport: true,
    useSimplifiedDrawer: true,
    x: 8, y: 415, w: 130, h: 46,
    goal: "Get the agreement signed before the file goes cold.",
    steps: [
      {
        when: "Week 1",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 1 week", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 7 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Week 2",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 2 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 14 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 3",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 3 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 21 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 4",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 4 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 28 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      },
      {
        when: "Week 5",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 5 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 35 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 6",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 6 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text" },
        jobNimbus: { trigger: "Time-Based — 42 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text" }
      },
      {
        when: "Week 7",
        accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 7 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Call" },
        jobNimbus: { trigger: "Time-Based — 49 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Call" }
      }
    ],
    exitStep: {
      when: "After Week 7 — No Response",
      accuLynx: { trigger: "Milestones — Changed to Status: Inspected, Unsigned — After 7 weeks", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Dead" },
      jobNimbus: { trigger: "Time-Based — 49 days after status changes to Inspected, Unsigned", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Dead" }
    },
    automations: [],
    commonFailurePoint: "These leads are abandoned after the inspection because no follow-up system is set up for unsigned files.",
    roofSmartrSupport: "RoofSmartr can follow up with unsigned inspection leads using the same temperature-based cadence as your Lead Nurture System, with the goal of getting the agreement signed."
  },

  {
    id: "need-adjuster-appointment",
    name: "Need Adjuster Appt",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    hasSupport: true,
    x: 25, y: 415, w: 220, h: 46,
    useSimplifiedDrawer: true,
    goal: "Coordinate the adjuster appointment and capture all property details before the inspection.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Need Adjuster Appointment", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Coordinate adjuster appointment and set appointment date" },
        jobNimbus: { trigger: "Status Change — Changed to Need Adjuster Appointment", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Coordinate adjuster appointment and set appointment date" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Need Adjuster Appointment", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Verify checklist: steepness, stories, access, and special notes" },
        jobNimbus: { trigger: "Status Change — Changed to Need Adjuster Appointment", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Verify checklist: steepness, stories, access, and special notes" }
      },
      {
        when: "Appointment Date Set",
        accuLynx: { trigger: "Job — Appointment date field updated", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Add appointment to rep's calendar" },
        jobNimbus: { trigger: "Field Change — Appointment date entered", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Add appointment to rep's calendar" }
      }
    ],
    exitStep: {
      when: "Appointment Confirmed",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Adjuster Appointment" },
      jobNimbus: { trigger: "Task Completion — Appointment confirmed", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Adjuster Appointment" }
    },
    automations: [],
    commonFailurePoint: "The file sits in limbo between signing and the adjuster appointment because there is no clear coordination stage.",
    roofSmartrSupport: "RoofSmartr can coordinate adjuster appointments, capture property notes, update the CRM, and move the file to Adjuster Appointment once the appointment is confirmed."
  },

  {
    id: "adjuster-appointment",
    name: "Adjuster Appointment",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    hasSupport: true,
    x: 25, y: 515, w: 240, h: 52,
    useSimplifiedDrawer: true,
    goal: "Confirm the appointment, narrow the arrival window, and document the outcome.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Adjuster Appointment", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Confirm adjuster appointment details" },
        jobNimbus: { trigger: "Status Change — Changed to Adjuster Appointment", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Confirm adjuster appointment details" }
      },
      {
        when: "2 Days Before Appointment",
        accuLynx: { trigger: "Milestones — Appointment Date — 2 days before", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Appointment reminder to homeowner" },
        jobNimbus: { trigger: "Time-Based — 2 days before adjuster appointment", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Appointment reminder to homeowner" }
      },
      {
        when: "1 Day Before Appointment",
        accuLynx: { trigger: "Milestones — Appointment Date — 1 day before", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Narrow adjuster arrival window" },
        jobNimbus: { trigger: "Time-Based — 1 day before adjuster appointment", conditions: "Job Type: Any, Work Type: Insurance", action: "Create a Task — Narrow adjuster arrival window" }
      }
    ],
    exitStep: {
      when: "Appointment Complete — Outcome Documented",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Scope of Work" },
      jobNimbus: { trigger: "Task Completion — Appointment outcome documented", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Scope of Work" }
    },
    automations: [],
    commonFailurePoint: "The adjuster appointment gets scheduled, but nobody confirms the details, narrows the window, or keeps the rep updated.",
    roofSmartrSupport: "RoofSmartr can coordinate adjuster appointments, follow up with the homeowner, help narrow broad appointment windows, add notes to the CRM, monitor schedule changes, and keep the rep informed."
  },

  {
    id: "scope-of-work",
    name: "Scope of Work",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    hasSupport: true,
    x: 25, y: 620, w: 200, h: 52,
    useSimplifiedDrawer: true,
    goal: "Chase the scope document until it is received, uploaded, and the file can be routed.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Scope of Work", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Request scope of work from homeowner and carrier" },
        jobNimbus: { trigger: "Status Change — Changed to Scope of Work", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Request scope of work from homeowner and carrier" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Scope of Work", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Follow up on scope document" },
        jobNimbus: { trigger: "Status Change — Changed to Scope of Work", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Follow up on scope document" }
      },
      {
        when: "After 5 Days — No Scope Received",
        accuLynx: { trigger: "Milestones — Changed to Status: Scope of Work — After 5 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Follow up on scope (recurring every 5 days)" },
        jobNimbus: { trigger: "Time-Based — 5 days after Scope of Work status", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Follow up on scope (recurring every 5 days)" }
      }
    ],
    exitStep: {
      when: "Scope Received and Uploaded",
      accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Build Order, Re-inspect, or Supplement" },
      jobNimbus: { trigger: "Task Completion — Scope document uploaded", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Build Order, Re-inspect, or Supplement" }
    },
    automations: [],
    commonFailurePoint: "The scope sits in limbo and nobody follows up consistently.",
    roofSmartrSupport: "RoofSmartr follows up with homeowners, reps, and carriers until the scope is received, uploaded, tagged, and the file is routed to the next step."
  },

  {
    id: "re-inspect",
    name: "Re-inspect",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    hasSupport: true,
    x: 12, y: 715, w: 130, h: 46,
    useSimplifiedDrawer: true,
    goal: "Loop the denied or under-approved file back through the adjuster process.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Re-inspect", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Schedule reinspection appointment" },
        jobNimbus: { trigger: "Status Change — Changed to Re-inspect", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Schedule reinspection appointment" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Re-inspect", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Explain reinspection process to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Re-inspect", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Explain reinspection process to homeowner" }
      },
      {
        when: "1 Day Before Reinspection",
        accuLynx: { trigger: "Milestones — Appointment Date — 1 day before", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Reinspection reminder to homeowner and rep" },
        jobNimbus: { trigger: "Time-Based — 1 day before reinspection appointment", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Reinspection reminder to homeowner and rep" }
      }
    ],
    exitStep: {
      when: "Reinspection Complete",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Adjuster Appointment or Scope of Work" },
      jobNimbus: { trigger: "Task Completion — Reinspection outcome recorded", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Adjuster Appointment or Scope of Work" }
    },
    automations: [],
    commonFailurePoint: "Denied or partially approved claims are marked dead instead of being routed into a clear reinspection process.",
    roofSmartrSupport: "RoofSmartr can help coordinate reinspection follow-up, keep the homeowner updated, and make sure the file loops back to the right stage."
  },

  {
    id: "supplement",
    name: "Supplement",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    hasSupport: true,
    x: 40, y: 715, w: 150, h: 46,
    useSimplifiedDrawer: true,
    goal: "Keep supplement paperwork moving until it is received and the file can advance.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Supplement", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Follow up on supplement paperwork" },
        jobNimbus: { trigger: "Status Change — Changed to Supplement", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Follow up on supplement paperwork" }
      },
      {
        when: "After 7 Days — No Supplement Received",
        accuLynx: { trigger: "Milestones — Changed to Status: Supplement — After 7 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Weekly supplement follow-up (recurring)" },
        jobNimbus: { trigger: "Time-Based — 7 days after Supplement status", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Weekly supplement follow-up (recurring)" }
      },
      {
        when: "Supplement Received",
        accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Upload supplement document to CRM" },
        jobNimbus: { trigger: "Task Completion — Supplement document uploaded", conditions: "Job Type: Any, Work Type: Insurance", action: "Upload supplement document to CRM" }
      }
    ],
    exitStep: {
      when: "Supplement Received and Uploaded",
      accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Build Order" },
      jobNimbus: { trigger: "Task Completion — Supplement document uploaded", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Build Order" }
    },
    automations: [],
    commonFailurePoint: "Supplements sit untouched because nobody is following up on them consistently.",
    roofSmartrSupport: "RoofSmartr is not a supplement company and does not write or negotiate supplements. RoofSmartr follows up to help get the paperwork moving, keep the file updated, and move the job forward."
  },

  {
    id: "approved",
    name: "Approved?",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "decision",
    hasSupport: false,
    x: 25, y: 886, w: 190, h: 50,
    useSimplifiedDrawer: true,
    goal: "Confirm the scope, verify profitability, and ensure all paperwork is in place before production begins.",
    steps: [
      {
        when: "Profit Analysis",
        accuLynx: { trigger: "Milestones — Changed to Status: Approved", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Review scope, calculate total price, and confirm profit margin" },
        jobNimbus: { trigger: "Status Change — Changed to Approved", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Review scope, calculate total price, and confirm profit margin" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Approved", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Verify checklist: signed agreement, scope, approval amount, deductible, and material selection" },
        jobNimbus: { trigger: "Status Change — Changed to Approved", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Verify checklist: signed agreement, scope, approval amount, deductible, and material selection" }
      },
      {
        when: "All Items Confirmed",
        accuLynx: { trigger: "Job — Checklist completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Notify production and admin" },
        jobNimbus: { trigger: "Task Completion — All required fields confirmed", conditions: "Job Type: Any, Work Type: Insurance", action: "Create a Task — Notify production and admin" }
      }
    ],
    exitStep: {
      when: "All Checklist Items Complete",
      accuLynx: { trigger: "Job — Checklist completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Production (or Re-inspect, Supplement, or Lost if incomplete)" },
      jobNimbus: { trigger: "Task Completion — All required fields confirmed", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Production (or Re-inspect, Supplement, or Lost if incomplete)" }
    },
    automations: [],
    commonFailurePoint: "Jobs are moved into production before the scope is verified for profitability or paperwork is complete.",
    roofSmartrSupport: null
  },

  {
    id: "lost-customer-campaign",
    name: "Lost Customer Campaign",
    category: "Leads",
    path: "Leads",
    type: "stage",
    hasSupport: false,
    x: 9, y: 951, w: 170, h: 50,
    useSimplifiedDrawer: true,
    goal: "Keep lost leads in a structured nurture path so they can re-enter when ready.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Lost Customer Campaign", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Send Email/Text — Polite closeout message to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Lost Customer Campaign", conditions: "Job Type: Any, Work Type: Insurance", action: "Send Email/Text — Polite closeout message to homeowner" }
      },
      {
        when: "After 30 Days",
        accuLynx: { trigger: "Milestones — Changed to Status: Lost Customer Campaign — After 30 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — 30-day follow-up" },
        jobNimbus: { trigger: "Time-Based — 30 days after Lost Customer Campaign status", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — 30-day follow-up" }
      },
      {
        when: "After 90 Days",
        accuLynx: { trigger: "Milestones — Changed to Status: Lost Customer Campaign — After 90 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — 90-day follow-up and add to seasonal campaign" },
        jobNimbus: { trigger: "Time-Based — 90 days after Lost Customer Campaign status", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — 90-day follow-up and add to seasonal campaign" }
      }
    ],
    exitStep: {
      when: "Customer Responds",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Hot Lead" },
      jobNimbus: { trigger: "Task Completion — Customer response logged", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Hot Lead" }
    },
    automations: [],
    commonFailurePoint: "Lost leads are ignored forever, even though many will convert later.",
    roofSmartrSupport: null
  },

  // ── PRODUCTION ───────────────────────────────
  {
    id: "production",
    name: "PRODUCTION",
    category: "Production",
    path: "Production",
    type: "stage",
    role: "category",
    hasSupport: false,
    x: 25, y: 1001, w: 210, h: 42,
    stagePurpose: "Start the build process only after the file is truly ready.",
    automations: [
      {
        type: "Required Fields/Checklist",
        goal: "Require all pre-production items before the job can enter production.",
        jobNimbus: {
          method: "Required Field Enforcement",
          setup: "Set approval, signed contract, material selection, measurement report, production notes, and required paperwork as required fields before the job can enter the Production workflow."
        },
        accuLynx: {
          method: "Checklist Item",
          setup: "Add approval, signed contract, material selection, measurement, production notes, and required paperwork as required checklist items before the Production milestone can be set."
        }
      },
      {
        type: "Task Creation",
        goal: "Create a production readiness checklist when the job enters production.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "When the job enters Production, trigger a status change automation that creates a readiness checklist task to confirm all required items are in place."
        },
        accuLynx: {
          method: "Automation Manager Task Setup",
          setup: "Use Automation Manager to create a production readiness task when the Production milestone is set."
        }
      },
      {
        type: "Internal Notification",
        goal: "Notify production and admin that a job has entered production.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "When the job enters the Production workflow, trigger an internal notification to the production manager and relevant admin."
        },
        accuLynx: {
          method: "Automation Manager",
          setup: "Use Automation Manager to create a production start notification task for the production manager when the Production milestone is set."
        }
      }
    ],
    commonFailurePoint: "Jobs enter production with missing information, causing delays and confusion.",
    roofSmartrSupport: null
  },

  {
    id: "order-material",
    name: "Build Order",
    category: "Pre-Sale",
    path: "Insurance Path",
    type: "stage",
    hasSupport: true,
    x: 25, y: 800, w: 200, h: 56,
    useSimplifiedDrawer: true,
    goal: "Pull measurements, upload the report, and build a draft order for materials, labor, and overhead.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Build Order", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Verify or order measurement report" },
        jobNimbus: { trigger: "Status Change — Changed to Build Order", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Verify or order measurement report" }
      },
      {
        when: "Report Received",
        accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Upload measurement report to CRM" },
        jobNimbus: { trigger: "Task Completion — Report uploaded", conditions: "Job Type: Any, Work Type: Insurance", action: "Upload measurement report to CRM" }
      },
      {
        when: "Report Confirmed",
        accuLynx: { trigger: "Job — Checklist item completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Build draft material and labor order from scope and measurements" },
        jobNimbus: { trigger: "Task Completion — Measurement confirmed", conditions: "Job Type: Any, Work Type: Insurance", action: "Create Task — Build draft material and labor order from scope and measurements" }
      }
    ],
    exitStep: {
      when: "Draft Order Complete",
      accuLynx: { trigger: "Job — Checklist completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Insurance", action: "Create a Task — Change Status to Approved" },
      jobNimbus: { trigger: "Task Completion — Draft order ready for review", conditions: "Job Type: Any, Work Type: Insurance", action: "Change Status to Approved" }
    },
    automations: [],
    commonFailurePoint: "Jobs enter Approved without a measurement report or material order, causing delays when production begins.",
    roofSmartrSupport: "RoofSmartr can pull or verify measurements, upload the report, and build a draft material and labor order for the team to review before moving to Approved."
  },

  {
    id: "pull-permits",
    name: "Pull Permits",
    category: "Production",
    path: "Production",
    type: "stage",
    hasSupport: true,
    x: 25, y: 1096, w: 200, h: 52,
    useSimplifiedDrawer: true,
    goal: "Handle all permit requirements before the build is scheduled.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Pull Permits", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Coordinate permit requirements (jurisdiction, contractor license, project scope)" },
        jobNimbus: { trigger: "Status Change — Changed to Pull Permits", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Coordinate permit requirements (jurisdiction, contractor license, project scope)" }
      },
      {
        when: "Application Submitted",
        accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Update permit status field in CRM" },
        jobNimbus: { trigger: "Task Completion — Permit application submitted", conditions: "Job Type: Any, Work Type: Any", action: "Update permit status field in CRM" }
      },
      {
        when: "Permit Approved",
        accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Upload permit confirmation to CRM" },
        jobNimbus: { trigger: "Task Completion — Permit confirmed", conditions: "Job Type: Any, Work Type: Any", action: "Upload permit confirmation to CRM" }
      }
    ],
    exitStep: {
      when: "Permit Approved or Not Required",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Schedule Build" },
      jobNimbus: { trigger: "Task Completion — Permit status confirmed", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Schedule Build" }
    },
    automations: [],
    commonFailurePoint: "Permits are forgotten until the job is already being scheduled.",
    roofSmartrSupport: "RoofSmartr can help pull permits based on the client's SOP and local process. If manual submission is required, RoofSmartr follows the client's instructions and updates the CRM."
  },

  {
    id: "schedule-build",
    name: "Schedule Build",
    category: "Production",
    path: "Production",
    type: "stage",
    hasSupport: true,
    x: 25, y: 1196, w: 200, h: 52,
    useSimplifiedDrawer: true,
    goal: "Confirm the job is build-ready, communicate the date, and notify production.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Schedule Build", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Confirm build readiness (signed contract, materials, permit, color selection)" },
        jobNimbus: { trigger: "Status Change — Changed to Schedule Build", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Confirm build readiness (signed contract, materials, permit, color selection)" }
      },
      {
        when: "Build Date Confirmed",
        accuLynx: { trigger: "Job — Build date field updated", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Tentative build date to homeowner" },
        jobNimbus: { trigger: "Field Change — Build date entered", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Tentative build date to homeowner" }
      },
      {
        when: "Build Date Confirmed",
        accuLynx: { trigger: "Job — Build date field updated", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify production manager" },
        jobNimbus: { trigger: "Field Change — Build date entered", conditions: "Job Type: Any, Work Type: Any", action: "Create a Task — Notify production manager" }
      }
    ],
    exitStep: {
      when: "All Readiness Items Confirmed",
      accuLynx: { trigger: "Job — Checklist completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Pre-Conditions" },
      jobNimbus: { trigger: "Task Completion — All readiness items confirmed", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Pre-Conditions" }
    },
    automations: [],
    commonFailurePoint: "Jobs get scheduled before they are actually ready.",
    roofSmartrSupport: "RoofSmartr can help confirm readiness items, communicate admin updates, and keep the CRM clean. RoofSmartr does not own the production calendar unless specifically defined in the client SOP."
  },

  {
    id: "pre-conditions",
    name: "Pre-Conditions",
    category: "Production",
    path: "Production",
    type: "stage",
    hasSupport: false,
    x: 25, y: 1296, w: 200, h: 52,
    useSimplifiedDrawer: true,
    goal: "Document job conditions and prepare the homeowner before work begins.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Pre-Conditions", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Complete pre-condition photos and material delivery confirmation" },
        jobNimbus: { trigger: "Status Change — Changed to Pre-Conditions", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Complete pre-condition photos and material delivery confirmation" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Pre-Conditions", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Pre-build prep message to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Pre-Conditions", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Pre-build prep message to homeowner" }
      },
      {
        when: "1 Day Before Build Date — Report Missing",
        accuLynx: { trigger: "Milestones — Build Date — 1 day before", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Alert production that pre-condition report is missing" },
        jobNimbus: { trigger: "Time-Based — 1 day before build date if report not uploaded", conditions: "Job Type: Any, Work Type: Any", action: "Create a Task — Alert production that pre-condition report is missing" }
      }
    ],
    exitStep: {
      when: "Pre-Condition Photos Uploaded",
      accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Job in Progress" },
      jobNimbus: { trigger: "Task Completion — Photos uploaded", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Job in Progress" }
    },
    automations: [],
    commonFailurePoint: "Damage disputes or job issues occur without pre-build documentation.",
    roofSmartrSupport: null
  },

  {
    id: "job-in-progress",
    name: "Job in Progress",
    category: "Production",
    path: "Production",
    type: "stage",
    hasSupport: false,
    x: 25, y: 1396, w: 200, h: 52,
    useSimplifiedDrawer: true,
    goal: "Keep the customer and office informed while the build is happening.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Job in Progress", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Job started update to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Job in Progress", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Job started update to homeowner" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Job in Progress", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Progress photos during production" },
        jobNimbus: { trigger: "Status Change — Changed to Job in Progress", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Progress photos during production" }
      },
      {
        when: "Build Complete",
        accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify office that work is complete" },
        jobNimbus: { trigger: "Task Completion — Build complete task marked done", conditions: "Job Type: Any, Work Type: Any", action: "Create a Task — Notify office that work is complete" }
      }
    ],
    exitStep: {
      when: "Job Marked Complete",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Final Inspection" },
      jobNimbus: { trigger: "Task Completion — Build complete task marked done", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Final Inspection" }
    },
    automations: [],
    commonFailurePoint: "The office and customer do not know what is happening during production.",
    roofSmartrSupport: null
  },

  {
    id: "final-inspection",
    name: "Final Inspection",
    category: "Production",
    path: "Production",
    type: "stage",
    hasSupport: false,
    x: 25, y: 1496, w: 200, h: 52,
    useSimplifiedDrawer: true,
    goal: "Confirm job quality with completion photos before moving to post-sale.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Final Inspection", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Perform final inspection and upload completion photos" },
        jobNimbus: { trigger: "Status Change — Changed to Final Inspection", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Perform final inspection and upload completion photos" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Final Inspection", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify production manager" },
        jobNimbus: { trigger: "Status Change — Changed to Final Inspection", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Notify production manager" }
      }
    ],
    exitStep: {
      when: "Inspection Passed and Photos Uploaded",
      accuLynx: { trigger: "Job — Checklist completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Post-Sale (or Problem Repair if issues found)" },
      jobNimbus: { trigger: "Task Completion — Final inspection passed", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Post-Sale (or Problem Repair if issues found)" }
    },
    automations: [],
    commonFailurePoint: "Jobs are invoiced or closed before final inspection confirms completion.",
    roofSmartrSupport: null
  },

  {
    id: "problem-repair",
    name: "Problem Repair?",
    category: "Production",
    path: "Production",
    type: "decision",
    hasSupport: false,
    x: 25, y: 1591, w: 215, h: 50,
    useSimplifiedDrawer: true,
    goal: "Track and resolve all repair issues before final closeout.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Problem Repair", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Assign repair task with due date and owner" },
        jobNimbus: { trigger: "Status Change — Changed to Problem Repair", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Assign repair task with due date and owner" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Problem Repair", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify production manager" },
        jobNimbus: { trigger: "Status Change — Changed to Problem Repair", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Notify production manager" }
      },
      {
        when: "If Customer-Facing Issue",
        accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Customer update on repair status" },
        jobNimbus: { trigger: "Task Completion — Customer notification needed", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Customer update on repair status" }
      }
    ],
    exitStep: {
      when: "Repair Complete and Photos Uploaded",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Final Inspection (or Post-Sale if no repair needed)" },
      jobNimbus: { trigger: "Task Completion — Repair complete and photos uploaded", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Final Inspection (or Post-Sale if no repair needed)" }
    },
    automations: [],
    commonFailurePoint: "Repair items are noted but never followed through.",
    roofSmartrSupport: null
  },

  // ── POST-SALE ────────────────────────────────
  {
    id: "post-sale",
    name: "POST SALE",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    role: "category",
    hasSupport: false,
    x: 25, y: 1700, w: 200, h: 42,
    stagePurpose: "Start post-sale closeout after a clean final inspection or completed repair.",
    automations: [
      {
        type: "Task Creation",
        goal: "Create closeout, payment, review, warranty, and past-customer tasks when the job enters Post-Sale.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "When the job enters Post-Sale, trigger a status change automation that creates a post-sale task package including closeout, invoice, review request, and warranty tasks."
        },
        accuLynx: {
          method: "Automation Manager Task Setup",
          setup: "Use Automation Manager to create a post-sale task package when the Post-Sale milestone is set."
        }
      },
      {
        type: "Internal Notification",
        goal: "Notify the office that production is complete and post-sale tasks are beginning.",
        jobNimbus: {
          method: "Status Change Automation",
          setup: "Trigger an internal notification to the office and assigned rep when the job moves to Post-Sale."
        },
        accuLynx: {
          method: "Automation Manager",
          setup: "Use Automation Manager to create an office notification task when the Post-Sale milestone is set."
        }
      }
    ],
    commonFailurePoint: "The job feels finished in the field but not in the office.",
    roofSmartrSupport: null
  },

  {
    id: "village-final-inspection",
    name: "Village Final Inspection",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: false,
    x: 25, y: 1775, w: 280, h: 52,
    useSimplifiedDrawer: true,
    goal: "Track municipal inspection requirements before issuing the Certificate of Completion.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Village Final Inspection", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Schedule and track municipal inspection" },
        jobNimbus: { trigger: "Status Change — Changed to Village Final Inspection", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Schedule and track municipal inspection" }
      },
      {
        when: "Inspection Scheduled",
        accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Update inspection status field in CRM" },
        jobNimbus: { trigger: "Task Completion — Inspection scheduled", conditions: "Job Type: Any, Work Type: Any", action: "Update inspection status field in CRM" }
      },
      {
        when: "Inspection Passed",
        accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Upload inspection confirmation to CRM" },
        jobNimbus: { trigger: "Task Completion — Confirmation uploaded", conditions: "Job Type: Any, Work Type: Any", action: "Upload inspection confirmation to CRM" }
      }
    ],
    exitStep: {
      when: "Inspection Passed or Not Required",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Send Certificate of Completion" },
      jobNimbus: { trigger: "Task Completion — Inspection status confirmed", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Send Certificate of Completion" }
    },
    automations: [],
    commonFailurePoint: "Municipal final inspections are missed, delaying closeout.",
    roofSmartrSupport: null
  },

  {
    id: "send-certificate-of-completion",
    name: "Send Certificate of Completion",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 25, y: 1875, w: 250, h: 56,
    useSimplifiedDrawer: true,
    goal: "Send the C.O.C. to the homeowner and/or carrier to officially close the job.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Send Certificate of Completion", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Prepare and deliver Certificate of Completion" },
        jobNimbus: { trigger: "Status Change — Changed to Send Certificate of Completion", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Prepare and deliver Certificate of Completion" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Send Certificate of Completion", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — C.O.C. delivery to homeowner and/or carrier" },
        jobNimbus: { trigger: "Status Change — Changed to Send Certificate of Completion", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — C.O.C. delivery to homeowner and/or carrier" }
      },
      {
        when: "Delivered",
        accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Upload C.O.C. document to CRM" },
        jobNimbus: { trigger: "Task Completion — C.O.C. delivered", conditions: "Job Type: Any, Work Type: Any", action: "Upload C.O.C. document to CRM" }
      }
    ],
    exitStep: {
      when: "C.O.C. Sent and Uploaded",
      accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Invoice Customer" },
      jobNimbus: { trigger: "Task Completion — C.O.C. delivered", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Invoice Customer" }
    },
    automations: [],
    commonFailurePoint: "Closeout paperwork is delayed until someone has time to get to it.",
    roofSmartrSupport: "RoofSmartr can create and send Certificates of Completion based on the client's closeout process."
  },

  {
    id: "invoice-customer",
    name: "Invoice Customer",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 25, y: 1975, w: 210, h: 52,
    useSimplifiedDrawer: true,
    goal: "Send the invoice once all financial details are confirmed and tracked.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Invoice Customer", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Prepare invoice (verify approved amount, deductible, supplements, upgrades, and collected payments)" },
        jobNimbus: { trigger: "Status Change — Changed to Invoice Customer", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Prepare invoice (verify approved amount, deductible, supplements, upgrades, and collected payments)" }
      },
      {
        when: "Invoice Ready",
        accuLynx: { trigger: "Financial — Invoice created", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Invoice delivery to homeowner and/or carrier" },
        jobNimbus: { trigger: "Task Completion — Invoice prepared", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Invoice delivery to homeowner and/or carrier" }
      },
      {
        when: "Sent",
        accuLynx: { trigger: "Financial — Invoice sent", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Upload invoice to CRM" },
        jobNimbus: { trigger: "Task Completion — Invoice delivered", conditions: "Job Type: Any, Work Type: Any", action: "Upload invoice to CRM" }
      }
    ],
    exitStep: {
      when: "Invoice Sent and Uploaded",
      accuLynx: { trigger: "Financial — Invoice sent", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Accounts Receivable" },
      jobNimbus: { trigger: "Task Completion — Invoice delivered", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Accounts Receivable" }
    },
    automations: [],
    commonFailurePoint: "Invoices are sent late, sent incorrectly, or not followed up on.",
    roofSmartrSupport: "RoofSmartr can create and send invoices according to the client's process and keep the CRM updated."
  },

  {
    id: "happy-customer",
    name: "Happy Customer?",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "decision",
    hasSupport: false,
    x: 25, y: 2075, w: 215, h: 50,
    useSimplifiedDrawer: true,
    goal: "Confirm customer satisfaction before requesting reviews and referrals.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Happy Customer", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Satisfaction check-in to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Happy Customer", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Satisfaction check-in to homeowner" }
      },
      {
        when: "If Customer Is Unhappy",
        accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify manager immediately" },
        jobNimbus: { trigger: "Task Completion — Unhappy response recorded", conditions: "Job Type: Any, Work Type: Any", action: "Create a Task — Notify manager immediately" }
      }
    ],
    exitStep: {
      when: "Customer Responds",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Reviews & Referrals (happy) or Customer Service (unhappy)" },
      jobNimbus: { trigger: "Task Completion — Customer response recorded", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Reviews & Referrals (happy) or Customer Service (unhappy)" }
    },
    automations: [],
    commonFailurePoint: "Companies ask for reviews before knowing whether the customer is actually happy.",
    roofSmartrSupport: null
  },

  {
    id: "reviews-referrals",
    name: "Reviews & Referrals",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 13, y: 2175, w: 180, h: 56,
    useSimplifiedDrawer: true,
    goal: "Capture the review and referral while the install is still fresh.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Reviews & Referrals", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Review request to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Reviews & Referrals", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Review request to homeowner" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Reviews & Referrals", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Referral request to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Reviews & Referrals", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Referral request to homeowner" }
      },
      {
        when: "After 7 Days — No Review",
        accuLynx: { trigger: "Milestones — Changed to Status: Reviews & Referrals — After 7 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Follow up on review" },
        jobNimbus: { trigger: "Time-Based — 7 days after Reviews & Referrals status", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Follow up on review" }
      }
    ],
    exitStep: {
      when: "Review Confirmed",
      accuLynx: { trigger: "Job — Checklist item completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify rep that review was received" },
      jobNimbus: { trigger: "Task Completion — Review received", conditions: "Job Type: Any, Work Type: Any", action: "Create a Task — Notify rep that review was received" }
    },
    automations: [],
    commonFailurePoint: "Happy customers are never asked at the right time.",
    roofSmartrSupport: "RoofSmartr can run review and referral outreach after completed jobs so the company captures more five-star reviews and neighbor referrals."
  },

  {
    id: "customer-service",
    name: "Customer Service",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 37, y: 2175, w: 175, h: 56,
    useSimplifiedDrawer: true,
    goal: "Track and resolve all customer issues until they are fully closed.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Customer Service", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Assign issue with owner and due date" },
        jobNimbus: { trigger: "Status Change — Changed to Customer Service", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Assign issue with owner and due date" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Customer Service", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify manager" },
        jobNimbus: { trigger: "Status Change — Changed to Customer Service", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Notify manager" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Customer Service", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Issue acknowledgement to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Customer Service", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Issue acknowledgement to homeowner" }
      },
      {
        when: "After 3 Days — Unresolved",
        accuLynx: { trigger: "Milestones — Changed to Status: Customer Service — After 3 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Follow-up until resolved (recurring)" },
        jobNimbus: { trigger: "Time-Based — 3 days after Customer Service status", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Follow-up until resolved (recurring)" }
      }
    ],
    exitStep: {
      when: "Issue Resolved",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Reviews & Referrals" },
      jobNimbus: { trigger: "Task Completion — Issue resolved", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Reviews & Referrals" }
    },
    automations: [],
    commonFailurePoint: "Customer issues are handled casually and then forgotten.",
    roofSmartrSupport: "RoofSmartr can help track customer service follow-ups, keep notes updated, and make sure unresolved issues do not disappear."
  },

  {
    id: "accounts-receivable",
    name: "Accounts Receivable",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 25, y: 2285, w: 215, h: 56,
    useSimplifiedDrawer: true,
    goal: "Follow up on open balances until all payments are received.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Accounts Receivable", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Payment follow-up (verify deductible, depreciation, supplement, upgrade, and final balance)" },
        jobNimbus: { trigger: "Status Change — Changed to Accounts Receivable", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Payment follow-up (verify deductible, depreciation, supplement, upgrade, and final balance)" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Accounts Receivable", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Payment reminder to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Accounts Receivable", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Payment reminder to homeowner" }
      },
      {
        when: "After 14 Days — Overdue",
        accuLynx: { trigger: "Milestones — Changed to Status: Accounts Receivable — After 14 days", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Escalate to manager" },
        jobNimbus: { trigger: "Time-Based — 14 days after Accounts Receivable status", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Escalate to manager" }
      }
    ],
    exitStep: {
      when: "Balance Paid",
      accuLynx: { trigger: "Financial — Payment received", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Paid in Full (or Debt Collection if overdue)" },
      jobNimbus: { trigger: "Task Completion — Payment confirmed", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Paid in Full (or Debt Collection if overdue)" }
    },
    automations: [],
    commonFailurePoint: "Final payments, depreciation checks, and deductibles are not followed up on consistently.",
    roofSmartrSupport: "RoofSmartr can follow up on final payments politely and persistently until the money lands, based on the client's process."
  },

  {
    id: "paid-in-full",
    name: "Paid in Full?",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "decision",
    hasSupport: false,
    x: 25, y: 2385, w: 200, h: 50,
    useSimplifiedDrawer: true,
    goal: "Confirm the financial file is fully closed before warranty and final closeout.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Paid in Full", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Verify checklist: all financial fields confirmed and balance is zero" },
        jobNimbus: { trigger: "Status Change — Changed to Paid in Full", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Verify checklist: all financial fields confirmed and balance is zero" }
      },
      {
        when: "Payment Confirmed",
        accuLynx: { trigger: "Financial — Payment received", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify office that job is paid in full" },
        jobNimbus: { trigger: "Task Completion — Final payment recorded", conditions: "Job Type: Any, Work Type: Any", action: "Create a Task — Notify office that job is paid in full" }
      }
    ],
    exitStep: {
      when: "Balance Confirmed as Zero",
      accuLynx: { trigger: "Financial — Payment received", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Send Warranty (or Debt Collection if overdue)" },
      jobNimbus: { trigger: "Task Completion — Final payment recorded", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Send Warranty (or Debt Collection if overdue)" }
    },
    automations: [],
    commonFailurePoint: "Warranties are sent before payment is confirmed, or paid jobs never get fully closed out.",
    roofSmartrSupport: null
  },

  {
    id: "send-warranty",
    name: "Send Warranty",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 13, y: 2485, w: 180, h: 56,
    useSimplifiedDrawer: true,
    goal: "Register and deliver warranty documents as the final step before closing the job.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Send Warranty", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Register manufacturer warranty and prepare closeout packet" },
        jobNimbus: { trigger: "Status Change — Changed to Send Warranty", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Register manufacturer warranty and prepare closeout packet" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Send Warranty", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Warranty and closeout packet delivery to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Send Warranty", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Warranty and closeout packet delivery to homeowner" }
      },
      {
        when: "Documents Sent",
        accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Upload manufacturer and workmanship warranty documents to CRM" },
        jobNimbus: { trigger: "Task Completion — Warranty documents uploaded", conditions: "Job Type: Any, Work Type: Any", action: "Upload manufacturer and workmanship warranty documents to CRM" }
      }
    ],
    exitStep: {
      when: "Warranty Sent and Uploaded",
      accuLynx: { trigger: "Job — Document uploaded", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Past Customer Campaign" },
      jobNimbus: { trigger: "Task Completion — Warranty documents uploaded", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Past Customer Campaign" }
    },
    automations: [],
    commonFailurePoint: "Warranty documents are forgotten after the money is collected.",
    roofSmartrSupport: "RoofSmartr can register warranties when required, issue workmanship warranty documents, send the final closeout packet, and update the CRM."
  },

  {
    id: "debt-collection",
    name: "Debt Collection",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 37, y: 2485, w: 175, h: 56,
    useSimplifiedDrawer: true,
    goal: "Document all collection attempts and work to resolve the overdue balance.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Debt Collection", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Collection review assigned to manager or owner" },
        jobNimbus: { trigger: "Status Change — Changed to Debt Collection", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Collection review assigned to manager or owner" }
      },
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Debt Collection", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Notify manager" },
        jobNimbus: { trigger: "Status Change — Changed to Debt Collection", conditions: "Job Type: Any, Work Type: Any", action: "Create Task — Notify manager" }
      },
      {
        when: "After Manager Approval",
        accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Final payment reminder to homeowner" },
        jobNimbus: { trigger: "Task Completion — Manager approved outreach", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Final payment reminder to homeowner" }
      }
    ],
    exitStep: {
      when: "Payment Received",
      accuLynx: { trigger: "Financial — Payment received", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Paid in Full" },
      jobNimbus: { trigger: "Task Completion — Payment confirmed", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Paid in Full" }
    },
    automations: [],
    commonFailurePoint: "Overdue accounts sit with no documented follow-up process.",
    roofSmartrSupport: "RoofSmartr can help follow up on overdue balances and document collection attempts. Legal action, write-offs, or formal collection decisions stay with the roofing company."
  },

  {
    id: "past-customer-campaign",
    name: "Past Customer Campaign",
    category: "Post-Sale",
    path: "Post-Sale",
    type: "stage",
    hasSupport: true,
    x: 13, y: 2585, w: 245, h: 56,
    useSimplifiedDrawer: true,
    goal: "Turn completed jobs into future revenue through seasonal outreach and referrals.",
    steps: [
      {
        when: "On Status Change",
        accuLynx: { trigger: "Milestones — Changed to Status: Past Customer Campaign", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Thank-you message to homeowner" },
        jobNimbus: { trigger: "Status Change — Changed to Past Customer Campaign", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Thank-you message to homeowner" }
      },
      {
        when: "Seasonal — Storm Season / Spring",
        accuLynx: { trigger: "Milestones — Changed to Status: Past Customer Campaign — After 6 months", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Seasonal check-in and storm-season outreach" },
        jobNimbus: { trigger: "Time-Based — 6 months after Past Customer Campaign status", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Seasonal check-in and storm-season outreach" }
      },
      {
        when: "Annual",
        accuLynx: { trigger: "Milestones — Changed to Status: Past Customer Campaign — After 12 months", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Send Email/Text — Annual roof check reminder and referral request" },
        jobNimbus: { trigger: "Time-Based — 12 months after Past Customer Campaign status", conditions: "Job Type: Any, Work Type: Any", action: "Send Email/Text — Annual roof check reminder and referral request" }
      }
    ],
    exitStep: {
      when: "Customer Responds",
      accuLynx: { trigger: "Job — Task Completed", conditions: "Job Category: Any, Job Trade Type: Any, Job Work Type: Any", action: "Create a Task — Change Status to Hot Lead" },
      jobNimbus: { trigger: "Task Completion — Customer response logged", conditions: "Job Type: Any, Work Type: Any", action: "Change Status to Hot Lead" }
    },
    automations: [],
    commonFailurePoint: "Past customers are ignored after the job is closed.",
    roofSmartrSupport: "RoofSmartr can help manage past customer campaigns, storm-season outreach, referral requests, and reactivation follow-up."
  }
];

// ─────────────────────────────────────────────
// DECISION LABELS
// ─────────────────────────────────────────────
const decisionLabels = [
  { text: "no",  kind: "no",  x: 11.6, y: 900  },
  { text: "yes", kind: "yes", x: 23.5, y: 969  },
  { text: "yes", kind: "yes", x: 10.5, y: 1605 },
  { text: "No",  kind: "no",  x: 26.5, y: 1660 },
  { text: "yes", kind: "yes", x: 11.5, y: 2125 },
  { text: "No",  kind: "no",  x: 35.5, y: 2125 },
  { text: "yes", kind: "yes", x: 11.5, y: 2435 },
  { text: "No",  kind: "no",  x: 35.5, y: 2435 }
];

// ─────────────────────────────────────────────
// DOM REFERENCES
// ─────────────────────────────────────────────
const desktopNodes    = document.querySelector("#desktopNodes");
const mobileStageList = document.querySelector("#mobileStageList");
const drawer          = document.querySelector("#stageDrawer");
const backdrop        = document.querySelector("#drawerBackdrop");
const closeButton     = document.querySelector("#drawerClose");
const crmButtons      = document.querySelectorAll("[data-crm]");
let activeCrm = "jobNimbus";

const groupedStages = [
  ["Leads",          stages.filter(s => s.path === "Leads")],
  ["Insurance Path", stages.filter(s => s.path === "Insurance Path")],
  ["Production",     stages.filter(s => s.path === "Production")],
  ["Post-Sale",      stages.filter(s => s.path === "Post-Sale")]
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function categoryClass(stage) {
  if (stage.category === "Production") return "production";
  if (stage.category === "Post-Sale")  return "post-sale";
  if (stage.category === "Leads")      return "leads";
  return "pre-sale";
}

// ─────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────
function createStageButton(stage, mobile = false) {
  if (stage.role === "category") {
    const cat = document.createElement("div");
    cat.dataset.stageId = stage.id;
    cat.className = `map-category ${categoryClass(stage)}`;
    cat.style.setProperty("--x", stage.x);
    cat.style.setProperty("--y", `${stage.y}px`);
    cat.style.setProperty("--w", `${stage.w}px`);
    cat.textContent = stage.name;
    return cat;
  }

  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.stageId = stage.id;

  if (mobile) {
    btn.className = `mobile-card ${categoryClass(stage)} ${stage.type === "decision" ? "decision" : ""}`;
    btn.style.setProperty("--node-color",
      stage.category === "Production" ? "var(--coral)"  :
      stage.category === "Post-Sale"  ? "var(--lime)"   :
      stage.category === "Leads"      ? "var(--yellow)" : "var(--teal)");
    btn.innerHTML = `<span>${stage.name}${stage.hasSupport ? ' <img src="/logo-transparent.png" class="support-icon" alt="Back Office Supported">' : ""}<span class="meta">${stage.category} · ${stage.type === "decision" ? "Decision Point" : stage.path}</span></span><span aria-hidden="true">›</span>`;
  } else {
    btn.className = `map-node ${categoryClass(stage)} ${stage.type === "decision" ? "decision" : ""} ${stage.w < 160 ? "small" : ""}`;
    btn.style.setProperty("--x", stage.x);
    btn.style.setProperty("--y", `${stage.y}px`);
    btn.style.setProperty("--w", `${stage.w}px`);
    btn.style.setProperty("--h", `${stage.h}px`);
    btn.innerHTML = `${stage.name}${stage.hasSupport ? ' <img src="/logo-transparent.png" class="support-icon" alt="Back Office Supported">' : ""}`;
  }

  btn.addEventListener("click", () => openStage(stage.id));
  return btn;
}

function renderDesktopMap() {
  stages.forEach(stage => desktopNodes.appendChild(createStageButton(stage)));
  decisionLabels.forEach(label => {
    const pill = document.createElement("span");
    pill.className = `decision-label ${label.kind}`;
    pill.textContent = label.text;
    pill.style.left = `${label.x}%`;
    pill.style.top  = `${label.y}px`;
    desktopNodes.appendChild(pill);
  });
}

function renderMobileList() {
  groupedStages.forEach(([groupName, groupStages]) => {
    const group = document.createElement("section");
    group.className = "mobile-group";
    group.innerHTML = `<h2>${groupName}</h2><div class="mobile-card-grid"></div>`;
    const grid = group.querySelector(".mobile-card-grid");
    groupStages
      .filter(s => s.role !== "category")
      .forEach(s => grid.appendChild(createStageButton(s, true)));
    mobileStageList.appendChild(group);
  });
}

// ─────────────────────────────────────────────
// DRAWER
// ─────────────────────────────────────────────
function renderAutomations(automations) {
  const container = document.querySelector("#drawerAutomations");
  container.innerHTML = "";
  if (!automations || !automations.length) return;

  automations.forEach(auto => {
    const crmData = activeCrm === "jobNimbus" ? auto.jobNimbus : auto.accuLynx;
    const card = document.createElement("div");
    card.className = "automation-card";
    card.innerHTML = `
      <div class="automation-type-badge">${auto.type}</div>
      <p class="automation-goal">${auto.goal}</p>
      ${crmData ? `<div class="automation-detail">
        <span class="automation-method">${crmData.method}</span>
        <span class="automation-setup">${crmData.setup}</span>
      </div>` : ""}
    `;
    container.appendChild(card);
  });
}

function renderSimplifiedDrawer(stage) {
  document.querySelector("#drawerGoal").textContent = stage.goal || "";

  const list = document.querySelector("#touchList");
  list.innerHTML = "";
  (stage.steps || []).forEach(step => {
    const data = activeCrm === "jobNimbus" ? step.jobNimbus : step.accuLynx;
    const li = document.createElement("li");
    li.className = "touch-item";
    li.innerHTML = `
      <span class="touch-when">${step.when}</span>
      <div class="touch-steps">
        <div class="touch-step"><span class="step-num">1</span><span class="step-label">Trigger</span><span class="step-val">${data.trigger}</span></div>
        <div class="touch-step"><span class="step-num">2</span><span class="step-label">Conditions</span><span class="step-val">${data.conditions}</span></div>
        <div class="touch-step"><span class="step-num">3</span><span class="step-label">Action</span><span class="step-val">${data.action}</span></div>
      </div>
    `;
    list.appendChild(li);
  });

  const exitBlock = document.querySelector("#exitBlock");
  if (stage.exitStep) {
    const ed = activeCrm === "jobNimbus" ? stage.exitStep.jobNimbus : stage.exitStep.accuLynx;
    exitBlock.innerHTML = `
      <h4 class="exit-heading">Exit Automation</h4>
      <div class="exit-item">
        <span class="exit-when">${stage.exitStep.when}</span>
        <div class="touch-steps">
          <div class="touch-step"><span class="step-num">1</span><span class="step-label">Trigger</span><span class="step-val">${ed.trigger}</span></div>
          <div class="touch-step"><span class="step-num">2</span><span class="step-label">Conditions</span><span class="step-val">${ed.conditions}</span></div>
          <div class="touch-step"><span class="step-num">3</span><span class="step-label">Action</span><span class="step-val">${ed.action}</span></div>
        </div>
      </div>
    `;
  } else {
    exitBlock.innerHTML = "";
  }
}

function openStage(stageId) {
  const stage = stages.find(s => s.id === stageId);
  if (!stage) return;

  // Highlight active node
  document.querySelectorAll("[data-stage-id]").forEach(node => {
    node.classList.toggle("is-active", node.dataset.stageId === stageId);
  });

  // Header
  document.querySelector("#drawerCategory").textContent =
    `${stage.category} · ${stage.type === "decision" ? "Decision Point" : "Pipeline Stage"}`;
  document.querySelector("#drawerTitle").textContent = stage.name;
  document.querySelector("#drawerPath").textContent  = stage.path;

  const supportBadge = document.querySelector("#drawerSupportBadge");
  supportBadge.innerHTML = stage.hasSupport ? '<img src="/logo-transparent.png" class="support-icon" alt=""> Back Office Supported' : "";
  supportBadge.classList.toggle("is-hidden", !stage.hasSupport);

  // CRM toggle state
  crmButtons.forEach(btn => {
    const sel = btn.dataset.crm === activeCrm;
    btn.classList.toggle("is-selected", sel);
    btn.setAttribute("aria-pressed", String(sel));
  });

  if (stage.useSimplifiedDrawer) {
    // Simplified view: only CRM toggle + goal + steps + exit
    document.querySelector("#drawerPurposePanel").classList.add("is-hidden");
    document.querySelector("#simplifiedSection").classList.remove("is-hidden");
    document.querySelector("#standardAutomationsSection").classList.add("is-hidden");
    document.querySelector("#failureSection").classList.add("is-hidden");
    document.querySelector("#drawerSupportPanel").classList.add("is-hidden");
    document.querySelector("#ctaSection").classList.add("is-hidden");
    renderSimplifiedDrawer(stage);
  } else {
    // Standard view
    document.querySelector("#drawerPurposePanel").classList.remove("is-hidden");
    document.querySelector("#simplifiedSection").classList.add("is-hidden");
    document.querySelector("#standardAutomationsSection").classList.remove("is-hidden");
    document.querySelector("#failureSection").classList.remove("is-hidden");
    document.querySelector("#ctaSection").classList.remove("is-hidden");
    document.querySelector("#drawerSupportPanel").classList.toggle("is-hidden", !stage.hasSupport);
    document.querySelector("#drawerPurpose").textContent = stage.stagePurpose || "";
    renderAutomations(stage.automations || []);
    document.querySelector("#drawerFailure").textContent = stage.commonFailurePoint || "";
    document.querySelector("#drawerSupport").textContent = stage.roofSmartrSupport || "";
  }

  // Open drawer
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.classList.remove("drawer-open");
  document.querySelectorAll("[data-stage-id]").forEach(n => n.classList.remove("is-active"));
}

// ─────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────
closeButton.addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);

crmButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    activeCrm = btn.dataset.crm;
    crmButtons.forEach(b => {
      b.classList.toggle("is-selected", b.dataset.crm === activeCrm);
      b.setAttribute("aria-pressed", String(b.dataset.crm === activeCrm));
    });
    const activeStage = stages.find(s =>
      document.querySelector(`[data-stage-id="${s.id}"]`)?.classList.contains("is-active")
    );
    if (activeStage) {
      if (activeStage.useSimplifiedDrawer) {
        renderSimplifiedDrawer(activeStage);
      } else {
        renderAutomations(activeStage.automations || []);
      }
    }
  });
});

document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
renderDesktopMap();
renderMobileList();
