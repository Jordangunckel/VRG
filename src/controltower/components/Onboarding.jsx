import CompanyForm from './CompanyForm.jsx'
import { companyProfileComplete } from '../sopConfig.js'

// First-login gate: collect the company profile before the dashboard opens.
export default function Onboarding({ data, setField, errors, onComplete }) {
  const ready = companyProfileComplete(data)
  return (
    <div className="onboarding">
      <div className="onboarding-head">
        <div className="wordmark"><span>Roof</span><span className="wm-teal">Smartr</span></div>
        <h1>Welcome to your Control Tower</h1>
        <p>First, tell us about your company. This sets up how we run every service for you, and you can change it anytime under Settings.</p>
      </div>
      <div className="section">
        <div className="section-header"><div className="section-number">1</div><h2>Company Profile</h2></div>
        <div className="section-body">
          <CompanyForm data={data} setField={setField} errors={errors} />
        </div>
      </div>
      <div className="save-bar">
        <span>{ready ? 'All three sections are complete. You are ready.' : 'Complete all three sections to enter your dashboard.'}</span>
        <button className="btn-save" type="button" disabled={!ready} onClick={onComplete}>Enter my Control Tower →</button>
      </div>
    </div>
  )
}
