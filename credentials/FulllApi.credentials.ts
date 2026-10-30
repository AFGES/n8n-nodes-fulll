import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class FulllApi implements ICredentialType {
	name = 'fulllApi';
	displayName = 'Fulll API';
	icon = 'file:../nodes/Fulll/fulll.svg' as Icon;
	documentationUrl = 'https://github.com/AFGES/n8n-nodes-fulll?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production Fulll',
					value: 'https://api.fulll.io',
				},
				{
					name: 'Production Inexweb',
					value: 'https://api.inexweb.fr',
				},
			],
			default: 'https://api.fulll.io',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Found in the Fulll platform store application',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Found in the Fulll platform store application',
		},
		{
			displayName: 'Company ID',
			name: 'companyId',
			type: 'string',
			default: '',
			required: true,
			description: 'Company identifier sent in the X-Company header on every request',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Token generated in the Fulll platform. Valid for 2 hours.',
		},
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Refresh token generated in the Fulll platform. Use the Refresh Token operation to obtain new tokens.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				'X-Company': '={{$credentials.companyId}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment}}',
			url: '/cred/v1/access/companies.json',
			method: 'GET',
			headers: { Accept: 'application/json' },
		},
	};
}
