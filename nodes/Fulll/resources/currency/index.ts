import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCurrency = { resource: ['currency'] };

export const currencyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCurrency },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get currencies',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/currencies',
					},
				},
			},
		],
		default: 'getAll',
	},
];
