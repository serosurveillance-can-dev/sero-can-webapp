import _ from "lodash";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Bar, BarChart, CartesianGrid, ErrorBar, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Dropdown, DropdownProps, Modal } from "semantic-ui-react";
import { mobileDeviceOrTabletWidth } from "../../constants";
import { AppContext } from "../../context";
import httpClient from "../../httpClient";
import { AggregatedRecord, AggregationFactor } from "../../types";
import { sendAnalyticsEvent } from '../../utils/analyticsUtils';
import Translate from "../../utils/translate/translateService";
import InformationIcon from "../shared/InformationIcon";
import './Charts.css';
import ReferencesTable from "./ReferencesTable";

export default function Charts() {
  const [yAxisSelection, setYAxis] = useState(AggregationFactor.country);
  const isMobileDeviceOrTablet = useMediaQuery({ maxWidth: mobileDeviceOrTabletWidth })
  const [state, dispatch] = useContext(AppContext);
  const { filters, showAnalyzePopup } = state;
  const initState = [] as AggregatedRecord[];
  const [showModal, toggleModal] = useState(true);
  const [records, setRecords] = useState(initState);

  const yAxisOptions = [
    { key: 'Geographies', text: Translate('Geographies'), value: AggregationFactor.country },
    { key: 'Population', text: Translate('Population'), value: AggregationFactor.population_group },
    { key: 'Sex', text: Translate('Sex'), value: AggregationFactor.sex },
    { key: 'Age', text: Translate('Age'), value: AggregationFactor.age },
    { key: 'Test Type', text: Translate('TestType'), value: AggregationFactor.test_type },
    { key: 'Source Type', text: Translate('SourceType'), value: AggregationFactor.source_type },
    { key: 'Overall Risk Of Bias', text: Translate('RiskOfBias'), value: AggregationFactor.overall_risk_of_bias },
    { key: 'Isotypes Reported', text: Translate('IsotypesReported'), value: AggregationFactor.isotypes_reported },
  ]

  useEffect(() => {
    const updateCharts = async () => {
      const api = new httpClient();
      // TODO: Cache these results so we're not making this call every time we switch pages
      const reAggregatedRecords = await api.postMetaAnalysis(filters, yAxisSelection);
      const chartData = _.sortBy(reAggregatedRecords, 'seroprevalence').reverse();
      setRecords(chartData);
    }
    if (state.dataPageState.routingOccurred) {
      updateCharts();
    }
  }, [filters, state.dataPageState.routingOccurred, yAxisSelection])

  const handleChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setYAxis(data.value as AggregationFactor);
    sendAnalyticsEvent({
      category: 'Independent Variable',
      action: 'selection',
      label: data.text || "Unknown"
    })
  }

  const CustomTooltip = (e: any) => {
    const { active, payload } = e
    if (active && payload) {
      const { error, n, name, numStudies, seroprevalence } = payload[0].payload;
      const lower = (seroprevalence - error[0]).toFixed(2);
      const upper = (seroprevalence + error[1]).toFixed(2);
      return (
        <div className="col flex popup">
          <div className="col-12 p-0 popup-header">{name}</div>
          <div className="col-12 p-0 popup-content">{Translate("Seroprevalence")}: {seroprevalence.toFixed(2)}%</div>
          <div className="col-12 p-0 popup-content">{Translate("95%ConfidenceInterval")}: {lower}%-{upper}%</div>
          <div className="col-12 p-0 popup-content">{Translate('TotalTests')}: {n}</div>
          <div className="col-12 p-0 popup-content">{Translate('TotalEstimates')}: {numStudies}</div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    let recordError = records[index].error;
    const ratio = width / value;
    const error = Array.isArray(recordError) ? recordError[1] : recordError;
    const errorBarWidth = ratio * error;
    return (
      <g>
        <text x={x + width + 10 + (errorBarWidth as number)} y={y + height / 2 + 5} fill="#000" textAnchor="right" dominantBaseline="right">
          {value.toFixed(2)}
        </text>
      </g>
    );
  };

  const getYAxisWidth = (chartData: Record<string, string | number | number[]>[]) => {
    let longestWord = 0;
    chartData.filter(o => o.name)
      .forEach(o => {
        const country = o.name as string;
        longestWord = country.length > longestWord ? country.length : longestWord;
      })
    return longestWord;
  }
  const closeModal = () => {
    toggleModal(false);
    dispatch({ type: 'CLOSE_ANALYZE_POPUP' })
  }

  const MobileInfoModal = () => (
    <Modal className="modal" open={showModal} onClose={closeModal} closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}>
      <Modal.Content className="modal-content">
        <div className={isMobileDeviceOrTablet ? "modal-text-mobile" : "modal-text"}>
          <p>{Translate('InitInfoModalText', ['PartOne'])}</p>
          <p>{Translate('InitInfoModalText', ['PartTwo'])}</p>
          <p>{Translate('InitInfoModalText', ['PartThree'])}</p>
        </div>
      </Modal.Content>
    </Modal>
  )

  return (
    <div className="charts-page">
      {showAnalyzePopup ? <MobileInfoModal /> : null}
      <div className={isMobileDeviceOrTablet ? "mobile-charts container col-11 center-item flex my-3" : "charts container col-11 center-item flex my-3"}>
        <div className="col-12 p-0 flex">
          <div className="col-sm-1 col-lg-3">
          </div>
          <div className="charts-title flex p-0 mt-2 p-lg-0 col-sm-8 col-lg-6">
            <div className="col-auto flex center-item">
              {Translate('SeroprevalenceBy')}
            </div>
            <Dropdown
              placeholder={Translate('Geographies')}
              fluid selection
              className="col large-dropdown"
              onChange={handleChange}
              options={yAxisOptions}
            >
            </Dropdown>
          </div>
          <div className="col-sm-6 col-lg-3 flex top right">
            95% CI
            <InformationIcon
              offset="10px"
              position="bottom right"
              color="#455a64"
              size="sm"
              tooltip={Translate("95%ConfidenceIntervalTooltip")}
              tooltipHeader={Translate("95%ConfidenceInterval")} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={records} layout='vertical' barGap={10}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" name={`${Translate("Seroprevalence")} (%)`} padding={{ left: 0, right: 30 }} />
            <YAxis dataKey="name" type="category" interval={0} width={getYAxisWidth(records) * 7} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar isAnimationActive={false} dataKey="seroprevalence" name={`${Translate('Seroprevalence')} (%)`} fill="#55A6BA" maxBarSize={60} barSize={20}>
              <LabelList dataKey="seroprevalence" position="right" content={renderCustomizedLabel} />
              <ErrorBar dataKey="error" width={4} strokeWidth={2} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="container col-11 my-3 references">
        <ReferencesTable />
      </div>
    </div>
  );
}
