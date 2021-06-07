import { AggregatedRecord, AggregationFactor, AirtableRecord, Filters, FilterType } from "./types";
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

    responseToRecord(item: Record<string, any>){
        // TODO: find a less verbose way to map an http response to a typescript object
        const record: AirtableRecord = {
            age: item.age,
            city: item.city,
            country: item.country,
            denominator: item.denominator_value,
            estimate_grade: item.estimate_grade,
            first_author: item.first_author,
            isotypes_reported: item.isotypes_reported,
            lead_organization: item.lead_organization,
            overall_risk_of_bias: item.overall_risk_of_bias,
            pin_latitude: item.pin_latitude,
            pin_longitude: item.pin_longitude,
            pin_region_type: item.pin_region_type,
            population_group: item.population_group,
            sampling_end_date: item.sampling_end_date,
            sampling_start_date: item.sampling_start_date,
            seroprevalence: item.serum_pos_prevalence,
            sensitivity: item.sensitivity,
            specificity: item.specificity,
            sex: item.sex,
            source_id: item.source_id,
            source_name: item.source_name,
            source_type: item.source_type,
            specimen_type: Array.isArray(item.specimen_type) ? item.specimen_type : [item.specimen_type],
            state: item.state,
            study_type: item.study_type,
            summary: item.summary,
            test_type: item.test_type,
            test_manufacturer: item.test_manufacturer,
            url: item.url
        };

        return record
    }

    async getRecordDetails(source_id : string) {
        const response = await this.httpGet(`/data_provider/record_details/${source_id}`, true);
        if (!response) {
            return null;
        }

        const record: AirtableRecord = this.responseToRecord(response);
        
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

        const date = filters.publish_date as Array<Date>;
        const unity_aligned_only = filters.unity_aligned_only;

        Object.keys(filters).forEach((o: string) => {
            if(!(new Set(['publish_date', 'unity_aligned_only'])).has(o)){
                const filter = Array.from(filters[o as FilterType]);
                reqBodyFilters[o] = filter as string[];
            }
        }) 

        const explore_columns = ["source_id", "estimate_grade", "pin_latitude", "pin_longitude"];

        const [startDate, endDate] = formatDates(date)
        const reqBody: Record<string, any> = {
            filters: reqBodyFilters,
            sampling_start_date: startDate,
            sampling_end_date: endDate,
            sorting_key: sorting_key,
            reverse: reverse,
            per_page: null,
            page_index: null,
            unity_aligned_only
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
            const record: AirtableRecord = this.responseToRecord(item);
            return record;
        });
        // Remove timestamp from updated at string

        return filtered_records;
    }

    async getEstimateGrades(filters: Filters) {
        const reqBodyFilters: Record<string, string[]> = {}

        const date = filters.publish_date as Array<Date>;
        const unity_aligned_only = filters.unity_aligned_only;

        Object.keys(filters).forEach((o: string) => {
            if(!(new Set(['publish_date', 'unity_aligned_only'])).has(o)){
                const filter = Array.from(filters[o as FilterType]);
                reqBodyFilters[o] = filter as string[];
            }
        }) 

        const [startDate, endDate] = formatDates(date)
        const reqBody = {
            sampling_start_date: startDate,
            sampling_end_date: endDate,
            filters: reqBodyFilters,
            unity_aligned_only
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
}
