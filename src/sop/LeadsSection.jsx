import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  AutoOrManual, CRMTriggerInput, ManualNotice,
  FrequencyField, SubSection, InfoNote,
} from './shared.jsx'
import StormMapPicker from './StormMapPicker.jsx'

export default function LeadsSection({ data, setField, errors }) {
  return (
    <div className="section">
      <SectionHeader number="2" title="Leads" />
      <div className="section-body">

        {/* ── SERVICE: Lead Follow-Up ── */}
        <ServiceCard title="Lead Follow-Up">

          <YesNo
            name="leadFollowUp"
            value={data.leadFollowUp}
            onChange={v => setField('leadFollowUp', v)}
            question="Do you want Valley Ridge to follow up with leads?"
          />

          <ShowIf when={data.leadFollowUp === 'yes'}>
            <AutoOrManual
              name="leadFollowUpIdentification"
              value={data.leadFollowUpIdentification}
              onChange={v => setField('leadFollowUpIdentification', v)}
              question="How should Valley Ridge identify leads needing follow-up?"
            />

            <ShowIf when={data.leadFollowUpIdentification === 'automatic'}>
              <SubSection>
                <CRMTriggerInput
                  value={data.leadFollowUpCRMTrigger}
                  onChange={v => setField('leadFollowUpCRMTrigger', v)}
                />
                <FrequencyField
                  name="leadFollowUpFrequency"
                  value={data.leadFollowUpFrequency}
                  onChange={v => setField('leadFollowUpFrequency', v)}
                  customValue={data.leadFollowUpFrequencyCustom}
                  onCustomChange={v => setField('leadFollowUpFrequencyCustom', v)}
                  question="Lead Follow-Up Frequency"
                  options={[
                    {
                      value: 'vrg-default',
                      label: 'Every other day for 1 week, then 2x/week, then weekly, then monthly until told to stop',
                      recommended: true,
                    },
                    { value: 'custom', label: 'Custom Logic' },
                  ]}
                />
              </SubSection>
            </ShowIf>

            <ShowIf when={data.leadFollowUpIdentification === 'manual'}>
              <ManualNotice
                agreed={data.leadFollowUpManualAgree}
                onAgree={v => setField('leadFollowUpManualAgree', v)}
                errorMsg={errors?.leadFollowUpManualAgree}
              />
            </ShowIf>

            <YesNo
              name="lostLeadFollowUp"
              value={data.lostLeadFollowUp}
              onChange={v => setField('lostLeadFollowUp', v)}
              question="Should Valley Ridge follow up with lost status leads?"
            />

            <ShowIf when={data.lostLeadFollowUp === 'yes'}>
              <SubSection>
                <FrequencyField
                  name="lostLeadFrequency"
                  value={data.lostLeadFrequency}
                  onChange={v => setField('lostLeadFrequency', v)}
                  customValue={data.lostLeadFrequencyCustom}
                  onCustomChange={v => setField('lostLeadFrequencyCustom', v)}
                  question="Lost Status Lead Follow-Up Frequency"
                  options={[
                    { value: 'monthly', label: 'Once a month', recommended: true },
                    { value: 'custom', label: 'Custom Logic' },
                  ]}
                />
              </SubSection>
            </ShowIf>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Storm Ready Outreach ── */}
        <ServiceCard title="Storm Ready Outreach">

          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Storm Ready Outreach</h4>
              <p>Proactive cold-call lead generation in storm-affected areas</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.stormReady}
                onChange={e => setField('stormReady', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <ShowIf when={data.stormReady}>
            <InfoNote type="orange">
              <strong>Billing Notice:</strong> Storm Ready Outreach is billed at <strong>$400 per lead generated that converts to sold</strong>.
            </InfoNote>

            <div>
              <span className="question-label">
                Target Calling Area <span style={{ color: 'var(--red)', fontWeight: 700 }}>*</span>
              </span>
              <p className="field-hint" style={{ marginBottom: 8 }}>
                Draw a polygon, rectangle, or circle on the map to define the outreach area.
              </p>
              <StormMapPicker
                value={data.stormReadyArea}
                onChange={v => setField('stormReadyArea', v)}
                hasError={!!errors?.stormReadyArea}
              />
            </div>

            <div>
              <span className="question-label">Do you want Valley Ridge to assign leads, or will you manually assign them?</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="stormLeadAssignment" value="valley-ridge"
                    checked={data.stormLeadAssignment === 'valley-ridge'}
                    onChange={() => setField('stormLeadAssignment', 'valley-ridge')} />
                  <span className="radio-dot" />
                  <span className="radio-label">Valley Ridge assigns leads</span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="stormLeadAssignment" value="manual"
                    checked={data.stormLeadAssignment === 'manual'}
                    onChange={() => setField('stormLeadAssignment', 'manual')} />
                  <span className="radio-dot" />
                  <span className="radio-label">We will manually assign leads</span>
                </label>
              </div>
            </div>

            <ShowIf when={data.stormLeadAssignment === 'valley-ridge'}>
              <SubSection>
                <span className="question-label">How should cold call leads be assigned?</span>
                <div className="radio-group">
                  {[
                    { value: 'round-robin', label: 'Round Robin' },
                    { value: 'territory', label: 'Territory Based' },
                    { value: 'leaderboard', label: 'Sales Leaderboard' },
                    { value: 'custom', label: 'Custom Logic' },
                  ].map(opt => (
                    <label key={opt.value} className="radio-option">
                      <input type="radio" name="stormLeadAssignmentMethod" value={opt.value}
                        checked={data.stormLeadAssignmentMethod === opt.value}
                        onChange={() => setField('stormLeadAssignmentMethod', opt.value)} />
                      <span className="radio-dot" />
                      <span className="radio-label">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <ShowIf when={data.stormLeadAssignmentMethod === 'custom'}>
                  <div className="field">
                    <label>Describe custom assignment logic</label>
                    <input type="text" value={data.stormLeadAssignmentMethodCustom}
                      onChange={e => setField('stormLeadAssignmentMethodCustom', e.target.value)}
                      placeholder="Describe how leads should be assigned…" />
                  </div>
                </ShowIf>
              </SubSection>
            </ShowIf>

            <ShowIf when={data.stormLeadAssignment === 'manual'}>
              <SubSection>
                <div className="field">
                  <label>Who should be responsible for manually assigning cold call leads?</label>
                  <input type="text" value={data.stormManualAssignee}
                    onChange={e => setField('stormManualAssignee', e.target.value)}
                    placeholder="Name or role" />
                </div>
              </SubSection>
            </ShowIf>
          </ShowIf>
        </ServiceCard>

      </div>
    </div>
  )
}
