import { useRef } from 'react'
import { SectionHeader } from './shared.jsx'

// Resize uploaded image client-side before storing as base64
async function resizeLogo(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX_W = 500
      const MAX_H = 240
      let w = img.width
      let h = img.height
      const ratio = Math.min(MAX_W / w, MAX_H / h, 1)
      w = Math.round(w * ratio)
      h = Math.round(h * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/png', 0.88))
    }
    img.src = url
  })
}

export default function CompanyInfo({ data, setField }) {
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await resizeLogo(file)
    setField('companyLogo', resized)
    e.target.value = '' // reset so same file can be re-uploaded
  }

  return (
    <div className="section">
      <SectionHeader number="1" title="Company Information" />
      <div className="section-body">

        {/* ── Logo Upload ── */}
        <div className="logo-upload-row">
          <span className="question-label" style={{ marginBottom: 8 }}>Company Logo</span>

          {/* Hidden file input — triggered by both upload zone and Change button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {data.companyLogo ? (
            <div className="logo-preview-wrap">
              <img src={data.companyLogo} alt="Company logo" className="logo-preview-img" />
              <div className="logo-actions">
                <button
                  type="button"
                  className="logo-btn logo-btn-change"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Logo
                </button>
                <button
                  type="button"
                  className="logo-btn logo-btn-remove"
                  onClick={() => setField('companyLogo', '')}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              className="logo-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <span className="logo-upload-icon">🖼️</span>
              <div>
                <span className="logo-upload-label">Click to upload your logo</span>
                <span className="logo-upload-hint">PNG, JPG, or SVG recommended</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Fields Grid ── */}
        <div className="info-grid">

          <div className="field">
            <label>Company Name <span className="required">*</span></label>
            <input
              type="text"
              value={data.companyName}
              onChange={e => setField('companyName', e.target.value)}
              placeholder="Your company name"
            />
          </div>

          <div className="field">
            <label>Main Point of Contact</label>
            <input
              type="text"
              value={data.mainContact}
              onChange={e => setField('mainContact', e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="field">
            <label>Preferred Communication Method</label>
            <select
              value={data.preferredCommunication}
              onChange={e => setField('preferredCommunication', e.target.value)}
            >
              <option value="">Select…</option>
              <option>Email</option>
              <option>Text</option>
              <option>Phone</option>
              <option>Slack</option>
              <option>CRM Notes Only</option>
            </select>
          </div>

          <div className="field">
            <label>Average Number of Jobs Monthly</label>
            <input
              type="number"
              min="0"
              value={data.avgJobsMonthly}
              onChange={e => setField('avgJobsMonthly', e.target.value)}
              placeholder="e.g. 25"
            />
          </div>

          <div className="field">
            <label>CRM Used</label>
            <select
              value={data.crmUsed}
              onChange={e => setField('crmUsed', e.target.value)}
            >
              <option value="">Select…</option>
              <option>JobNimbus</option>
              <option>AccuLynx</option>
              <option>Other</option>
            </select>
          </div>

          {data.crmUsed === 'Other' && (
            <div className="field">
              <label>CRM Name (Other)</label>
              <input
                type="text"
                value={data.crmUsedOther}
                onChange={e => setField('crmUsedOther', e.target.value)}
                placeholder="Name of your CRM"
              />
            </div>
          )}

          <div className="field">
            <label>Primary Customer Base</label>
            <select
              value={data.primaryCustomerBase}
              onChange={e => setField('primaryCustomerBase', e.target.value)}
            >
              <option value="">Select…</option>
              <option>Insurance</option>
              <option>Retail</option>
              <option>Both</option>
            </select>
          </div>

          <div className="field">
            <label>Primary Project Type</label>
            <select
              value={data.primaryProjectType}
              onChange={e => setField('primaryProjectType', e.target.value)}
            >
              <option value="">Select…</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Both</option>
            </select>
          </div>

          <div className="field span-2">
            <label>Service Area</label>
            <input
              type="text"
              value={data.serviceArea}
              onChange={e => setField('serviceArea', e.target.value)}
              placeholder="e.g. Greater Dallas-Fort Worth, TX"
            />
          </div>

          <div className="field">
            <label>Business Hours</label>
            <input
              type="text"
              value={data.businessHours}
              onChange={e => setField('businessHours', e.target.value)}
              placeholder="e.g. Mon–Fri 8am–6pm"
            />
          </div>

          <div className="field">
            <label>Emergency Contact</label>
            <input
              type="text"
              value={data.emergencyContact}
              onChange={e => setField('emergencyContact', e.target.value)}
              placeholder="Name and phone number"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
