import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  AutoOrManual, CRMTriggerInput, ManualNotice,
  FrequencyField, SubSection,
} from './shared.jsx'

export default function PostSaleSection({ data, setField, errors }) {
  return (
    <div className="section">
      <SectionHeader number="5" title="Post Sale" />
      <div className="section-body">

        {/* ── SERVICE: Financial Worksheet ── */}
        <ServiceCard title="Financial Worksheet">

          <YesNo
            name="financialWorksheet"
            value={data.financialWorksheet}
            onChange={v => setField('financialWorksheet', v)}
            question="Do you want RoofSmartr to create financial worksheets?"
          />

          <ShowIf when={data.financialWorksheet === 'yes'}>
            <AutoOrManual
              name="financialIdentification"
              value={data.financialIdentification}
              onChange={v => setField('financialIdentification', v)}
              question="How should RoofSmartr identify completed jobs?"
            />

            <ShowIf when={data.financialIdentification === 'automatic'}>
              <SubSection>
                <CRMTriggerInput
                  value={data.financialCRMTrigger}
                  onChange={v => setField('financialCRMTrigger', v)}
                  label="CRM Status Trigger (e.g. Job Complete, Closeout)"
                />
              </SubSection>
            </ShowIf>

            <ShowIf when={data.financialIdentification === 'manual'}>
              <ManualNotice
                agreed={data.financialManualAgree}
                onAgree={v => setField('financialManualAgree', v)}
                errorMsg={errors?.financialManualAgree}
              />
            </ShowIf>
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: C.O.C. & Invoices ── */}
        <ServiceCard title="C.O.C. & Invoices">

          <YesNo
            name="cocInvoices"
            value={data.cocInvoices}
            onChange={v => setField('cocInvoices', v)}
            question="Do you want RoofSmartr to create and send C.O.C.s and invoices?"
          />

          <ShowIf when={data.cocInvoices === 'yes'}>
            <div>
              <span className="question-label">Who should receive C.O.C.s?</span>
              <div className="radio-group">
                {[
                  { value: 'homeowner', label: 'Homeowner' },
                  { value: 'insurance', label: 'Insurance Carrier' },
                  { value: 'both', label: 'Both', recommended: true },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="cocRecipient" value={opt.value}
                      checked={data.cocRecipient === opt.value}
                      onChange={() => setField('cocRecipient', opt.value)} />
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

        {/* ── SERVICE: Final Payment Follow-Up ── */}
        <ServiceCard title="Final Payment Follow-Up">

          <YesNo
            name="finalPayment"
            value={data.finalPayment}
            onChange={v => setField('finalPayment', v)}
            question="Do you want RoofSmartr to follow up on final payments?"
          />

          <ShowIf when={data.finalPayment === 'yes'}>
            <div>
              <span className="question-label">Who should RoofSmartr follow up with?</span>
              <div className="radio-group">
                {[
                  { value: 'insurance', label: 'Insurance Company' },
                  { value: 'homeowner', label: 'Homeowner' },
                  { value: 'both', label: 'Both', recommended: true },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="finalPaymentFollowUpWith" value={opt.value}
                      checked={data.finalPaymentFollowUpWith === opt.value}
                      onChange={() => setField('finalPaymentFollowUpWith', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">
                      {opt.label}
                      {opt.recommended && <span className="rec">(Recommended)</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <FrequencyField
              name="finalPaymentFrequency"
              value={data.finalPaymentFrequency}
              onChange={v => setField('finalPaymentFrequency', v)}
              customValue={data.finalPaymentFrequencyCustom}
              onCustomChange={v => setField('finalPaymentFrequencyCustom', v)}
              question="Final Payment Follow-Up Frequency"
              options={[
                { value: 'weekly', label: 'Weekly', recommended: true },
                { value: 'custom', label: 'Custom' },
              ]}
            />
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Warranties ── */}
        <ServiceCard title="Warranties">

          <YesNo
            name="warranties"
            value={data.warranties}
            onChange={v => setField('warranties', v)}
            question="Do you want RoofSmartr to send warranties?"
          />

          <ShowIf when={data.warranties === 'yes'}>
            <div>
              <span className="question-label">Warranty Type</span>
              <div className="radio-group">
                {[
                  { value: 'manufacturer', label: 'Manufacturer Only' },
                  { value: 'workmanship', label: 'Workmanship Only' },
                  { value: 'both', label: 'Both', recommended: true },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="warrantyType" value={opt.value}
                      checked={data.warrantyType === opt.value}
                      onChange={() => setField('warrantyType', opt.value)} />
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
