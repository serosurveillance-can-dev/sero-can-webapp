import { AggregatedRecord, AggregationFactor, AirtableRecord, Filters, FilterType, StudiesFilters } from "./types";
import { formatDates } from "./utils/utils";
import {parseISO, format } from "date-fns";

export default class httpClient {

    async httpGet(url: string, useAppRoute: boolean) {
        let url_full = url;
        if (useAppRoute && process.env.REACT_APP_ROUTE) {
            url_full = process.env.REACT_APP_ROUTE + url_full;
        }
        const res = await fetch(url_full);
        if (res.status !== 200) {
            const error_msg = res.json();
            console.error(error_msg);
            return;
        }
        else {
            const response_json = await res.json();
            return response_json;
        }
    }

    async httpPost(url: string, data: Record<string, any>) {
        let url_full = url;
        if (process.env.REACT_APP_ROUTE) {
            url_full = process.env.REACT_APP_ROUTE + url_full;
        }
        const res = await fetch(url_full, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        if (res.status !== 200) {
            const error_msg = res.json();
            console.error(error_msg);
            return;
        }
        else {
            const response_json = await res.json();
            return response_json;
        }
    }

    async getStyles(url: string) {

        const res = await fetch(url);
        if (res.status !== 200) {
            const error_msg = res.json();
            console.error(error_msg);
            return;
        }
        else {
            const response_json = await res.json();
            return response_json;
        }
    }

    async getRecordDetails(source_id : string) {
        const response = await this.httpGet(`/data_provider/record_details/${source_id}`, true);
        if (!response) {
            return null;
        }
        const record: AirtableRecord = response as AirtableRecord;
        return record;
    }

    async getAllFilterOptions() {
        const response = await this.httpGet('/data_provider/filter_options', true);
        const options: Record<string, any> = {}
        for(let k in response){
            // Currently no need for max and min date options
            if(k !== "max_date" && k !== "min_date"){
                // For all the other options, use a Set instead of list
                // Because that's the data model our filters are used to
                // TODO: refactor so we can keep filter options in a list
                options[k] = new Set(response[k]);
            }
        }
        // We know that only these 3 isotypes will ever be reported, thus we can hardcode
        options.isotypes_reported = new Set(["IgG", "IgA", "IgM"]);
        const updatedAt = format(parseISO(response.updated_at), "yyyy/MM/dd");
        const maxDate = parseISO(response.max_date);     
        const minDate = parseISO(response.min_date);
        return { options, updatedAt, maxDate, minDate };
    }
    
    async getAirtableRecords(filters: Filters,
        only_explore_columns: Boolean =false,
        sorting_key = "denominator_value",
        reverse= false) {
        const reqBodyFilters: Record<string, string[]> = {}

        Object.keys(filters).forEach((o: string) => {
            const filter = Array.from(filters[o as FilterType]);
            if (o !== 'publish_date') {
                reqBodyFilters[o] = filter as string[]
            }
        });

        const explore_columns = ["source_id", "estimate_grade", "pin_latitude", "pin_longitude"];

        const date = filters['publish_date'] as Array<Date>
        const [startDate, endDate] = formatDates(date)
        const reqBody: Record<string, any> = {
            filters: reqBodyFilters,
            sampling_start_date: startDate,
            sampling_end_date: endDate,
            sorting_key: sorting_key,
            reverse: reverse,
            per_page: null,
            page_index: null,
        }

        if( only_explore_columns ){
            reqBody.columns = explore_columns;
        }

        const response = await this.httpPost('/data_provider/records', reqBody)
        if (!response) {
            return [];
        }
        const filtered_records = response.map((item: Record<string, any>) => {
            // Convert response to AirtableRecord type
            const record: AirtableRecord = item as AirtableRecord;
            return record;
        });
        // Remove timestamp from updated at string

        return filtered_records;
    }

    async getAirtableRecordsForCountry(filters: StudiesFilters) {

        const reqBody: Record<string, any> = {
            filters: filters,
            include_subgeography_estimates: true,
        }

        const response = await this.httpPost('/data_provider/records', reqBody)
        if (!response) {
            return [];
        }

        const filtered_records = response.map((item: Record<string, any>) => {
            return this.responseToRecord(item) as AirtableRecord;
        });

        return filtered_records;
    }

    async getEstimateGrades(filters: Filters) {
        const reqBodyFilters: Record<string, string[]> = {}
        Object.keys(filters).forEach((o: string) => {
            const filter = Array.from(filters[o as FilterType]);
            reqBodyFilters[o] = filter as string[]
        })
        delete reqBodyFilters['publish_date']
        const date = filters['publish_date']        
        const [startDate, endDate] = formatDates(date)
        const reqBody = {
            sampling_start_date: startDate,
            sampling_end_date: endDate,
            filters: reqBodyFilters
        }

        const response = await this.httpPost('/data_provider/country_seroprev_summary', reqBody);
        if (!response) {
            return [];
        }
        const formattedResponse = response.map((record: Record<string, any>) => {
            // Convert response to AlternateAggregatedRecord type         
            const estimateSummary = record.seroprevalence_estimate_summary;
            return {
                numberOfStudies: record.n_estimates,
                testsAdministered: record.n_tests_administered,
                geographicalName: record.country,          
                alpha3Code: record.country_iso3,
                localEstimate: {
                    maxEstimate: estimateSummary.Local.max_estimate,
                    minEstimate: estimateSummary.Local.min_estimate,
                    numEstimates: estimateSummary.Local.n_estimates,
                },
                nationalEstimate: {
                    maxEstimate: estimateSummary.National.max_estimate,
                    minEstimate: estimateSummary.National.min_estimate,
                    numEstimates: estimateSummary.National.n_estimates,
                },
                regionalEstimate: {
                    maxEstimate: estimateSummary.Regional.max_estimate,
                    minEstimate: estimateSummary.Regional.min_estimate,
                    numEstimates: estimateSummary.Regional.n_estimates,
                },
                sublocalEstimate: {
                    maxEstimate: estimateSummary.Sublocal.max_estimate,
                    minEstimate: estimateSummary.Sublocal.min_estimate,
                    numEstimates: estimateSummary.Sublocal.n_estimates,
                }
            }
        });

        return formattedResponse;
    }

    // Note: deprecated but leaving here in case we need again
    async postMetaAnalysis(filters: Filters,
        aggregation_variable: AggregationFactor,
        meta_analysis_technique: string = 'fixed',
        meta_analysis_transformation: string = 'double_arcsin_precise') {
        const reqBodyFilters: Record<string, string[]> = {}

        const date = filters['publish_date'];
        Object.keys(filters).forEach((o: string) => {
            const filter = Array.from(filters[o as FilterType]);
            reqBodyFilters[o] = filter as string[]
        });

        // TODO: Rename publish_date to sampling_end_date
        delete reqBodyFilters['publish_date'];
        const [startDate, endDate] = formatDates(date)
        const reqBody = {
            sampling_start_date: startDate,
            sampling_end_date: endDate,
            filters: reqBodyFilters,
            aggregation_variable,
            meta_analysis_technique,
            meta_analysis_transformation
        };

        const response = await this.httpPost('/meta_analysis/records', reqBody);
        if (response) {
            // Convert response to aggregatedRecord object
            const formatted_response: AggregatedRecord[] = Object.keys(response).filter((key: string) => response[key] !== null).map((key: string) => {
                return {
                    error: response[key].error_percent,
                    n: response[key].total_N,
                    name: key,
                    numStudies: response[key].n_studies,
                    seroprevalence: response[key].seroprevalence_percent,
                }
            });
            return formatted_response;
        }
        return [];
    }
}
