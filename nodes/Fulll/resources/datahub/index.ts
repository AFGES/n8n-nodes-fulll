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
				action: 'Query account sums',
				description: 'Query aggregated account sums',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/raw_or_aggregated_account_sums',
					},
				},
			},
			{
				name: 'Accounts',
				value: 'accounts',
				action: 'Query accounts',
				description: 'Query accounts data',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/accounts',
					},
				},
			},
			{
				name: 'Analysis',
				value: 'analysis',
				action: 'Query analysis',
				description: 'Query analysis data',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/analysis',
					},
				},
			},
			{
				name: 'Analytic',
				value: 'analytic',
				action: 'Query analytics',
				description: 'Query analytics data',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/analytic',
					},
				},
			},
			{
				name: 'Atom Definition',
				value: 'atomDefinition',
				action: 'Query atom definitions',
				description: 'Query atom definitions',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/atomdefintion',
					},
				},
			},
			{
				name: 'Company',
				value: 'company',
				action: 'Query company data',
				description: 'Query company data from datahub',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/company',
					},
				},
			},
			{
				name: 'Currency',
				value: 'currency',
				action: 'Query currency data',
				description: 'Query currency data',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/currency',
					},
				},
			},
			{
				name: 'Datatypes',
				value: 'datatypes',
				action: 'Query datatypes',
				description: 'Query available datatypes',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/datatypes',
					},
				},
			},
			{
				name: 'Entries',
				value: 'entries',
				action: 'Query entries',
				description: 'Query entries data',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/entries',
					},
				},
			},
			{
				name: 'Fiscal Years',
				value: 'fiscalYears',
				action: 'Query fiscal years',
				description: 'Query fiscal years data',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/fiscalyears',
					},
				},
			},
			{
				name: 'Values By Datatypes',
				value: 'valuesByDatatypes',
				action: 'Query values by datatypes',
				description: 'Query values grouped by datatypes',
				routing: {
					request: {
						method: 'POST',
						url: '/datahub/values_by_datatypes',
					},
				},
			},
		],
		default: 'company',
	},
];
