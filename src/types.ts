
export type AirtableRecord = {
    source_name: string | null,
    lead_org?: string | null,
    first_author?: string | null,
    source_type: string | null,
    test_type: string[] | null,
    specimen_type: string[] | null,
    isotypes_reported: string[] | null,
    manufacturer?: string | null,
    approving_regulator?: string | null,
    sensitivity?: number | null,
    specificity?: number | null,
    country: string | null,
    state?: string[] | null,
    city?: string[] | null,
    population_group: string | null,
    sex: string | null,
    age: string | null,
    denominator: number | null,
    seroprevalence: number | null,
    publish_date?: string[] | string | null,
    publisher?: string | null,
    overall_risk_of_bias: string | null,
    study_type?: string | null,
    sample_size?: string | null,
    sampling_method?: string | null,
    sampling_start_date?: string | null,
    sampling_end_date?: string | null,
    summary?: string | null,
    url?: string | null,
    include_in_n: boolean,
    estimate_grade: string | null
};

export type AggregatedRecord = {
    error: number[];
    n: number;
    name: string;
    numStudies: number;
    seroprevalence: number;
}

// Each filter will be a javascript set
// TODO: find typing to represent sets
export type Filters = {
    source_type: any,
    test_type: any,
    country: any,
    population_group: any,
    sex: any,
    age: any,
    overall_risk_of_bias: any,
    isotypes_reported: any,
    specimen_type: any
    publish_date: any,
    estimate_grade: any,
};

export type FilterType = 'country' | 'population_group' | 'sex' | 'age' | 'test_type' | 'source_type' | 'overall_risk_of_bias' | 'isotypes_reported' | 'specimen_type' | 'estimate_grade';

export enum LanguageType {
    french = 'fr',
    english = 'en'
}

export type State = {
    healthcheck: string,
    explore: PageState,
    analyze: PageState,
    filters: Filters,
    records: AirtableRecord[]
    allFilterOptions: Filters,
    updatedAt: string,
    dataPageState: DataPageState,
    language: LanguageType,
    estimate_grade_prevalences: AlternateAggregatedRecord[],
    countries: any;
    showCookieBanner: boolean,
    showAnalyzePopup: boolean
};

export type PageState = {
    filters: Filters,
    records: AirtableRecord[],
}

export type AlternateAggregatedRecord = {
    testsAdministered: number;
    geographicalName: string;
    numberOfStudies: number;
    localEstimate?: RegionalPrevalenceEstimate,
    nationalEstimate?: RegionalPrevalenceEstimate,
    regionalEstimate?: RegionalPrevalenceEstimate,
    sublocalEstimate?: RegionalPrevalenceEstimate
}

export type RegionalPrevalenceEstimate = {
    maxEstimate: number;
    minEstimate: number;
    numEstimates: number;
}

export enum AggregationFactor {
    country = 'country',
    population_group = 'population_group',
    sex = 'sex',
    age = 'age',
    test_type = 'test_type',
    source_type = 'source_type',
    overall_risk_of_bias = 'overall_risk_of_bias',
    isotypes_reported = 'isotypes_reported',
}

export type DataPageState = {
    exploreIsOpen: boolean,
    showStudiesModal: false,
    routingOccurred: boolean
}

export type CustomMatcherResult = {
    pass: boolean
    message: string
}

export type PostRecordsBody = {
    filters: {
        country: String[],
        source_type: String[],
        source_name: String[],
        overall_risk_of_bias: String[],
        population_group: String[],
        age: String[],
        sex: String[],
        test_type: String[],
        isotypes_reported: String[],
        specimen_type: String[],
        estimate_grade: String[]
    },
    start_date: Date | null,
    end_date: Date | null,
    sorting_key: String,
    reverse: Boolean,
    per_page: Number,
    page_index: Number,
    columns: String[]
}
