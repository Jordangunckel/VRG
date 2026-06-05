import {
  SectionHeader, ServiceCard, ShowIf,
  SubSection, InfoNote,
} from './shared.jsx'
import StormMapPicker from './StormMapPicker.jsx'

export default function StormReadySection({ data, setField, errors }) {
  return (
    <div className="section">
      <SectionHeader number="S" title="Storm Ready Outreach" />
      <div className="section-body">

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
              <strong>Billing Notice:</strong> Storm Ready Outreach is billed at{' '}
              <strong>$400 per lead generated that converts to sold</strong>.
            </InfoNote>

            <div>
              <span className="question-label">Target Calling Areas</span>
              <p className="field-hint" style={{ marginBottom: 8 }}>
                Draw polygons, rectangles, or circles on the map. You can add multiple areas.
              </p>
              <StormMapPicker
                value={data.stormReadyAreas}
                onChange={v => setField('stormReadyAreas', v)}
                hasError={!!errors?.stormReadyAreas}
              />
            </div>

            <div>
              <span className="question-label">
                Do you want RoofSmartr to assign leads, or will you manually assign them?
              </span>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="stormLeadAssignment" value="valley-ridge"
                    checked={data.stormLeadAssignment === 'valley-ridge'}
                    onChange={() => setField('stormLeadAssignment', 'valley-ridge')} />
                  <span className="radio-dot" />
                  <span className="radio-label">RoofSmartr assigns leads</span>
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
                    { value: 'round-robin',  label: 'Round Robin'       },
                    { value: 'territory',    label: 'Territory Based'   },
                    { value: 'leaderboard',  label: 'Sales Leaderboard' },
                    { value: 'custom',       label: 'Custom Logic'      },
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
