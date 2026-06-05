import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  FrequencyField, CheckboxGroup,
} from './shared.jsx'

export default function ReviewsSection({ data, setField, errors }) {
  return (
    <div className="section">
      <SectionHeader number="6" title="Customer Satisfaction" />
      <div className="section-body">

        {/* ── SERVICE: Reviews and Referrals ── */}
        <ServiceCard title="Reviews and Referrals">
          <YesNo
            name="reviewsReferrals"
            value={data.reviewsReferrals}
            onChange={v => setField('reviewsReferrals', v)}
            question="Do you want RoofSmartr to request customer reviews and referrals?"
          />
          <ShowIf when={data.reviewsReferrals === 'yes'}>
            <div>
              <span className="question-label">When should RoofSmartr request reviews and referrals?</span>
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
              question="How should RoofSmartr ask for reviews and referrals? (select all that apply)"
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
              question="How many times should RoofSmartr ask for reviews/referrals?"
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
            question="Do you want RoofSmartr to coordinate thank-you gifts?"
          />
          <ShowIf when={data.thankYouGifts === 'yes'}>
            <div>
              <span className="question-label">How should RoofSmartr identify customers that should receive a thank-you gift?</span>
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
