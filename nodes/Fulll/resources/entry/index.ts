import type { INodeProperties } from 'n8n-workflow';

const showOnlyForEntry = { resource: ['entry'] };

export const entryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForEntry },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create entry',
				description: 'Create a new entry',
				routing: { request: { method: 'POST', url: '/accounting/v1/entries' } },
			},
			{
				name: 'Create Expense Report',
				value: 'createExpenseReport',
				action: 'Create expense report',
				description: 'Create a new expense report',
				routing: { request: { method: 'POST', url: '/accounting/v1/expense_report' } },
			},
			{
				name: 'Create Purchase Invoice',
				value: 'createPurchaseInvoice',
				action: 'Create purchase invoice',
				description: 'Create a new purchase invoice',
				routing: { request: { method: 'POST', url: '/accounting/v1/purchase' } },
			},
			{
				name: 'Create Sales Invoice',
				value: 'createSalesInvoice',
				action: 'Create sales invoice',
				description: 'Create a new sales invoice',
				routing: { request: { method: 'POST', url: '/accounting/v1/sales' } },
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get entries',
				description: 'Retrieve many records',
				routing: { request: { method: 'GET', url: '/accounting/v1/entries' } },
			},
			{
				name: 'List Commands',
				value: 'listCommands',
				action: 'List commands',
				description: 'List asynchronous command statuses',
				routing: { request: { method: 'GET', url: '/accounting/v1/commands' } },
			},
		],
		default: 'create',
	},
	{
		displayName: 'Entry Info',
		name: 'infos',
		type: 'collection',
		displayOptions: { show: { ...showOnlyForEntry, operation: ['create'] } },
		required: true,
		default: {},
		options: [
			{ displayName: 'Date', name: 'date', type: 'string', default: '' },
			{ displayName: 'Label', name: 'label', type: 'string', default: '', required: true },
			{ displayName: 'Item ID', name: 'item_id', type: 'string', default: '', required: true },
			{ displayName: 'Lines', name: 'lines', type: 'json', default: '[]', required: true },
		],
	},
	{
		displayName: 'Command IDs',
		name: 'ids',
		type: 'string',
		displayOptions: { show: { ...showOnlyForEntry, operation: ['listCommands'] } },
		default: '',
		description: 'Comma-separated list of command IDs',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForEntry, operation: ['listCommands'] } },
		default: 1,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnlyForEntry, operation: ['listCommands'] } },
		default: 50,
		description: 'Max number of results to return',
		typeOptions: { minValue: 1 },
	},
];
