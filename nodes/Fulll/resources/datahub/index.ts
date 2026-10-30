import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
import { parseJsonValue, parseOptionalJsonValue } from '../shared';

const showOnlyForDataHub = { resource: ['datahub'] };

// Operations that accept the dataType argument
const dataTypeOps = ['atomDefinition', 'valuesByDatatypes', 'accountSums'];
// Operations that accept atom/period/scale/calculation aggregation arguments
const aggregationOps = ['valuesByDatatypes', 'accountSums'];
// Operations that accept the isClosed/sort fiscal-year arguments
const fiscalYearArgOps = ['company', 'fiscalYears'];

// Merges the free-form Additional Variables into body.variables, so operations
// without typed fields can still pass GraphQL variables.
async function mergeAdditionalVariables(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const raw = this.getNodeParameter('additionalVariables', '{}') as string | object;
	const extra = (typeof raw === 'string' ? (raw.trim() ? JSON.parse(raw) : {}) : raw) as Record<string, unknown>;
	if (!extra || !Object.keys(extra).length) return requestOptions;
	const body = (requestOptions.body ?? {}) as Record<string, unknown>;
	body.variables = { ...extra, ...((body.variables as Record<string, unknown>) ?? {}) };
	requestOptions.body = body;
	return requestOptions;
}

