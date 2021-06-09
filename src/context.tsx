import React, { createContext, Dispatch, useReducer } from "react";
import { AggregationFactor, Filters, FilterType, LanguageType, PageState, State } from "./types";

export const AppContext = createContext({} as [State, Dispatch<Record<string, any>>]);

const initialMinDate = new Date(2019, 1, 1, 1);
const initialMaxDate = new Date();

export function getEmptyFilters(): Filters {
  return {
    source_type: [],
    test_type: [],
    country: [],
    population_group: [],
    sex: [],
    age: [],
    overall_risk_of_bias: [],
    isotypes_reported: [],
    specimen_type: [],
    publish_date: [initialMinDate, initialMaxDate],
    estimate_grade: [],
    unity_aligned_only: false
  };
}

// Note: filters = elements that user has chosen to filter by
// filter_options = all the elements that users could filter by
const initialState: State = {
  chartAggregationFactor: AggregationFactor.country,
  explore: {
    filters: getEmptyFilters(),
    records: [],
    estimateGradePrevalences: [],
    isLoading: false,
    legendLayers: {
      National: true,
      Regional: true,
      Local: true,
    },
  },
  // TODO: replace this with an obj
  // representing the data page once
  // we put filters there
  allFilterOptions: getEmptyFilters(),
  calendarStartDates: {
    // Important, the fact that we use an hour here tells us that we are using a default value
    minDate: initialMinDate,
    maxDate: initialMaxDate,
  },
  language: LanguageType.english,
  updatedAt: "",
  showCookieBanner: false,
  countries: [],
  showCountryHover: true,
};

const reducer = (state: State, action: Record<string, any>): State => {
  switch (action.type) {
    case "SHOW_COUNTRY_HOVER":
      return {
        ...state,
        showCountryHover: true,
      };
    case "HIDE_COUNTRY_HOVER":
      return {
        ...state,
        showCountryHover: false,
      };
    case "CLOSE_COOKIE_BANNER":
      return {
        ...state,
        showCookieBanner: false,
      };
    case "OPEN_COOKIE_BANNER":
      return {
        ...state,
        showCookieBanner: true,
      };
    case "UPDATE_ESTIMATE_PREVALENCES": {
      const { pageStateEnum, estimateGradePrevalences } = action.payload;
      const newState = { ...state };
      const pageState = newState[pageStateEnum as keyof State] as PageState;
      pageState.estimateGradePrevalences = estimateGradePrevalences;
      return newState;
    }
    case "UPDATE_COUNTRIES_JSON":
      return {
        ...state,
        countries: action.payload,
      };
    case "SELECT_LANGUAGE":
      return {
        ...state,
        language: action.payload,
      };
    case "GET_ALL_FILTER_OPTIONS":
      return {
        ...state,
        allFilterOptions: action.payload,
      };
    case "GET_AIRTABLE_RECORDS": {
      const { pageStateEnum, records } = action.payload;
      const newState = { ...state };
      const pageState = newState[pageStateEnum as keyof State] as PageState;
      pageState.records = records;
      return newState;
    }
    case "UPDATED_AT":
      return {
        ...state,
        updatedAt: action.payload,
      };
    case "UPDATE_FILTER": {
      const { pageStateEnum, filterType, filterValue } = action.payload;
      const newState = { ...state };
      const pageState = newState[pageStateEnum as keyof State] as PageState;
      pageState.filters[filterType as FilterType] = filterValue;
      return newState;
    }

    case "MAX_MIN_DATES":
      const { minDate, maxDate } = action.payload;
      return {
        ...state,
        calendarStartDates: {
          minDate,
          maxDate,
        },
      };
    case "CHANGE_LOADING": {
      const { pageStateEnum, isLoading } = action.payload;
      const newState = { ...state };
      const pageState = newState[pageStateEnum as keyof State] as PageState;
      pageState.isLoading = isLoading;
      return newState;
    }
    case "UPDATE_AGGREGATION_FACTOR":
      return { ...state, chartAggregationFactor: action.payload };
    case "TOGGLE_NATIONAL_PIN_LAYER": {
      return {
        ...state,
        explore: {
          ...state.explore,
          legendLayers: {
            ...state.explore.legendLayers,
            National: !state.explore.legendLayers.National,
          },
        },
      };
    }
    case "TOGGLE_REGIONAL_PIN_LAYER": {
      return {
        ...state,
        explore: {
          ...state.explore,
          legendLayers: {
            ...state.explore.legendLayers,
            Regional: !state.explore.legendLayers.Regional,
          },
        },
      };
    }
    case "TOGGLE_LOCAL_PIN_LAYER": {
      return {
        ...state,
        explore: {
          ...state.explore,
          legendLayers: {
            ...state.explore.legendLayers,
            Local: !state.explore.legendLayers.Local,
          },
        },
      };
    }
    default:
      return state;
  }
};

export const AppContextProvider = (props: Record<string, any>) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};
