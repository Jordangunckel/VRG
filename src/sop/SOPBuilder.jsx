import { useState } from 'react'
import './sop.css'
import CompanyInfo from './CompanyInfo.jsx'
import LeadsSection from './LeadsSection.jsx'
import PresaleSection from './PresaleSection.jsx'
import ProductionSection from './ProductionSection.jsx'
import PostSaleSection from './PostSaleSection.jsx'

const INITIAL = {
  // Company Info
  companyName: '', mainContact: '', preferredCommunication: '', avgJobsMonthly: '',
  crmUsed: '', crmUsedOther: '', primaryCustomerBase: '', primaryProjectType: '',
  serviceArea: '', businessHours: '', emergencyContact: '',

  // Leads – Lead Follow-Up
  leadFollowUp: '', leadFollowUpIdentification: '', leadFollowUpCRMTrigger: '',
  leadFollowUpFrequency: '', leadFollowUpFrequencyCustom: '', leadFollowUpManualAgree: false,
  lostLeadFollowUp: '', lostLeadFrequency: '', lostLeadFrequencyCustom: '',

  // Leads – Storm Ready Outreach
  stormReady: false, stormReadyArea: null, stormLeadAssignment: '',
  stormLeadAssignmentMethod: '', stormLeadAssignmentMethodCustom: '', stormManualAssignee: '',

  // Presale – Adjuster
  adjusterCoordination: '', adjusterIdentification: '', adjusterCRMTrigger: '',
  adjusterManualAgree: false, adjusterTimeWindow: '', adjusterAssignment: '', adjusterAssignmentCustom: '',

  // Presale – Scope
  scopeFollowUp: '', scopeIdentification: '', scopeCRMTrigger: '',
  scopeManualAgree: false, scopeFrequency: '', scopeFrequencyCustom: '',

  // Presale – Supplement
  supplementFollowUp: '', supplementIdentification: '', supplementCRMTrigger: '',
  supplementManualAgree: false, supplementFrequency: '', supplementFrequencyCustom: '',

  // Presale – Measurements
  measurements: '', measurementsIdentification: '', measurementsCRMTrigger: '',
  measurementsManualAgree: false, measurementsProvider: '', measurementsProviderOther: '',

  // Presale – Estimates
  estimates: '', estimatesIdentification: '', estimatesCRMTrigger: '',
  estimatesManualAgree: false, estimatesDelivery: '',

  // Production – Material Orders
  materialOrders: '', materialIdentification: '', materialCRMTrigger: '',
  materialManualAgree: false, materialAction: '', materialSupplier: '', materialSupplierOther: '',

  // Production – Permits
  permits: '', permitsIdentification: '', permitsManualAgree: false,

  // Post Sale – Financial Worksheet
  financialWorksheet: '', financialIdentification: '', financialCRMTrigger: '', financialManualAgree: false,

  // Post Sale – COC & Invoices
  cocInvoices: '', cocRecipient: '',

  // Post Sale – Final Payment
  finalPayment: '', finalPaymentFollowUpWith: '', finalPaymentFrequency: '', finalPaymentFrequencyCustom: '',

  // Post Sale – Warranties
  warranties: '', warrantyType: '',

  // Post Sale – Reviews & Referrals
  reviewsReferrals: '', reviewsTiming: '', reviewsMethods: [], reviewsFrequency: '', reviewsFrequencyCustom: '',

  // Post Sale – Thank You Gifts
  thankYouGifts: '', thankYouIdentification: '', thankYouIdentificationCustom: '',
  thankYouGiftType: '', thankYouGiftCustom: '',
}

function getRequiredAgreements(d) {
  const checks = []
  if (d.leadFollowUp === 'yes' && d.leadFollowUpIdentification === 'manual')
    checks.push({ field: 'leadFollowUpManualAgree', label: 'Lead Follow-Up – Manual Workflow Agreement' })
  if (d.adjusterCoordination === 'yes' && d.adjusterIdentification === 'manual')
    checks.push({ field: 'adjusterManualAgree', label: 'Adjuster Coordination – Manual Workflow Agreement' })
  if (d.scopeFollowUp === 'yes' && d.scopeIdentification === 'manual')
    checks.push({ field: 'scopeManualAgree', label: 'Scope of Loss – Manual Workflow Agreement' })
  if (d.supplementFollowUp === 'yes' && d.supplementIdentification === 'manual')
    checks.push({ field: 'supplementManualAgree', label: 'Supplement Follow-Up – Manual Workflow Agreement' })
  if (d.measurements === 'yes' && d.measurementsIdentification === 'manual')
    checks.push({ field: 'measurementsManualAgree', label: 'Measurements – Manual Workflow Agreement' })
  if (d.estimates === 'yes' && d.estimatesIdentification === 'manual')
    checks.push({ field: 'estimatesManualAgree', label: 'Estimates – Manual Workflow Agreement' })
  if (d.materialOrders === 'yes' && d.materialIdentification === 'manual')
    checks.push({ field: 'materialManualAgree', label: 'Material Orders – Manual Workflow Agreement' })
  if (d.permits === 'yes' && d.permitsIdentification === 'manual')
    checks.push({ field: 'permitsManualAgree', label: 'Permits – Manual Workflow Agreement' })
  if (d.financialWorksheet === 'yes' && d.financialIdentification === 'manual')
    checks.push({ field: 'financialManualAgree', label: 'Financial Worksheet – Manual Workflow Agreement' })
  return checks
}

