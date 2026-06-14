import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAccount = { resource: ['account'] };

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAccount },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get accounts',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/accounts',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create account',
				description: 'Create a new account',
				routing: {
					request: {
						method: 'POST',
						url: '/accounting/v1/accounts',
					},
				},
			},
			{
				name: 'Get Counterparts',
				value: 'getCounterparts',
				action: 'Get counterparts',
				description: 'Get counterparts for an account',
				routing: {
					request: {
						method: 'GET',
						url: '=/accounting/v1/accounts/{{$parameter.accountNumber}}/counterparts/{{$parameter.bookCode}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Account Number',
		name: 'accountNumber',
		type: 'string',
		displayOptions: { show: { ...showOnlyForAccount, operation: ['getCounterparts'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Book Code',
		name: 'bookCode',
		type: 'string',
		displayOptions: { show: { ...showOnlyForAccount, operation: ['getCounterparts'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Account Info',
		name: 'infos',
		type: 'collection',
		displayOptions: { show: { ...showOnlyForAccount, operation: ['create'] } },
		required: true,
		default: {},
		options: [
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: true,
			},
		],
	},
];
