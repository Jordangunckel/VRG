import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  AutoOrManual, CRMTriggerInput, ManualNotice,
  FrequencyField, CheckboxGroup, SubSection,
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
            question="Do you want Valley Ridge to create financial worksheets?"
          />

          <ShowIf when={data.financialWorksheet === 'yes'}>
            <AutoOrManual
              name="financialIdentification"
              value={data.financialIdentification}
              onChange={v => setField('financialIdentification', v)}
              question="How should Valley Ridge identify completed jobs?"
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
            question="Do you want Valley Ridge to create and send C.O.C.s and invoices?"
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
            question="Do you want Valley Ridge to follow up on final payments?"
          />

          <ShowIf when={data.finalPayment === 'yes'}>
            <div>
              <span className="question-label">Who should Valley Ridge follow up with?</span>
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
            question="Do you want Valley Ridge to send warranties?"
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

        {/* ── SERVICE: Reviews and Referrals ── */}
        <ServiceCard title="Reviews and Referrals">

          <YesNo
            name="reviewsReferrals"
            value={data.reviewsReferrals}
            onChange={v => setField('reviewsReferrals', v)}
            question="Do you want Valley Ridge to request customer reviews and referrals?"
          />

          <ShowIf when={data.reviewsReferrals === 'yes'}>
            <div>
              <span className="question-label">When should Valley Ridge request reviews and referrals?</span>
              <div className="radio-group">
                {[
                  { value: 'happy-status', label: 'Only when customer has reached "Happy Customer" CRM status', recommended: true },
                  { value: 'final-payment', label: 'Always upon final payment' },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="reviewsTiming" value={opt.value}
                      checked={data.reviewsTiming === opt.value}
                      onChange={() => setField('reviewsTiming', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">
                      {opt.label}
                      {opt.recommended && <span className="rec">(Recommended)</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <CheckboxGroup
              name="reviewsMethods"
              values={data.reviewsMethods}
              onChange={v => setField('reviewsMethods', v)}
              question="How should Valley Ridge ask for reviews and referrals? (select all that apply)"
              options={[
                { value: 'email', label: 'Email' },
                { value: 'text', label: 'Text' },
                { value: 'phone', label: 'Phone Call' },
              ]}
            />

            <FrequencyField
              name="reviewsFrequency"
              value={data.reviewsFrequency}
              onChange={v => setField('reviewsFrequency', v)}
              customValue={data.reviewsFrequencyCustom}
              onCustomChange={v => setField('reviewsFrequencyCustom', v)}
              question="How many times should Valley Ridge ask for reviews/referrals?"
              options={[
                { value: '1', label: '1 time' },
                { value: '2', label: '2 times' },
                { value: 'custom', label: 'Custom' },
              ]}
            />
          </ShowIf>
        </ServiceCard>

        {/* ── SERVICE: Thank You Gifts ── */}
        <ServiceCard title="Thank You Gifts">

          <YesNo
            name="thankYouGifts"
            value={data.thankYouGifts}
            onChange={v => setField('thankYouGifts', v)}
            question="Do you want Valley Ridge to coordinate thank-you gifts?"
          />

          <ShowIf when={data.thankYouGifts === 'yes'}>
            <div>
              <span className="question-label">How should Valley Ridge identify customers that should receive a thank-you gift?</span>
              <div className="radio-group">
                {[
                  { value: 'crm-status', label: 'When CRM reaches "Send Thank You Gift" status' },
                  { value: 'custom', label: 'Custom Logic' },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="thankYouIdentification" value={opt.value}
                      checked={data.thankYouIdentification === opt.value}
                      onChange={() => setField('thankYouIdentification', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">{opt.label}</span>
                  </label>
                ))}
              </div>
              <ShowIf when={data.thankYouIdentification === 'custom'}>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Describe your custom logic</label>
                  <input type="text" value={data.thankYouIdentificationCustom}
                    onChange={e => setField('thankYouIdentificationCustom', e.target.value)}
                    placeholder="Describe when to send thank-you gifts…" />
                </div>
              </ShowIf>
            </div>

            <div>
              <span className="question-label">Gift Type</span>
              <div className="radio-group">
                {[
                  { value: 'gift-card', label: 'Gift Card (local business)' },
                  { value: 'branded', label: 'Branded Merchandise' },
                  { value: 'custom', label: 'Custom' },
                ].map(opt => (
                  <label key={opt.value} className="radio-option">
                    <input type="radio" name="thankYouGiftType" value={opt.value}
                      checked={data.thankYouGiftType === opt.value}
                      onChange={() => setField('thankYouGiftType', opt.value)} />
                    <span className="radio-dot" />
                    <span className="radio-label">{opt.label}</span>
                  </label>
                ))}
              </div>
              <ShowIf when={data.thankYouGiftType === 'custom'}>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Describe custom gift</label>
                  <input type="text" value={data.thankYouGiftCustom}
                    onChange={e => setField('thankYouGiftCustom', e.target.value)}
                    placeholder="e.g. Handwritten card + Amazon gift card…" />
                </div>
              </ShowIf>
            </div>
          </ShowIf>
        </ServiceCard>

      </div>
    </div>
  )
}
