import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCustomer = { resource: ['customer'] };

export const customerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCustomer },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get customers',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/customers',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create customer',
				description: 'Create a new customer',
				routing: {
					request: {
						method: 'POST',
						url: '/accounting/v1/customers',
					},
				},
			},
			{
				name: 'Get Counterparts',
				value: 'getCounterparts',
				action: 'Get counterparts',
				description: 'Get counterparts for a customer',
				routing: {
					request: {
						method: 'GET',
						url: '=/accounting/v1/customers/{{$parameter.customerNumber}}/counterparts/{{$parameter.bookCode}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Customer Number',
		name: 'customerNumber',
		type: 'string',
		displayOptions: { show: { ...showOnlyForCustomer, operation: ['getCounterparts'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Book Code',
		name: 'bookCode',
		type: 'string',
		displayOptions: { show: { ...showOnlyForCustomer, operation: ['getCounterparts'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Customer Info',
		name: 'infos',
		type: 'collection',
		displayOptions: { show: { ...showOnlyForCustomer, operation: ['create'] } },
		required: true,
		default: {},
		typeOptions: {
			objectLikeOptions: [
				{
					displayName: 'Number',
					name: 'number',
					type: 'string',
					default: '',
					required: true,
				},
				{
					displayName: 'Title',
					name: 'title',
					type: 'string',
					default: '',
					required: true,
				},
			],
		},
	},
];
