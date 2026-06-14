import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPreferences = { resource: ['preferences'] };

export const preferencesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPreferences },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get preferences',
				description: 'Get company preferences',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/preferences',
					},
				},
			},
		],
		default: 'get',
	},
];
