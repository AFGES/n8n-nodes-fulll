import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBalance = { resource: ['balance'] };

export const balanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForBalance },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get balances',
				description: 'Get account balances',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/balances',
					},
				},
			},
		],
		default: 'getAll',
	},
];
