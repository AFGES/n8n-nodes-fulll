import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCompany = { resource: ['company'] };

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCompany },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get companies',
				description: 'Retrieve many records',
				routing: { request: { method: 'GET', url: '/cred/v1/access/companies.json' } },
			},
			{
				name: 'Check Access',
				value: 'checkAccess',
				action: 'Check company access',
				description: 'Check company access verification',
				routing: { request: { method: 'GET', url: '=/cred/v1/access/companies/{{$parameter.companyIds}}.json' } },
			},
			{
				name: 'Check Module Access',
				value: 'checkModuleAccess',
				action: 'Check module access',
				description: 'Check module access status',
				routing: { request: { method: 'GET', url: '=/cred/v1/access/modules/{{$parameter.moduleId}}.json' } },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Company IDs',
		name: 'companyIds',
		type: 'string',
		displayOptions: { show: { ...showOnlyForCompany, operation: ['checkAccess'] } },
		default: '',
		required: true,
		description: 'Company IDs separated by commas (e.g., 128,345,56)',
	},
	{
		displayName: 'Module ID',
		name: 'moduleId',
		type: 'string',
		displayOptions: { show: { ...showOnlyForCompany, operation: ['checkModuleAccess'] } },
		default: '',
		required: true,
		description: 'Module identifier',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Locked', value: 'locked' },
		],
		displayOptions: { show: { ...showOnlyForCompany, operation: ['getAll'] } },
		default: 'active',
		description: 'Filter by state',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForCompany, operation: ['getAll'] } },
		default: 1,
		description: 'Page number',
	},
	{
		displayName: 'Max Per Page',
		name: 'max_per_page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForCompany, operation: ['getAll'] } },
		default: 50,
		description: 'Maximum number of companies per page',
	},
	{
		displayName: 'Search Term',
		name: 'q',
		type: 'string',
		displayOptions: { show: { ...showOnlyForCompany, operation: ['getAll'] } },
		default: '',
		description: 'Search in corporate name and file number',
	},
];
