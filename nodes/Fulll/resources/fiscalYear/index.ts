import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFiscalYear = { resource: ['fiscalYear'] };

export const fiscalYearDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForFiscalYear },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get fiscal years',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/fiscal_years',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Last Only',
		name: 'last',
		type: 'boolean',
		displayOptions: { show: { ...showOnlyForFiscalYear, operation: ['getAll'] } },
		default: false,
		description: 'Whether to reduce the result to the last fiscal year only',
		routing: { send: { type: 'query', property: 'last', value: '={{$value ? "true" : undefined}}' } },
	},
];
