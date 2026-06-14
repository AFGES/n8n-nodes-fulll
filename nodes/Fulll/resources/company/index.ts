import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCompany = { resource: ['company'] };

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCompany },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get companies',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/cred/companies',
					},
				},
			},
			{
				name: 'Check Access',
				value: 'checkAccess',
				action: 'Check company access',
				description: 'Check company access verification',
				routing: {
					request: {
						method: 'GET',
						url: '/cred/companies/access',
					},
				},
			},
			{
				name: 'Check Module Access',
				value: 'checkModuleAccess',
				action: 'Check module access',
				description: 'Check module access status',
				routing: {
					request: {
						method: 'GET',
						url: '/cred/module/access',
					},
				},
			},
		],
		default: 'getAll',
	},
];
