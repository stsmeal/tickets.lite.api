export class QueryCriteria{
    sortColumn: string;
    sortDirection: string;
    pageSize: number;
    page: number;
    wildcardFilter: string;
    filter: any;
    columns: string[];
}

export class QueryResult{
    items: any[];
    total: number;
}