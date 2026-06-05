import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  AutoOrManual, CRMTriggerInput, ManualNotice,
  SubSection,
} from './shared.jsx'

export default function ProductionSection({ data, setField, errors }) {
  return (
    <div className="section">
      <SectionHeader number="4" title="Production" />
      <div className="section-body">

        {/* ── SERVICE: Material Orders ── */}
        <ServiceCard title="Material Orders">

          <YesNo
            name="materialOrders"
            value={data.materialOrders}
            onChange={v => setField('materialOrders', v)}
            question="Do you want RoofSmartr to build material orders?"
          />

          <ShowIf when={data.materialOrders === 'yes'}>
            <AutoOrManual
              name="materialIdentification"
              value={data.materialIdentification}
              onChange={v => setField('materialIdentification', v)}
              question="How should RoofSmartr know materials are ready?"
            />

            <ShowIf when={data.materialIdentification === 'automatic'}>
              <SubSection>
                <CRMTriggerInput
                  value={data.materialCRMTrigger}
                  onChange={v => setField('materialCRMTrigger', v)}
                />
              </SubSection>
            </ShowIf>

            <ShowIf when={data.materialIdentification === 'manual'}>
              <ManualNotice
                agreed={data.materialManualAgree}
                onAgree={v => setField('materialManualAgree', v)}
                errorMsg={errors?.materialManualAgree}
              />
            </ShowIf>

            <div>
              <span className="question-label">What should RoofSmartr do after building the material order?</span>
              <div className="radio-group">
                {[
                  { value: 'draft-only', label: 'Save Draft Only' },
                  { value: 'send-approval', label: 'Send for Approval', recommended: true },
                  { value: 'submit-supplier', label: 'Submit Directly to Supplier' },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="materialAction" value={opt.value}
                      checked={data.materialAction === opt.value}
                      onChange={() => setField('materialAction', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">
                      {opt.label}
                      {opt.recommended && <span className="rec">(Recommended)</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="question-label">Preferred Supplier</span>
              <div className="radio-group">
                {['ABC Supply', 'SRS', 'Beacon', 'Other'].map(opt => (
                  <label key={opt} className="radio-option">
                    <input type="radio" name="materialSupplier" value={opt}
                      checked={data.materialSupplier === opt}
                      onChange={() => setField('materialSupplier', opt)} />
                    <span className="radio-dot" />
                    <span className="radio-label">{opt}</span>
                  </label>
                ))}
              </div>
              <ShowIf when={data.materialSupplier === 'Other'}>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Supplier Name (Other)</label>
                  <input type="text" value={data.materialSupplierOther}
                    onChange={e => setField('materialSupplierOther', e.target.value)}
                    placeholder="Supplier name" />
                </div>
              </ShowIf>
            </div>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Pulling Permits ── */}
        <ServiceCard title="Pulling Permits">

          <YesNo
            name="permits"
            value={data.permits}
            onChange={v => setField('permits', v)}
            question="Do you want RoofSmartr to pull permits?"
          />

          <ShowIf when={data.permits === 'yes'}>
            <div>
              <span className="question-label">How will RoofSmartr be notified to pull the permit?</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="permitsIdentification" value="automatic"
                    checked={data.permitsIdentification === 'automatic'}
                    onChange={() => setField('permitsIdentification', 'automatic')} />
                  <span className="radio-dot" />
                  <span className="radio-label">
                    Automatically when file reaches "Pull Permit" status in CRM
                    <span className="rec">(Recommended)</span>
                  </span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="permitsIdentification" value="manual"
                    checked={data.permitsIdentification === 'manual'}
                    onChange={() => setField('permitsIdentification', 'manual')} />
                  <span className="radio-dot" />
                  <span className="radio-label">Team member manually creates permit task</span>
                </label>
              </div>
            </div>

            <ShowIf when={data.permitsIdentification === 'manual'}>
              <ManualNotice
                agreed={data.permitsManualAgree}
                onAgree={v => setField('permitsManualAgree', v)}
                errorMsg={errors?.permitsManualAgree}
                customText="Our system only detects assigned tasks. Tags, internal notes, and comments will not trigger permit requests. By selecting manual task creation, you agree to follow RoofSmartr's permit task submission instructions."
              />
            </ShowIf>
          </ShowIf>
        </ServiceCard>

      </div>
    </div>
  )
}
