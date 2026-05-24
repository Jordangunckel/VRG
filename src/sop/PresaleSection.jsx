import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  AutoOrManual, CRMTriggerInput, ManualNotice,
  FrequencyField, SubSection, InfoNote,
} from './shared.jsx'

function AutoManualBlock({ prefix, data, setField, errors, automaticContent }) {
  return (
    <>
      <AutoOrManual
        name={`${prefix}Identification`}
        value={data[`${prefix}Identification`]}
        onChange={v => setField(`${prefix}Identification`, v)}
      />

      <ShowIf when={data[`${prefix}Identification`] === 'automatic'}>
        <SubSection>
          <CRMTriggerInput
            value={data[`${prefix}CRMTrigger`]}
            onChange={v => setField(`${prefix}CRMTrigger`, v)}
          />
          {automaticContent}
        </SubSection>
      </ShowIf>

      <ShowIf when={data[`${prefix}Identification`] === 'manual'}>
        <ManualNotice
          agreed={data[`${prefix}ManualAgree`]}
          onAgree={v => setField(`${prefix}ManualAgree`, v)}
          errorMsg={errors?.[`${prefix}ManualAgree`]}
        />
      </ShowIf>
    </>
  )
}

export default function PresaleSection({ data, setField, errors }) {
  return (
    <div className="section">
      <SectionHeader number="3" title="Presale" />
      <div className="section-body">

        {/* ── SERVICE: Adjuster Appointment Coordination ── */}
        <ServiceCard title="Adjuster Appointment Coordination">

          <YesNo
            name="adjusterCoordination"
            value={data.adjusterCoordination}
            onChange={v => setField('adjusterCoordination', v)}
            question="Do you want Valley Ridge to coordinate adjuster appointments?"
          />

          <ShowIf when={data.adjusterCoordination === 'yes'}>
            <AutoManualBlock prefix="adjuster" data={data} setField={setField} errors={errors} />

            <InfoNote type="info">
              Once the CRM status is triggered (or manually assigned), Valley Ridge will continue to follow up
              with the Homeowner and Insurance Company until the appointment date and time is scheduled.
              Follow-up frequency: business day 3 — Homeowner receives a call; business day 5 — Valley Ridge
              reaches out to the Insurance Company.
            </InfoNote>

            <YesNo
              name="adjusterTimeWindow"
              value={data.adjusterTimeWindow}
              onChange={v => setField('adjusterTimeWindow', v)}
              question="Adjusters often set a 3-hour window. Do you want Valley Ridge to follow up with adjusters to get a narrowed time?"
            />

            <div>
              <span className="question-label">Once an appointment is scheduled, how should Valley Ridge assign it?</span>
              <div className="radio-group">
                {[
                  { value: 'sales-rep', label: 'Assigned to the Sales Rep' },
                  { value: 'team-members', label: 'Assigned to certain team members' },
                  { value: 'custom', label: 'Custom Logic' },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="adjusterAssignment" value={opt.value}
                      checked={data.adjusterAssignment === opt.value}
                      onChange={() => setField('adjusterAssignment', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">{opt.label}</span>
                  </label>
                ))}
              </div>
              <ShowIf when={data.adjusterAssignment === 'custom'}>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Describe custom assignment logic</label>
                  <input type="text" value={data.adjusterAssignmentCustom}
                    onChange={e => setField('adjusterAssignmentCustom', e.target.value)}
                    placeholder="e.g. Assign to project manager on file…" />
                </div>
              </ShowIf>
            </div>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Scope of Loss Follow-Up ── */}
        <ServiceCard title="Scope of Loss Follow-Up">

          <YesNo
            name="scopeFollowUp"
            value={data.scopeFollowUp}
            onChange={v => setField('scopeFollowUp', v)}
            question="Do you want Valley Ridge to follow up on scope of loss?"
          />

          <ShowIf when={data.scopeFollowUp === 'yes'}>
            <AutoManualBlock
              prefix="scope"
              data={data}
              setField={setField}
              errors={errors}
              automaticContent={
                <FrequencyField
                  name="scopeFrequency"
                  value={data.scopeFrequency}
                  onChange={v => setField('scopeFrequency', v)}
                  customValue={data.scopeFrequencyCustom}
                  onCustomChange={v => setField('scopeFrequencyCustom', v)}
                  question="Scope Follow-Up Frequency"
                  options={[
                    { value: 'weekly', label: 'Weekly', recommended: true },
                    { value: 'custom', label: 'Custom' },
                  ]}
                />
              }
            />
            <ShowIf when={data.scopeIdentification === 'manual'}>
              <FrequencyField
                name="scopeFrequency"
                value={data.scopeFrequency}
                onChange={v => setField('scopeFrequency', v)}
                customValue={data.scopeFrequencyCustom}
                onCustomChange={v => setField('scopeFrequencyCustom', v)}
                question="Scope Follow-Up Frequency"
                options={[
                  { value: 'weekly', label: 'Weekly', recommended: true },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
            </ShowIf>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Supplement Follow-Up ── */}
        <ServiceCard title="Supplement Follow-Up">

          <YesNo
            name="supplementFollowUp"
            value={data.supplementFollowUp}
            onChange={v => setField('supplementFollowUp', v)}
            question="Do you want Valley Ridge to follow up on supplements?"
          />

          <ShowIf when={data.supplementFollowUp === 'yes'}>
            <AutoManualBlock
              prefix="supplement"
              data={data}
              setField={setField}
              errors={errors}
              automaticContent={
                <FrequencyField
                  name="supplementFrequency"
                  value={data.supplementFrequency}
                  onChange={v => setField('supplementFrequency', v)}
                  customValue={data.supplementFrequencyCustom}
                  onCustomChange={v => setField('supplementFrequencyCustom', v)}
                  question="Supplement Follow-Up Frequency"
                  options={[
                    { value: 'weekly', label: 'Weekly', recommended: true },
                    { value: 'custom', label: 'Custom' },
                  ]}
                />
              }
            />
            <ShowIf when={data.supplementIdentification === 'manual'}>
              <FrequencyField
                name="supplementFrequency"
                value={data.supplementFrequency}
                onChange={v => setField('supplementFrequency', v)}
                customValue={data.supplementFrequencyCustom}
                onCustomChange={v => setField('supplementFrequencyCustom', v)}
                question="Supplement Follow-Up Frequency"
                options={[
                  { value: 'weekly', label: 'Weekly', recommended: true },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
            </ShowIf>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Measurements ── */}
        <ServiceCard title="Measurements">

          <YesNo
            name="measurements"
            value={data.measurements}
            onChange={v => setField('measurements', v)}
            question="Do you want Valley Ridge to order measurements?"
          />

          <ShowIf when={data.measurements === 'yes'}>
            <AutoManualBlock prefix="measurements" data={data} setField={setField} errors={errors} />

            <div>
              <span className="question-label">Preferred Measurement Provider</span>
              <div className="radio-group">
                {['EagleView', 'Roofr', 'GAF QuickMeasure', 'Hover', 'Other'].map(opt => (
                  <label key={opt} className="radio-option">
                    <input type="radio" name="measurementsProvider" value={opt}
                      checked={data.measurementsProvider === opt}
                      onChange={() => setField('measurementsProvider', opt)} />
                    <span className="radio-dot" />
                    <span className="radio-label">{opt}</span>
                  </label>
                ))}
              </div>
              <ShowIf when={data.measurementsProvider === 'Other'}>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Measurement Provider (Other)</label>
                  <input type="text" value={data.measurementsProviderOther}
                    onChange={e => setField('measurementsProviderOther', e.target.value)}
                    placeholder="Provider name" />
                </div>
              </ShowIf>
            </div>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Estimates ── */}
        <ServiceCard title="Estimates">

          <YesNo
            name="estimates"
            value={data.estimates}
            onChange={v => setField('estimates', v)}
            question="Do you want Valley Ridge to create estimates?"
          />

          <ShowIf when={data.estimates === 'yes'}>
            <AutoManualBlock prefix="estimates" data={data} setField={setField} errors={errors} />

            <div>
              <span className="question-label">Estimate Delivery Preference</span>
              <div className="radio-group">
                {[
                  { value: 'draft-only', label: 'Create Draft Only' },
                  { value: 'notify-rep', label: 'Create and Notify Rep', recommended: true },
                  { value: 'send-homeowner', label: 'Create and Send to Homeowner' },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="estimatesDelivery" value={opt.value}
                      checked={data.estimatesDelivery === opt.value}
                      onChange={() => setField('estimatesDelivery', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">
                      {opt.label}
                      {opt.recommended && <span className="rec">(Recommended)</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </ShowIf>
        </ServiceCard>

      </div>
    </div>
  )
}
