import { AirtableRecord } from "../types"

export const testRecords: AirtableRecord[] = [
    {
        source_name: 'article1',
        source_type: 'source1',
        test_type: ['test1'],
        specimen_type: ['serum'],
        country: 'Canada',
        population_group: 'General',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 2000,
        seroprevalence: 0.15,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article2',
        source_type: 'source2',
        test_type: ['test1'],
        specimen_type: ['serum'],
        country: 'Canada',
        population_group: 'Adults',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 1000,
        seroprevalence: 0.2,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article3',
        source_type: 'source1',
        test_type: ['test1'],
        specimen_type: ['serum'],
        country: 'Canada',
        population_group: 'Children',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 200,
        seroprevalence: 0.12,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article4',
        source_type: 'source1',
        test_type: ['test2'],
        specimen_type: ['serum'],
        country: 'Canada',
        population_group: 'Children',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 500,
        seroprevalence: 0.15,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article1',
        source_type: 'source1',
        test_type: ['test1'],
        specimen_type: ['serum'],
        country: 'France',
        population_group: 'General',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 1250,
        seroprevalence: 0.23,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article2',
        source_type: 'source2',
        test_type: ['test1'],
        specimen_type: ['serum'],
        country: 'France',
        population_group: 'Adults',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 700,
        seroprevalence: 0.25,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article3',
        source_type: 'source1',
        test_type: ['test1'],
        specimen_type: ['plasma'],
        country: 'France',
        population_group: 'Children',
        sex: 'All',
        age: 'Youth (15-24)',
        denominator: 300,
        seroprevalence: 0.32,
        overall_risk_of_bias: "Low",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM'],
        estimate_grade: "National"
    },
    {
        source_name: 'article4',
        source_type: 'source1',
        test_type: ['test2'],
        specimen_type: null,
        country: 'France',
        population_group: 'Children',
        sex: 'Male',
        age: 'Adults (25-49)',
        denominator: 500,
        seroprevalence: 0.2,
        overall_risk_of_bias: "High",
        pin_latitude: 51.505,
        pin_longitude: -0.09,
        pin_region_type: "country",
        isotypes_reported: ['IgM', 'IgA'],
        estimate_grade: "National"
    }
]; 
