import type { INodeProperties } from 'n8n-workflow';
import { accountingListParams, thirdLabelParam } from '../shared';

const showOnlyForProvider = { resource: ['provider'] };

export const providerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProvider },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get providers',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/providers',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create provider',
				description: 'Create a new provider',
				routing: {
					request: {
						method: 'POST',
						url: '/accounting/v1/providers',
					},
				},
			},
			{
				name: 'Get Counterparts',
				value: 'getCounterparts',
				action: 'Get counterparts',
				description: 'Get counterparts for a provider',
				routing: {
					request: {
						method: 'GET',
						url: '=/accounting/v1/providers/{{$parameter.providerNumber}}/counterparts/{{$parameter.bookCode}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	...accountingListParams(showOnlyForProvider),
	{
		displayName: 'Provider Number',
		name: 'providerNumber',
		type: 'string',
		displayOptions: { show: { ...showOnlyForProvider, operation: ['getCounterparts'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Book Code',
		name: 'bookCode',
		type: 'string',
		displayOptions: { show: { ...showOnlyForProvider, operation: ['getCounterparts'] } },
		default: '',
		required: true,
	},
	thirdLabelParam(showOnlyForProvider),
	{
		displayName: 'Provider Info',
		name: 'infos',
		type: 'collection',
		displayOptions: { show: { ...showOnlyForProvider, operation: ['create'] } },
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
		],
	},
];
