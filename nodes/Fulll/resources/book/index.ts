import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBook = { resource: ['book'] };

export const bookDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForBook },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get books',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/books',
					},
				},
			},
		],
		default: 'getAll',
	},
];
