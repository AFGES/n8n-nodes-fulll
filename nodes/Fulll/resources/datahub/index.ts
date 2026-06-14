import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDataHub = { resource: ['datahub'] };

export const dataHubDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDataHub },
		options: [
			{
				name: 'Account Sums',
				value: 'accountSums',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Accounts',
				value: 'accounts',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Analysis',
				value: 'analysis',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Analytic',
				value: 'analytic',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Atom Definition',
				value: 'atomDefinition',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Company',
				value: 'company',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Currency',
				value: 'currency',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Datatypes',
				value: 'datatypes',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Entries',
				value: 'entries',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Fiscal Years',
				value: 'fiscalYears',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
			{
				name: 'Values By Datatypes',
				value: 'valuesByDatatypes',
				routing: { request: { method: 'POST', url: '/datahub/v1/graphql' } },
			},
		],
		default: 'company',
	},
	{
		displayName: 'GraphQL Query',
		name: 'graphqlQuery',
		type: 'json',
		displayOptions: { show: showOnlyForDataHub },
		required: true,
		default: '{}',
		description: 'GraphQL query and variables for datahub operation',
		typeOptions: {
			rows: 8,
		},
	},
];
