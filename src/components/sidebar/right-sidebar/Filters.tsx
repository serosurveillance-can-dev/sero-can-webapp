import React, { useContext } from "react";
import { Dropdown } from 'semantic-ui-react';
import { AppContext } from "../../../context";
import { FilterType, PageState, State } from '../../../types';
import { sendAnalyticsEvent } from "../../../utils/analyticsUtils";
import { updateFilters } from "../../../utils/stateUpdateUtils";
import { toPascalCase } from "../../../utils/translate/caseChanger";
import Translate, { getCountryName } from "../../../utils/translate/translateService";
import InformationIcon from "../../shared/InformationIcon";
import SectionHeader from "./SectionHeader";

interface FilterProps {
  page: string
}

export default function Filters({ page }: FilterProps) {
  const [state, dispatch] = useContext(AppContext);
  const pageState = state[page as keyof State] as PageState;

  const getFilters = (filter_type: FilterType): string[] => {
    return Array.from(pageState.filters[filter_type]) as string[]
  }

  const formatOptions = (options: any, filter_type: FilterType) => {
    if (!options) {
      return
    }
    const formatted_options: Record<string, string>[] = [];
    const optionString = toPascalCase(filter_type.toString());
    const jsonObjectString = `${optionString}Options`;
    switch (filter_type) {
      case 'country':
        options.forEach((o: string) => {
          formatted_options.push({
            key: o,
            text: getCountryName(o, state.language, jsonObjectString),
            value: o
          })
        });
        break;
      default:
        options.forEach((o: string) => {
          const translatedString = Translate(jsonObjectString, [toPascalCase(o)]);
          const alternativeString = Translate(jsonObjectString, [o.replace(/ /g, '')]);
          let text = !alternativeString && !translatedString ? o + "*" : (translatedString ? translatedString : alternativeString);
          formatted_options.push({
            key: o,
            text: text,
            value: o
          })
        });
    };
    return formatted_options;
  }

  const addFilter = async (data: any, filterType: FilterType) => {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: {
        filterType,
        filterValue: data.value,
        pageStateEnum: page
      }
    });
    await updateFilters(
      dispatch,
      pageState.filters,
      filterType,
      data.value,
      state.dataPageState.exploreIsOpen,
      page,
      state.chartAggregationFactor)
  }

  const buildFilterDropdown = (filter_type: FilterType, placeholder: string) => {
    return (
      <div className="pb-3">
        <Dropdown
          text={placeholder}
          fluid
          multiple
          search
          clearable
          selection
          options={formatOptions(state.allFilterOptions[filter_type], filter_type)}
          onChange={async (e: any, data: any) => {
            await addFilter(data, filter_type)
            sendAnalyticsEvent({
              /** Typically the object that was interacted with (e.g. 'Video') */
              category: 'Filter',
              /** The type of interaction (e.g. 'play') */
              action: 'selection',
              /** Useful for categorizing events (e.g. 'Fall Campaign') */
              label: `${filter_type.toString()} - ${data.value}`
              /** A numeric value associated with the event (e.g. 42) */
            })
          }}
          defaultValue={getFilters(filter_type)}
        />
      </div>
    )
  }

  return (
    <div className="col-12 p-0">
      <div className="py-3 center flex">
        <div className="section-title">
          {Translate("Filter").toUpperCase()}
        </div>
        <div className="tooltip-vert-adj">
          <InformationIcon
            offset={10}
            position="bottom right"
            color="#455a64"
            tooltipHeader={Translate("Filter")}
            popupSize="small"
            size="sm"
            tooltip={Translate('FilterTooltip')} />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-10 col align-items-center p-0">
          <div className="pb-1">
            <div>
              {
                <SectionHeader 
                  header_text={Translate('StudyInformation')} 
                  tooltip_text={
                  <div>
                    <p>{Translate('StudyInformationTooltip', ['FirstParagraph'])}</p>
                    <p>{Translate('StudyInformationTooltip', ['SecondParagraph'])}</p>
                  </div>
                  }
                />
              }
            </div>
            <div>
              {buildFilterDropdown('source_type', Translate('SourceType'))}
            </div>
            <div>
              {buildFilterDropdown('overall_risk_of_bias', Translate('OverallRiskOfBias'))}
            </div>
          </div>
          <div className="pb-1">
            <div>
              <SectionHeader header_text={Translate('Demographics')} tooltip_text={Translate('DemographicsTooltip')}/>
            </div>
            <div>
              {buildFilterDropdown('population_group', Translate('PopulationGroup'))}
            </div>
            <div>
              {buildFilterDropdown('sex', Translate('Sex'))}
            </div>
            <div>
              {buildFilterDropdown('age', Translate('Age'))}
            </div>
          </div>
          <div className="pb-1">
            <div>
              <SectionHeader header_text={Translate('TestInformation')} tooltip_text={Translate('TestInformationTooltip')}/>
            </div>
            <div>
              {buildFilterDropdown('test_type', Translate('TestType'))}
            </div>
            <div>
              {buildFilterDropdown('isotypes_reported', Translate('IsotypesReported'))}
            </div>
            <div>
              {buildFilterDropdown('specimen_type', Translate('SpecimenType'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}