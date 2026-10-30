import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

type Show = NonNullable<IDisplayOptions['show']>;

// Expression for `json` parameters: n8n passes a string when typed by hand but
// an object/array when the value comes from an expression.
export const parseJsonValue = '={{ typeof $value === "string" ? JSON.parse($value) : $value }}';

// Same as parseJsonValue, but sends nothing when the value is empty.
export const parseOptionalJsonValue =
	'={{ (typeof $value === "string" ? ($value.trim() === "" || $value.trim() === "{}" ? undefined : JSON.parse($value)) : ($value && Object.keys($value).length ? $value : undefined)) }}';

// Complete Mode + optional Page/Limit for the accounting "List" endpoints
// (accounts, customers, providers, employees). Page and Limit live in a
// collection so nothing is sent unless the user sets them, leaving the API's
// own page size in effect by default.
export function accountingListParams(show: Show): INodeProperties[] {
	const displayOptions = { show: { ...show, operation: ['getAll'] } };
	return [
		{
			displayName: 'Complete Mode',
			name: 'complete_mode',
			type: 'options',
			options: [
				{ name: 'No', value: '0' },
				{ name: 'Yes', value: '1' },
			],
			displayOptions,
			default: '0',
			description: 'Whether to return accounts with debit, credit and balance',
			routing: { send: { type: 'query', property: 'complete_mode', value: '={{$value || undefined}}' } },
		},
		{
			displayName: 'Pagination',
			name: 'pagination',
			type: 'collection',
			placeholder: 'Add Option',
			displayOptions,
			default: {},
			options: [
				{
					displayName: 'Page',
					name: 'page',
					type: 'number',
					default: 1,
					description: 'Page number',
					typeOptions: { minValue: 1 },
					routing: { send: { type: 'query', property: 'page' } },
				},
				{
					displayName: 'Limit',
					name: 'limit',
					type: 'number',
					default: 50,
					description: 'Max number of results to return',
					typeOptions: { minValue: 1 },
					routing: { send: { type: 'query', property: 'limit' } },
				},
			],
		},
	];
}

export function thirdLabelParam(show: Show): INodeProperties {
	return {
		displayName: 'Third Label',
		name: 'third_label',
		type: 'string',
		displayOptions: { show: { ...show, operation: ['getCounterparts'] } },
		default: '',
		description: 'Filter results with a label that contains the given string',
		routing: { send: { type: 'query', property: 'third_label', value: '={{$value || undefined}}' } },
	};
}
