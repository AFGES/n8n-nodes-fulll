import type { INodeProperties } from 'n8n-workflow';
import { accountingListParams, thirdLabelParam } from '../shared';

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
		displayName: 'Account Class',
		name: 'account_class',
		type: 'options',
		options: [
			{ name: 'All', value: '' },
			{ name: 'Customer (C)', value: 'C' },
			{ name: 'Employee (E)', value: 'E' },
			{ name: 'General (G)', value: 'G' },
			{ name: 'Provider (F)', value: 'F' },
		],
		displayOptions: { show: { ...showOnlyForAccount, operation: ['getAll'] } },
		default: '',
		description: 'Account type to filter on',
		routing: { send: { type: 'query', property: 'account_class', value: '={{$value || undefined}}' } },
	},
	...accountingListParams(showOnlyForAccount),
	{
		displayName: 'Expand',
		// Not named `expand`: company/user/entry use that name as a multiOptions
		// and n8n keeps parameter values by name across resource switches.
		name: 'accountExpand',
		type: 'string',
		displayOptions: { show: { ...showOnlyForAccount, operation: ['getAll'] } },
		default: '',
		description: 'Return the requested property in the response',
		routing: { send: { type: 'query', property: 'expand', value: '={{$value || undefined}}' } },
	},
	{
		displayName: 'Statuses',
		name: 'statuses',
		type: 'options',
		options: [
			{ name: 'All', value: '' },
			{ name: 'Open', value: 'open' },
			{ name: 'Closed', value: 'closed' },
			{ name: 'Deleted', value: 'deleted' },
		],
		displayOptions: { show: { ...showOnlyForAccount, operation: ['getAll'] } },
		default: '',
		description: 'Filter accounts by status',
		routing: { send: { type: 'query', property: 'statuses', value: '={{$value || undefined}}' } },
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
	thirdLabelParam(showOnlyForAccount),
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
				routing: { send: { type: 'body', property: 'number' } },
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				routing: { send: { type: 'body', property: 'title' } },
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: true,
				routing: { send: { type: 'body', property: 'type' } },
			},
		],
	},
];