export const dataHubDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDataHub },
		options: [
			{
				name: 'Account Sums',
				value: 'accountSums',
				action: 'Get raw or aggregated account sums',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Accounts',
				value: 'accounts',
				action: 'List accounts',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Analysis',
				value: 'analysis',
				action: 'Get analysis tree',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Analytic',
				value: 'analytic',
				action: 'Get analytic',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Atom Definition',
				value: 'atomDefinition',
				action: 'List atom definitions',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Company',
				value: 'company',
				action: 'Get company metadata',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Currency',
				value: 'currency',
				action: 'Get currency',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Datatypes',
				value: 'datatypes',
				action: 'List data types',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Entries',
				value: 'entries',
				action: 'List entries',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Fiscal Years',
				value: 'fiscalYears',
				action: 'List fiscal years',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Values By Datatypes',
				value: 'valuesByDatatypes',
				action: 'Get raw or aggregated heading sums',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
		],
		default: 'company',
	},

	// --- GraphQL query (selection set) ---
	// API.md documents the input arguments per operation but NOT the GraphQL
	// query / selection sets. The typed fields below build the `variables`
	// object; the query string must be supplied here (from the GraphQL schema
	// or an example query). Sent as body.query, with the typed fields as
	// body.variables.*.
	{
		displayName: 'GraphQL Query',
		name: 'query',
		type: 'string',
		typeOptions: { rows: 8 },
		displayOptions: { show: showOnlyForDataHub },
		default: '',
		required: true,
		description:
			'GraphQL query/mutation string. The typed fields are passed as GraphQL variables (body.variables). Selection sets are not documented in API.md and must be provided here.',
		routing: { send: { type: 'body', property: 'query', preSend: [mergeAdditionalVariables] } },
	},
	{
		displayName: 'Additional Variables (JSON)',
		name: 'additionalVariables',
		type: 'json',
		displayOptions: { show: showOnlyForDataHub },
		default: '{}',
		description:
			'Extra GraphQL variables merged into body.variables. Typed fields above take precedence on conflicting keys.',
	},

	// --- isClosed / sort (Company, Fiscal Years) ---
	{
		displayName: 'Is Closed',
		name: 'isClosed',
		type: 'options',
		options: [
			{ name: 'All', value: '' },
			{ name: 'Closed Only', value: 'true' },
			{ name: 'Open Only', value: 'false' },
		],
		displayOptions: { show: { ...showOnlyForDataHub, operation: fiscalYearArgOps } },
		default: '',
		description: 'Filter fiscal years by closed state',
		routing: { send: { type: 'body', property: 'variables.isClosed', value: '={{$value === "" ? undefined : $value === "true"}}' } },
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'ASC' },
			{ name: 'Descending', value: 'DESC' },
		],
		displayOptions: { show: { ...showOnlyForDataHub, operation: fiscalYearArgOps } },
		default: 'ASC',
		description: 'Sort direction',
		routing: { send: { type: 'body', property: 'variables.sort' } },
	},
	{
		// Entries takes an EntriesColumnSort input object (column + direction),
		// not the plain Sort enum used by Company / Fiscal Years.
		displayName: 'Sort (JSON)',
		name: 'entriesSort',
		type: 'json',
		displayOptions: { show: { ...showOnlyForDataHub, operation: ['entries'] } },
		default: '{}',
		description: 'EntriesColumnSort object choosing the column and direction. Leave empty for the API default (anti-chronological on date).',
		routing: { send: { type: 'body', property: 'variables.sort', value: parseOptionalJsonValue } },
	},

	// --- dataType (Atom Definition, Values By Datatypes, Account Sums) ---
	{
		displayName: 'Data Type',
		name: 'dataType',
		type: 'options',
		options: [
			{ name: 'Account', value: 'ACCOUNT' },
			{ name: 'COA', value: 'COA' },
			{ name: 'DSN', value: 'DSN' },
			{ name: 'Fact', value: 'FACT' },
			{ name: 'Forecast', value: 'FORECAST' },
			{ name: 'Indicator', value: 'INDICATOR' },
		],
		displayOptions: { show: { ...showOnlyForDataHub, operation: dataTypeOps } },
		default: 'COA',
		required: true,
		description: 'Data source to restrict the search on',
		routing: { send: { type: 'body', property: 'variables.dataType' } },
	},

	// --- Atom Definition extras ---
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDataHub, operation: ['atomDefinition'] } },
		default: '',
		description: 'Search for a pattern in the name and label of the atom definition',
		routing: { send: { type: 'body', property: 'variables.filter', value: '={{$value || undefined}}' } },
	},

	// --- Entries args ---
	{
		displayName: 'Period (JSON)',
		name: 'period',
		type: 'json',
		displayOptions: { show: { ...showOnlyForDataHub, operation: [...aggregationOps, 'entries'] } },
		default: '{}',
		required: true,
		description: 'Date-range object for the query (e.g. { "startDate": "...", "endDate": "..." })',
		routing: { send: { type: 'body', property: 'variables.period', value: parseJsonValue } },
	},
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDataHub, operation: ['entries'] } },
		default: '',
		description: 'Account ID to filter on',
		routing: { send: { type: 'body', property: 'variables.accountId', value: '={{$value || undefined}}' } },
	},
	{
		displayName: 'Entries Filter (JSON)',
		name: 'entriesFilter',
		type: 'json',
		displayOptions: { show: { ...showOnlyForDataHub, operation: ['entries'] } },
		default: '{}',
		description: 'Filter on entry fields such as label or analytics',
		routing: { send: { type: 'body', property: 'variables.filter', value: parseOptionalJsonValue } },
	},

	// --- Aggregation args (Values By Datatypes, Account Sums) ---
	{
		displayName: 'Atom Inputs (JSON)',
		name: 'atomInputs',
		type: 'json',
		displayOptions: { show: { ...showOnlyForDataHub, operation: aggregationOps } },
		default: '[]',
		required: true,
		description: 'Array of atom inputs, e.g. [{ "ID": "044acf60", "dataPart": ["heading_value"] }]',
		routing: { send: { type: 'body', property: 'variables.atomInputs', value: parseJsonValue } },
	},
	{
		displayName: 'Scale',
		name: 'scale',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDataHub, operation: aggregationOps } },
		default: 'MONTH',
		required: true,
		description: 'Unit in the period (e.g. MONTH)',
		routing: { send: { type: 'body', property: 'variables.scale' } },
	},
	{
		displayName: 'Calculation Mode',
		name: 'calculation',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDataHub, operation: aggregationOps } },
		default: 'TRANSACTIONAL',
		required: true,
		description: 'Type of calculation (e.g. TRANSACTIONAL)',
		routing: { send: { type: 'body', property: 'variables.calculation' } },
	},

	// --- Pagination (Atom Definition + aggregation ops) ---
	{
		displayName: 'First',
		name: 'first',
		type: 'number',
		displayOptions: { show: { ...showOnlyForDataHub, operation: [...dataTypeOps] } },
		default: 0,
		description: 'Number of elements to retrieve',
		routing: { send: { type: 'body', property: 'variables.first', value: '={{$value || undefined}}' } },
	},
	{
		displayName: 'After',
		name: 'after',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDataHub, operation: [...dataTypeOps] } },
		default: '',
		description: 'Starting base64-encoded index of the pagination',
		routing: { send: { type: 'body', property: 'variables.after', value: '={{$value || undefined}}' } },
	},
];
