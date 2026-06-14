import type { INodeProperties } from 'n8n-workflow';

const showOnlyForEmployee = { resource: ['employee'] };

export const employeeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForEmployee },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many employees',
				description: 'Retrieve many employees',
				routing: {
					request: {
						method: 'GET',
						url: '/accounting/v1/employees',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an employee',
				description: 'Create a new employee',
				routing: {
					request: {
						method: 'POST',
						url: '/accounting/v1/employees',
					},
				},
			},
			{
				name: 'Get Counterparts',
				value: 'getCounterparts',
				action: 'Get employee counterparts',
				description: 'Get counterparts for an employee in a specific book',
				routing: {
					request: {
						method: 'GET',
						url: '=/accounting/v1/employees/{{$parameter.employeeNumber}}/counterparts/{{$parameter.bookCode}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Employee Number',
		name: 'employeeNumber',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForEmployee,
				operation: ['getCounterparts'],
			},
		},
		description: 'The unique identifier of the employee',
	},
	{
		displayName: 'Book Code',
		name: 'bookCode',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForEmployee,
				operation: ['getCounterparts'],
			},
		},
		description: 'The code of the book to get counterparts for',
	},
];
