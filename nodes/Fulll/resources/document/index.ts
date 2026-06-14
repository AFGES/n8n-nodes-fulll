import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocument = { resource: ['document'] };

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDocument },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create document',
				description: 'Create a new document',
				routing: { request: { method: 'POST', url: '/document/v1/documents.json' } },
			},
			{
				name: 'List By Type',
				value: 'listByType',
				action: 'List documents by type',
				description: 'List documents filtered by type',
				routing: { request: { method: 'GET', url: '=/document/v1/files/{{$parameter.documentTypeSlug}}/list.json' } },
			},
			{
				name: 'List Types',
				value: 'listTypes',
				action: 'List document types',
				description: 'List available document types',
				routing: { request: { method: 'GET', url: '/document/v1/company/types.json' } },
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload document',
				description: 'Upload a document to accounting',
				routing: { request: { method: 'POST', url: '/accounting/v1/documents' } },
			},
		],
		default: 'create',
	},
	{
		displayName: 'Document Type Slug',
		name: 'documentTypeSlug',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Date From',
		name: 'date_from',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: '',
		description: 'Filter from date',
	},
	{
		displayName: 'Date To',
		name: 'date_to',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: '',
		description: 'Filter to date',
	},
	{
		displayName: 'Sort By',
		name: 'sort_by',
		type: 'options',
		options: [
			{ name: 'Classification Date', value: 'classification_date' },
			{ name: 'Creation Date', value: 'creation_date' },
			{ name: 'Document Date', value: 'document_date' },
		],
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 'creation_date',
		description: 'Sort by field',
	},
	{
		displayName: 'Sort Order',
		name: 'sort_order',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 'asc',
		description: 'Sort direction',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 1,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 50,
		description: 'Max number of results to return',
		typeOptions: { minValue: 1 },
	},
];