function buildCleanOutput(d) {
  return {
    companyInformation: {
      companyName: d.companyName,
      mainContact: d.mainContact,
      preferredCommunication: d.preferredCommunication,
      avgJobsMonthly: d.avgJobsMonthly,
      crmUsed: d.crmUsed === 'Other' ? d.crmUsedOther || 'Other' : d.crmUsed,
      primaryCustomerBase: d.primaryCustomerBase,
      primaryProjectType: d.primaryProjectType,
      serviceArea: d.serviceArea,
      businessHours: d.businessHours,
      emergencyContact: d.emergencyContact,
    },
    leads: {
      leadFollowUp: {
        enabled: d.leadFollowUp === 'yes',
        ...(d.leadFollowUp === 'yes' && {
          identificationMethod: d.leadFollowUpIdentification,
          ...(d.leadFollowUpIdentification === 'automatic' && {
            crmStatusTrigger: d.leadFollowUpCRMTrigger,
            frequency: d.leadFollowUpFrequency === 'custom' ? d.leadFollowUpFrequencyCustom : d.leadFollowUpFrequency,
          }),
          lostLeadFollowUp: d.lostLeadFollowUp === 'yes',
          ...(d.lostLeadFollowUp === 'yes' && {
            lostLeadFrequency: d.lostLeadFrequency === 'custom' ? d.lostLeadFrequencyCustom : d.lostLeadFrequency,
          }),
        }),
      },
      stormReadyOutreach: {
        enabled: d.stormReady,
        ...(d.stormReady && {
          targetArea: d.stormReadyArea,
          leadAssignment: d.stormLeadAssignment,
          ...(d.stormLeadAssignment === 'valley-ridge' && {
            assignmentMethod: d.stormLeadAssignmentMethod === 'custom'
              ? d.stormLeadAssignmentMethodCustom
              : d.stormLeadAssignmentMethod,
          }),
          ...(d.stormLeadAssignment === 'manual' && { manualAssignee: d.stormManualAssignee }),
        }),
      },
    },
    presale: {
      adjusterAppointment: {
        enabled: d.adjusterCoordination === 'yes',
        ...(d.adjusterCoordination === 'yes' && {
          identificationMethod: d.adjusterIdentification,
          ...(d.adjusterIdentification === 'automatic' && { crmStatusTrigger: d.adjusterCRMTrigger }),
          narrowTimeWindow: d.adjusterTimeWindow === 'yes',
          appointmentAssignment: d.adjusterAssignment === 'custom'
            ? d.adjusterAssignmentCustom : d.adjusterAssignment,
        }),
      },
      scopeOfLoss: {
        enabled: d.scopeFollowUp === 'yes',
        ...(d.scopeFollowUp === 'yes' && {
          identificationMethod: d.scopeIdentification,
          ...(d.scopeIdentification === 'automatic' && { crmStatusTrigger: d.scopeCRMTrigger }),
          frequency: d.scopeFrequency === 'custom' ? d.scopeFrequencyCustom : d.scopeFrequency,
        }),
      },
      supplementFollowUp: {
        enabled: d.supplementFollowUp === 'yes',
        ...(d.supplementFollowUp === 'yes' && {
          identificationMethod: d.supplementIdentification,
          ...(d.supplementIdentification === 'automatic' && { crmStatusTrigger: d.supplementCRMTrigger }),
          frequency: d.supplementFrequency === 'custom' ? d.supplementFrequencyCustom : d.supplementFrequency,
        }),
      },
      measurements: {
        enabled: d.measurements === 'yes',
        ...(d.measurements === 'yes' && {
          identificationMethod: d.measurementsIdentification,
          ...(d.measurementsIdentification === 'automatic' && { crmStatusTrigger: d.measurementsCRMTrigger }),
          provider: d.measurementsProvider === 'Other' ? d.measurementsProviderOther || 'Other' : d.measurementsProvider,
        }),
      },
      estimates: {
        enabled: d.estimates === 'yes',
        ...(d.estimates === 'yes' && {
          identificationMethod: d.estimatesIdentification,
          ...(d.estimatesIdentification === 'automatic' && { crmStatusTrigger: d.estimatesCRMTrigger }),
          deliveryPreference: d.estimatesDelivery,
        }),
      },
    },
    production: {
      materialOrders: {
        enabled: d.materialOrders === 'yes',
        ...(d.materialOrders === 'yes' && {
          identificationMethod: d.materialIdentification,
          ...(d.materialIdentification === 'automatic' && { crmStatusTrigger: d.materialCRMTrigger }),
          actionAfterBuild: d.materialAction,
          supplier: d.materialSupplier === 'Other' ? d.materialSupplierOther || 'Other' : d.materialSupplier,
        }),
      },
      permits: {
        enabled: d.permits === 'yes',
        ...(d.permits === 'yes' && { identificationMethod: d.permitsIdentification }),
      },
    },
    postSale: {
      financialWorksheet: {
        enabled: d.financialWorksheet === 'yes',
        ...(d.financialWorksheet === 'yes' && {
          identificationMethod: d.financialIdentification,
          ...(d.financialIdentification === 'automatic' && { crmStatusTrigger: d.financialCRMTrigger }),
        }),
      },
      cocAndInvoices: {
        enabled: d.cocInvoices === 'yes',
        ...(d.cocInvoices === 'yes' && { cocRecipients: d.cocRecipient }),
      },
      finalPaymentFollowUp: {
        enabled: d.finalPayment === 'yes',
        ...(d.finalPayment === 'yes' && {
          followUpWith: d.finalPaymentFollowUpWith,
          frequency: d.finalPaymentFrequency === 'custom' ? d.finalPaymentFrequencyCustom : d.finalPaymentFrequency,
        }),
      },
      warranties: {
        enabled: d.warranties === 'yes',
        ...(d.warranties === 'yes' && { warrantyType: d.warrantyType }),
      },
      reviewsAndReferrals: {
        enabled: d.reviewsReferrals === 'yes',
        ...(d.reviewsReferrals === 'yes' && {
          timing: d.reviewsTiming,
          methods: d.reviewsMethods,
          frequency: d.reviewsFrequency === 'custom' ? d.reviewsFrequencyCustom : d.reviewsFrequency,
        }),
      },
      thankYouGifts: {
        enabled: d.thankYouGifts === 'yes',
        ...(d.thankYouGifts === 'yes' && {
          identification: d.thankYouIdentification === 'custom'
            ? d.thankYouIdentificationCustom : d.thankYouIdentification,
          giftType: d.thankYouGiftType === 'custom' ? d.thankYouGiftCustom : d.thankYouGiftType,
        }),
      },
    },
  }
}

