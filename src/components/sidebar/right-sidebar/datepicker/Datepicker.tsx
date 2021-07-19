import React, { useContext, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "semantic-ui-react";
import { AppContext } from "../../../../context";
import { FilterType, PageState, State } from '../../../../types';
import { updateFilters } from "../../../../utils/stateUpdateUtils";
import Translate from "../../../../utils/translate/translateService";
import SectionHeader from "../SectionHeader";
import {enUS, fr} from 'date-fns/locale'

interface DatepickerProps {
  page: string
}

export default function Datepicker({ page }: DatepickerProps) {
  const [state, dispatch] = useContext(AppContext);
  const pageState = state[page as keyof State] as PageState;
  const [filterStartDate, filterEndDate] = Array.from(pageState.filters.publish_date);
  const [startDate, setStartDate] = useState<Date>(filterStartDate);
  const [endDate, setEndDate] = useState<Date>(filterEndDate);
  const minDate = state.calendarStartDates.minDate;
  const maxDate = state.calendarStartDates.maxDate;


  useEffect(() => {
    registerLocale("en", enUS)
    registerLocale("fr", fr)
  }, [])

  useEffect(() => {
    if(startDate < minDate) setStartDate(minDate);
    if(endDate > maxDate) setEndDate(maxDate);
  }, [startDate, endDate, minDate, maxDate])

  const datePickerChanged = async (isStart: Boolean, date: Date) => {
    const newDates = [startDate, endDate];
    newDates[0] = isStart ? date : startDate;
    newDates[1] = !isStart ? date : endDate;

    if (isStart) {
      setStartDate(date);
    }
    else {
      setEndDate(date);
    }
    await updateFilters(dispatch,
      pageState.filters,
      "publish_date" as FilterType,
      newDates,
      state.dataPageState.exploreIsOpen,
      page,
      state.chartAggregationFactor)
  }

  const CustomInput = ({ value, onClick, text }: any) => (
    <div className="col-12 p-0 flex column">
      <div>
        {text}
      </div>
      <Input className="col-12 p-0 cursor"
        value={value}
        iconPosition="left"
        icon="calendar"
        fluid={true}
        type="text"
        placeholder='Select date..'
        onClick={onClick} />
    </div>
  )

  return (
    <div className="row justify-content-center">
      <div className="col-10 col align-items-center p-0">
        <div className="pb-1">
          <div>
            <SectionHeader header_text={Translate('DateRange')} tooltip_text={Translate('DateRangeTooltip')} />
          </div>
          <div>
            <DatePicker
                className="col-12 p-0 date-picker"
                selected={startDate}
                onChange={() => { }}
                onSelect={(date: Date) => datePickerChanged(true, date)}
                dateFormatCalendar={"MMM yyyy"}
                dateFormat="yyyy/MM/dd"
                minDate={minDate}
                maxDate={endDate}
                showYearDropdown
                yearDropdownItemNumber={5}
                scrollableYearDropdown
                showMonthDropdown

                locale={state.language}
                customInput={<CustomInput value={startDate} text={Translate("StartDate")} onClick={onclick} />}
                withPortal
                closeOnScroll={true}
                shouldCloseOnSelect={false}
                dropdownMode="select"
                todayButton="Today"

            />
          </div>
          <div>
            <DatePicker
                className="col-12 p-0 date-picker"
                selected={endDate}
                onChange={() => { }}
                onSelect={(date: Date) => datePickerChanged(false, date)}
                dateFormat="yyyy/MM/dd"
                dateFormatCalendar={"MMM yyyy"}
                minDate={startDate}
                maxDate={maxDate}
                showYearDropdown
                yearDropdownItemNumber={5}
                scrollableYearDropdown
                showMonthDropdown

                locale={state.language}
                customInput={<CustomInput value={endDate} text={Translate("EndDate")} onClick={onclick} />}
                withPortal
                closeOnScroll={true}
                shouldCloseOnSelect={false}
                dropdownMode="select"
                todayButton="Today"

            />
          </div>
        </div>
        <div className="pb-1"></div>
      </div>
    </div>
  )
}