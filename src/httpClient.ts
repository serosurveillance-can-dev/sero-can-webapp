import { AirtableRecord } from "./types"

export default class httpClient {
    async httpGet(url: string){
        let url_full = url;
        if(process.env.REACT_APP_ROUTE){
            url_full = process.env.REACT_APP_ROUTE + url_full;
        }
        const res = await fetch(url_full);
        if(res.status !== 200) {
            return;
        }
        else {
            const response_json = await res.json();
            return response_json;
        }
    }

    async getHealthcheck() {
        const healthcheck: string = await this.httpGet('/healthcheck');
        return healthcheck;
    }

    async getAirtableRecords() {
        const response = await this.httpGet('/airtable_scraper/records');
        if(!response) {
            return [];
        }
        const airtable_records = response.records!.map((item: Record<string, any>)=>{ 
            // Convert response to AirtableRecord type
            const record: AirtableRecord = { 
                source_name: item.SOURCE_NAME ? item.SOURCE_NAME[0] : null,
                lead_org: item.LEAD_ORG ? item.LEAD_ORG[0] : null,
                first_author: item.FIRST_AUTHOR ? item.FIRST_AUTHOR[0]: null,
                source_type: item.SOURCE_TYPE ? item.SOURCE_TYPE[0]: null,
                study_status: item.STUDY_STATUS ? item.STUDY_STATUS[0]: null,
                study_type: item.STUDY_TYPE,
                test_type: item.TEST_TYPE,
                isotopes_reported: item.ISOTOPED_REPORTED,
                manufacturer: item.MANUFACTURER,
                approving_regulator: item.APPROVAL,
                sensitivity: item.SENSITIVITY,
                specificity: item.SPECIFICITY,
                publish_date: item.PUB_DATE,
                publisher: item.PUBLISHER,
                country: item.COUNTRY ? item.COUNTRY[0] : null,
                state: item.STATE,
                city: item.CITY,
                population_group: item.POPULATION_GROUP,
                sex: item.SEX,
                age: item.AGE,
                denominator: item.DENOMINATOR,
                summary: item.SUMMARY,
                seroprevalence: item.SERUM_POS_PREVALENCE,
                sample_size: item.SAMPLE_SIZE,
                sampling_method: item.SAMPLING,
                sampling_start_date: item.SAMPLING_START,
                sampling_end_date: item.SAMPLING_END,
                risk_of_bias: item.OVERALL_RISK_OF_BIAS ? item.OVERALL_RISK_OF_BIAS[0] : null,
                url: item.URL ? item.URL[0] : null
            };

            return record; 
        });

        return {
            airtable_records,
            updated_at: response.updated_at!
        };
    }
}