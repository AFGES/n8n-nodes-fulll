import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAnalytics = { resource: ['analytics'] };

export const analyticsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAnalytics },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get analytics',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/analytics',
					},
				},
			},
		],
		default: 'getAll',
	},
];