export default function SOPBuilder({ onBack }) {
  const [formData, setFormData] = useState(INITIAL)
  const [savedOutput, setSavedOutput] = useState(null)
  const [errors, setErrors] = useState({})

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleSave = () => {
    const newErrors = {}
    if (formData.stormReady && !formData.stormReadyArea) {
      newErrors.stormReadyArea = 'Please draw your target outreach area on the map.'
    }
    const agreements = getRequiredAgreements(formData)
    agreements.forEach(({ field, label }) => {
      if (!formData[field]) {
        newErrors[field] = `You must agree to the manual workflow terms for: ${label}`
      }
    })
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTimeout(() => document.querySelector('.sop-root .error-border, .sop-root .map-required-badge')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
      return
    }
    setErrors({})
    setSavedOutput(buildCleanOutput(formData))
    setTimeout(() => document.getElementById('sop-json-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <div className="sop-root">
      {/* Page header — sits below the website navbar */}
      <div className="sop-page-header">
        <div className="sop-page-header-inner">
          <button className="sop-back-btn" onClick={onBack}>
            ← Back to Home
          </button>
          <div className="sop-header-content">
            <img src="/icon.png" alt="Valley Ridge Group" className="sop-header-logo" />
            <div>
              <h1 className="sop-header-title">SOP Builder</h1>
              <p className="sop-header-sub">Configure exactly how Valley Ridge handles each service for your roofing company.</p>
            </div>
          </div>
        </div>
      </div>

      <main className="sop-form-container">
        <CompanyInfo data={formData} setField={setField} />
        <LeadsSection data={formData} setField={setField} errors={errors} />
        <PresaleSection data={formData} setField={setField} errors={errors} />
        <ProductionSection data={formData} setField={setField} errors={errors} />
        <PostSaleSection data={formData} setField={setField} errors={errors} />

        {Object.keys(errors).length > 0 && (
          <div className="validation-errors">
            <strong>Please fix the following before saving:</strong>
            <ul>
              {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        )}

        <div className="save-bar">
          <span>
            {savedOutput ? 'SOP preferences saved below ↓' : 'Complete the form, then save your SOP preferences.'}
          </span>
          <button className="btn-save" type="button" onClick={handleSave}>
            Save SOP Preferences
          </button>
        </div>

        {savedOutput && (
          <div className="json-preview" id="sop-json-preview">
            <div className="json-preview-header">
              <h3>SOP Configuration Preview</h3>
              <span className="json-badge">Saved</span>
            </div>
            <pre>{JSON.stringify(savedOutput, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  )
}
