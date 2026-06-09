import { useState } from 'react'
import CompanyForm from './CompanyForm.jsx'
import { companyProfileComplete } from '../sopConfig.js'

export default function Settings({ data, setField, errors, onDone }) {
  const [saved, setSaved] = useState(false)
  const ready = companyProfileComplete(data)
  return (
    <div className="settings">
      <div className="dash-hero"><div><h1>Settings</h1><p>Your company profile. Changes here update how every service runs.</p></div></div>
      <div className="section">
        <div className="section-header"><div className="section-number">⚙</div><h2>Company Profile</h2></div>
        <div className="section-body">
          <CompanyForm data={data} setField={setField} errors={errors} />
        </div>
      </div>
      <div className="save-bar">
        <span>{saved ? 'Settings saved ✓' : (ready ? 'Changes apply to every service.' : 'Complete all three sections to save.')}</span>
        <button className="btn-save" type="button" disabled={!ready} onClick={() => { setSaved(true); setTimeout(() => onDone && onDone(), 700) }}>Save settings</button>
      </div>
    </div>
  )
}
