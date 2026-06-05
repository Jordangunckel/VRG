import {
  SectionHeader, ServiceCard, YesNo, ShowIf,
  AutoOrManual, CRMTriggerInput, ManualNotice,
  FrequencyField, SubSection,
} from './shared.jsx'

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
            question="Do you want RoofSmartr to follow up with leads?"
          />

          <ShowIf when={data.leadFollowUp === 'yes'}>
            <AutoOrManual
              name="leadFollowUpIdentification"
              value={data.leadFollowUpIdentification}
              onChange={v => setField('leadFollowUpIdentification', v)}
              question="How should RoofSmartr identify leads needing follow-up?"
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
              question="Should RoofSmartr follow up with lost status leads?"
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

      </div>
    </div>
  )
}
