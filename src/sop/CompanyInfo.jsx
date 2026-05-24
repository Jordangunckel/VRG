import { SectionHeader } from './shared.jsx'

export default function CompanyInfo({ data, setField }) {
  return (
    <div className="section">
      <SectionHeader number="1" title="Company Information" />
      <div className="section-body">
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
