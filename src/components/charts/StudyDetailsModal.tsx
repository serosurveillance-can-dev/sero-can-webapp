import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import { AirtableRecord } from "../../types";
import Translate from "../../utils/translate/translateService";
import "./StudyDetailsModal.css";
import { sendAnalyticsEvent } from "../../utils/analyticsUtils";

// TODO: Extract this into a modal service 

interface StudyDetailsModalProps {
  record: AirtableRecord
}
export default function StudyDetailsModal(props: StudyDetailsModalProps) {
  const [open, setOpen] = useState(false);

  const inlineStyle = {
    modal: {
      marginTop: '0px !important',
      marginLeft: 'auto',
      marginRight: 'auto',
      top: 'auto',
      left: 'auto',
      height: 'auto'
    }
  };

  const getPossibleNullString = (nullString: string | number | null | undefined) => {
    if (nullString === null || nullString === undefined) {
      return "Not Reported"
    }
    return nullString
  }

  const getPossibleNullStringArray = (nullString: string[] | null | undefined) => {
    if (nullString === null || nullString === undefined) {
      return "Not Reported"
    }
    return nullString.join(", ")
  }

  const getAuthorString = (first_author: string | undefined | null, lead_org: string | null | undefined) => {
    if (lead_org && first_author) {
      return Translate('StudyDetailsAuthorString', ['LeadOrg'], { 'FIRST_AUTHOR': first_author, 'LEAD_ORG': lead_org })
    }
    else if (first_author) {
      return Translate('StudyDetailsAuthorString', ['NoLeadOrg'], { 'FIRST_AUTHOR': first_author })
    }
    return Translate('AuthorAndLeadOrganizationNotReported')
  }

  const getPublishString = (publish_date: string | string[] | undefined | null, publisher: string | null | undefined) => {
    const date = publish_date instanceof Array ? publish_date[0] : publish_date;
    if (date && publisher) {
      return Translate('StudyDetailsPublishString', ['PublisherAndDate'], { 'PUBLISH_DATE': date, 'PUBLISHER': publisher })
    }
    else if (date) {
      return Translate('StudyDetailsPublishString', ['NoPublisher'], { 'PUBLISH_DATE': date })
    }
    else if (publisher) {
      return Translate('StudyDetailsPublishString', ['NoPublishDate'], { 'PUBLISHER': publisher })
    }
    return null
  }

  const {
    source_name, first_author, lead_org, publish_date, publisher, url,
    summary, study_status, study_type,
    population_group, age, city, state, country, sex,
    seroprevalence, risk_of_bias, denominator,
    sampling_method, sampling_end_date, sampling_start_date,
    test_type, sensitivity, specificity, isotypes_reported, manufacturer, approving_regulator
  } = props.record
  return (
    <Modal
      centered={true}
      size="large"
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={() => { setOpen(false) }}
      onOpen={() => {
        sendAnalyticsEvent({
          category: 'Study Details Modal',
          action: 'opening',
          label: props.record.source_name || "Unknown"
        })
      }}
      open={open}
      style={inlineStyle.modal}
      trigger={
        <Button onClick={() => setOpen(true)} style={{ padding: '8px' }}>
          {Translate('Details')}
        </Button>}>
      <Modal.Header>{Translate('PrevalenceEstimateDetails')}
        <FontAwesomeIcon onClick={() => setOpen(false)} icon={faTimes} size={"sm"} className="float-right cursor" />
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div className="col-12 p-0 flex">
            <div className="col-12 px-0 py-1">
              <div className="col-12 p-0 section-title">{Translate('Source').toUpperCase()}</div>
              <div className="col-12 px-2 py-1 section-container modal-text-container">
                <a href={url || ""} target="_blank" rel="noopener noreferrer" className="col-12 p-0 name-text">
                  {source_name}
                </a>
                <div className="col-12 p-0 secondary-text">
                  {getAuthorString(first_author, lead_org)}
                </div>
                <div className="col-12 p-0 tertiary-text">
                  {getPublishString(publish_date, publisher)}
                </div>
              </div>
            </div>

            <div className="col-12 px-0 py-1">
              <div className="col-12 p-0 section-title">{Translate('Study').toUpperCase()}</div>
              <div className="col-12 px-2 py-1 flex section-container modal-text-container">
                <div className="col-12 p-0 secondary-text">
                  <div>
                    <span className="secondary-title">{Translate('Summary')}: </span>
                    {getPossibleNullString(summary)}
                  </div>
                </div>
                <div className="col-6 p-0 secondary-text">
                  <div>
                    <span className="secondary-title">{Translate('Status')}: </span>{getPossibleNullString(study_status)}
                  </div>
                </div>
                <div className="col-6 p-0 secondary-text">
                  <div>
                    <span className="secondary-title">{Translate('StudyType')}: </span>{getPossibleNullString(study_type)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 px-0 py-1">
              <div className="col-12 p-0 section-title">{Translate('Demographics').toUpperCase()}</div>
              <div className="col-12 px-2 py-1 flex section-container modal-text-container">
                <div className="col-6 p-0 secondary-text">
                  <span className="secondary-title">{Translate('Population')}: </span>{getPossibleNullStringArray(population_group)}
                </div>
                <div className="col-6 p-0 secondary-text">
                  <span className="secondary-title">{Translate('AgeGroup')}: </span>{getPossibleNullStringArray(age)}
                </div>
                <div className="col-6 p-0 secondary-text">
                  <span>
                    <span className="secondary-title">{Translate('Location')}: </span>{city ? `${city.join(", ")}, ` : ""}{state ? `${state.join(", ")}, ` : ""}{country ? country : ""}
                  </span>
                </div>
                <div className="col-6 p-0 secondary-text">
                  <span className="secondary-title">{Translate('Sex')}: </span>{getPossibleNullString(sex)}
                </div>
              </div>
            </div>

            <div className="col-6 pl-0 pr-2 py-1">
              <div className="col-12 p-0 section-title">{Translate('Prevalence').toUpperCase()}</div>
              <div className="col-12 px-2 py-1 flex section-container modal-text-container">
                <div className="col-12 p-0 secondary-text">
                  <span className="secondary-title">{Translate('Estimate')}: </span>{seroprevalence ? (seroprevalence * 100).toFixed(2) : "Not Reported"}%
                </div>
                <div className="col-12 p-0 secondary-text">
                  <span className="secondary-title">{Translate('StudySize')}: </span>{getPossibleNullString(denominator)}
                </div>
                <div className="col-12 p-0 secondary-text">
                  <span className="secondary-title">{Translate('RiskOfBias')}: </span>{getPossibleNullString(risk_of_bias)}
                </div>
              </div>
            </div>

            <div className="col-6 pl-2 pr-0 py-1">
              <div className="col-12 p-0 section-title">{Translate('Sampling').toUpperCase()}</div>
              <div className="col-12 px-2 py-1 flex section-container modal-text-container">
                <div className="col-12 p-0 secondary-text">
                  <div>
                    <span className="secondary-title">{Translate('SamplingMethod')}: </span>{getPossibleNullString(sampling_method)}
                  </div>
                </div>
                <div className="col-12 p-0 secondary-text">
                  <div>
                    <span className="secondary-title">{Translate('StartDate')}: </span>{getPossibleNullString(sampling_start_date)}
                  </div>
                </div>
                <div className="col-12 p-0 secondary-text">
                  <div>
                    <span className="secondary-title">{Translate('EndDate')}: </span>{getPossibleNullString(sampling_end_date)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 px-0 py-1">
              <div className="col-12 p-0 section-title">{Translate('TestDetails').toUpperCase()}</div>
              <div className="col-12 px-2 py-1 flex section-container modal-text-container">
                <div className="col-6 p-0">
                  <div className="col-12 p-0 secondary-text">
                    <div>
                      <span className="secondary-title">{Translate('Manufacturer')}: </span>{getPossibleNullString(manufacturer)}
                    </div>
                  </div>
                  <div className="col-12 p-0 secondary-text">
                    <div>
                      <span className="secondary-title">{Translate('TestUsed')}: </span>{getPossibleNullStringArray(test_type)}
                    </div>
                  </div>
                  <div className="col-12 p-0 secondary-text">
                    <div>
                      <span className="secondary-title">{Translate('Isotypes')}: </span>{getPossibleNullStringArray(isotypes_reported)}
                    </div>
                  </div>
                </div>
                <div className="col-6 p-0">
                  <div className="col-12 p-0 secondary-text">
                    <div>
                      <span className="secondary-title">{Translate('Specificity')}: </span>{specificity ? `${(specificity * 100).toFixed(2)}%` : "Not Reported"}
                    </div>
                  </div>
                  <div className="col-12 p-0 secondary-text">
                    <div>
                      <span className="secondary-title">{Translate('Sensitivity')}: </span>{sensitivity ? `${(sensitivity * 100).toFixed(2)}%` : "Not Reported"}
                    </div>
                  </div>
                  <div className="col-126 p-0 secondary-text">
                    <div>
                      <span className="secondary-title">{Translate('RegulatoryApproval')}: </span>{getPossibleNullString(approving_regulator)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal >
  )
} 