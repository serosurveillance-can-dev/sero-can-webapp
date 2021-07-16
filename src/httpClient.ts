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
        const options = {...response} as Record<string, any>;
        // We know that only these 3 isotypes will ever be reported, thus we can hardcode
        options.isotypes_reported = ["IgG", "IgA", "IgM"];
        const updatedAt = format(parseISO(response.updated_at), "yyyy/MM/dd");
        const maxDate = parseISO(response.max_date);     
        const minDate = parseISO(response.min_date);
        delete options.min_date;
        delete options.max_date;
        return { options, updatedAt, maxDate, minDate };
    }


    preparePostBody(filters: Filters){
        const reqBodyFilters = {...filters} as Record<string, any>;
        const date = filters.publish_date as Array<Date>;
        const unity_aligned_only = filters.unity_aligned_only;
        const [startDate, endDate] = formatDates(date);
        delete reqBodyFilters.publish_date;
        delete reqBodyFilters.unity_aligned_only;

        const reqBody: Record<string, any> = {
            filters: reqBodyFilters,
            sampling_start_date: startDate,
            sampling_end_date: endDate,
            unity_aligned_only
        }
        return reqBody;
    }

    
    async getAirtableRecords(filters: Filters,
        only_explore_columns: Boolean=false) {
        const reqBody: Record<string, any> = this.preparePostBody(filters);

        if( only_explore_columns ){
            reqBody.columns = ["source_id", "estimate_grade", "pin_latitude", "pin_longitude"];
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

    async getEstimateGrades(filters: Filters) {
        const reqBody: Record<string, any> = this.preparePostBody(filters);

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
