import type { INodeProperties } from 'n8n-workflow';
import { accountingListParams, thirdLabelParam } from '../shared';

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
	...accountingListParams(showOnlyForEmployee),
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
	thirdLabelParam(showOnlyForEmployee),
	{
		displayName: 'Employee Info',
		name: 'infos',
		type: 'collection',
		displayOptions: { show: { ...showOnlyForEmployee, operation: ['create'] } },
		required: true,
		default: {},
		options: [
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'number' } },
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				routing: { send: { type: 'body', property: 'title' } },
			},
		],
	},
];
