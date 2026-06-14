import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBalance = { resource: ['balance'] };

export const balanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForBalance },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get balances',
				description: 'Get account balances',
				routing: { request: { method: 'GET', url: '/accounting/v1/balances' } },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'Period', value: 'period' },
			{ name: 'Date', value: 'date' },
		],
		displayOptions: { show: { ...showOnlyForBalance, operation: ['getAll'] } },
		default: 'period',
		required: true,
		description: 'Return period or date property in response',
	},
	{
		displayName: 'Class',
		name: 'class',
		type: 'string',
		displayOptions: { show: { ...showOnlyForBalance, operation: ['getAll'] } },
		default: '',
		required: true,
		description: 'Account type (C/F) or start number (e.g., 706, 4456)',
	},
	{
		displayName: 'Period Start',
		name: 'periodstart',
		type: 'string',
		displayOptions: { show: { ...showOnlyForBalance, operation: ['getAll'] } },
		default: '',
		description: 'Filter on period in mm/yyyy format',
	},
	{
		displayName: 'Period End',
		name: 'periodend',
		type: 'string',
		displayOptions: { show: { ...showOnlyForBalance, operation: ['getAll'] } },
		default: '',
		description: 'Filter on period in mm/yyyy format',
	},
	{
		displayName: 'Exercice',
		name: 'exercice',
		type: 'string',
		displayOptions: { show: { ...showOnlyForBalance, operation: ['getAll'] } },
		default: '',
		description: 'Filter to given fiscal year code',
	},
];
