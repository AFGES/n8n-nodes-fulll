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
				routing: {
					request: {
						method: 'GET',
						url: '/cred/users',
					},
				},
			},
			{
				name: 'Check Access',
				value: 'checkAccess',
				action: 'Check user access',
				description: 'Check user access verification',
				routing: {
					request: {
						method: 'GET',
						url: '/cred/users/access',
					},
				},
			},
		],
		default: 'getAll',
	},
];
