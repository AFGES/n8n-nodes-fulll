import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPaymentType = { resource: ['paymentType'] };

export const paymentTypeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPaymentType },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get payment types',
				description: 'Retrieve many records',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/payment_types',
					},
				},
			},
		],
		default: 'getAll',
	},
];
