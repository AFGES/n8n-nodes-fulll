import type { INodeProperties } from 'n8n-workflow';

const showOnlyForToken = { resource: ['token'] };

export const tokenDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForToken },
		options: [
			{
				name: 'Refresh Token',
				value: 'refresh',
				action: 'Refresh the access token',
				description: 'Refresh the access token using the refresh token',
				routing: {
					request: {
						method: 'POST',
						url: '/cred/oauth2/token',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: {
							grant_type: 'refresh_token',
							client_id: '={{$credentials.clientId}}',
							client_secret: '={{$credentials.clientSecret}}',
							refresh_token: '={{$credentials.refreshToken}}',
						},
					},
				},
			},
		],
		default: 'refresh',
	},
];
