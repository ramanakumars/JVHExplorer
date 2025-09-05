export interface FacetResult {
    value: number;
    label: number;
    count: number;
    toggle_url: string;
    selected: boolean;
}

export interface FacetResults {
    perijove: {
        name: string;
        type: string;
        hideable: boolean;
        toggle_url: string;
        results: FacetResult[];
        truncated: boolean;
    };
}

export interface VorticesResponse {
    database: string;
    table: string;
    is_view: boolean;
    human_description_en: string;
    rows: Array<VortexDataType>;
    truncated: boolean;
    filtered_table_rows_count: number;
    expanded_columns: any[];
    expandable_columns: any[];
    columns: string[];
    primary_keys: any[];
    units: Record<string, any>;
    query: {
        sql: string;
        params: Record<string, string>;
    };
    facet_results: FacetResults;
    suggested_facets: any[];
    next: any;
    next_url: any;
    private: boolean;
    allow_execute_sql: boolean;
    query_ms: number;
}

export interface Extract {
    rowid: number;
    index: number;
    subject_id: number;
    perijove: number;
    color: string;
    lon: number;
    lat: number;
    x: number;
    y: number;
    rx: number;
    ry: number;
    angle: number;
    probability: number;
    angular_width: number;
    angular_height: number;
    physical_width: number;
    physical_height: number;
    vortex: string;
}

export interface ExtractsResponse {
    database: string;
    table: string;
    is_view: boolean;
    human_description_en: string;
    rows: Array<Extract>;
    truncated: boolean;
    filtered_table_rows_count: number;
    expanded_columns: any[];
    expandable_columns: any[];
    columns: string[];
    primary_keys: any[];
    units: Record<string, any>;
    query: {
        sql: string;
        params: Record<string, string>;
    };
    facet_results: Record<string, any>;
    suggested_facets: Array<{
        name: string;
        toggle_url: string;
    }>;
    next: any;
    next_url: any;
    private: boolean;
    allow_execute_sql: boolean;
    query_ms: number;
}

export interface SubjectMetadataType {
    // Define the structure of the response object here
    rowid: number;
    index: number;
    subject_id: number;
    latitude: number;
    longitude: number;
    perijove: number;
}

export interface SubjectsResponse extends Array<SubjectMetadataType> {}

export interface SubjectImageResponse {
    subjects: Array<{
        locations: Array<{
            "image/png": string;
        }>;
    }>;
}

export interface VortexDataType {
    rowid: number;
    index: number;
    perijove: number;
    color: string;
    lon: number;
    lat: number;
    x: number;
    y: number;
    rx: number;
    ry: number;
    angle: number;
    angular_width: number;
    angular_height: number;
    physical_width: number;
    physical_height: number;
    id: string;
    num_extracts?: number;
    probability: number;
    closest_subject_id?: number;
}

export interface EllipseType {
    x: number;
    y: number;
    rx: number;
    ry: number;
    angle: number;
    color: string;
}
