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
  const [startDate, setStartDate] = useState(filterStartDate);
  const [endDate, setEndDate] = useState(filterEndDate);

  useEffect(() => {
    registerLocale("en", enUS)
    registerLocale("fr", fr)
  }, [])

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
      page)
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
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              minDate={state.calendarStartDates.minDate}
              maxDate={endDate}
              customInput={<CustomInput value={startDate} text={Translate("StartDate")} onClick={onclick} />}
              closeOnScroll={true}
              locale={state.language}
              onChange={() => { }}
              withPortal
              showMonthDropdown
              showYearDropdown
              shouldCloseOnSelect={false}
              dropdownMode="select"
              onSelect={(date: Date) => datePickerChanged(true, date)}
            />
          </div>
          <div>
            <DatePicker
            dateFormat="yyyy/MM/dd"
              className="col-12 p-0 date-picker"
              selected={endDate}
              locale={state.language}
              onSelect={(date: Date) => datePickerChanged(false, date)}
              customInput={<CustomInput value={startDate} text={Translate("EndDate")} onClick={onclick} />}
              minDate={startDate}
              maxDate={state.calendarStartDates.maxDate}
              onChange={() => { }}
              withPortal
              showMonthDropdown
              closeOnScroll={true}
              shouldCloseOnSelect={false}
              showYearDropdown
              todayButton="Today"
              dropdownMode="select"
            />
          </div>
        </div>
        <div className="pb-1"></div>
      </div>
    </div>
  )
}