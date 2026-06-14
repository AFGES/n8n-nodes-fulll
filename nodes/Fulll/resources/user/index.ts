import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUser = { resource: ['user'] };

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForUser },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get users',
				description: 'Retrieve many records',
				routing: { request: { method: 'GET', url: '/cred/v1/access/users.json' } },
			},
			{
				name: 'Check Access',
				value: 'checkAccess',
				action: 'Check user access',
				description: 'Check user access verification',
				routing: { request: { method: 'GET', url: '=/cred/v1/access/users/{{$parameter.userIds}}.json' } },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'User IDs',
		name: 'userIds',
		type: 'string',
		displayOptions: { show: { ...showOnlyForUser, operation: ['checkAccess'] } },
		default: '',
		required: true,
		description: 'User IDs separated by commas (e.g., 128,345,56)',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: 1,
	},
	{
		displayName: 'Max Per Page',
		name: 'max_per_page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: 50,
		description: 'Maximum number of users per page',
		typeOptions: { minValue: 1 },
	},
	{
		displayName: 'Search Term',
		name: 'q',
		type: 'string',
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: '',
		description: 'Search in firstname, lastname, and email',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Locked', value: 'locked' },
		],
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: 'active',
		description: 'Filter by state',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Practitioner', value: 'practitioner' },
			{ name: 'Client', value: 'client' },
		],
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: 'all',
		description: 'Filter by user type',
	},
	{
		displayName: 'Company',
		name: 'company',
		type: 'string',
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: '',
		description: 'Filter by company identifier',
	},
	{
		displayName: 'Include Me',
		name: 'include_me',
		type: 'boolean',
		displayOptions: { show: { ...showOnlyForUser, operation: ['getAll'] } },
		default: false,
		description: 'Whether to include the requesting user in the response',
	},
];
