import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { analyticsDescription } from './resources/analytics';
import { balanceDescription } from './resources/balance';
import { bookDescription } from './resources/book';
import { companyDescription } from './resources/company';
import { currencyDescription } from './resources/currency';
import { customerDescription } from './resources/customer';
import { dataHubDescription } from './resources/datahub';
import { documentDescription } from './resources/document';
import { employeeDescription } from './resources/employee';
import { entryDescription } from './resources/entry';
import { fiscalYearDescription } from './resources/fiscalYear';
import { paymentTypeDescription } from './resources/paymentType';
import { preferencesDescription } from './resources/preferences';
import { providerDescription } from './resources/provider';
import { tokenDescription } from './resources/token';
import { userDescription } from './resources/user';

export class Fulll implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fulll',
		name: 'fulll',
		icon: 'file:fulll.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Fulll API',
		defaults: {
			name: 'Fulll',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'fulllApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.environment}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Company': '={{$credentials.companyId}}',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Analytics',
						value: 'analytics',
					},
					{
						name: 'Balance',
						value: 'balance',
					},
					{
						name: 'Book',
						value: 'book',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Currency',
						value: 'currency',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Datahub',
						value: 'datahub',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Employee',
						value: 'employee',
					},
					{
						name: 'Entry',
						value: 'entry',
					},
					{
						name: 'Fiscal Year',
						value: 'fiscalYear',
					},
					{
						name: 'Payment Type',
						value: 'paymentType',
					},
					{
						name: 'Preference',
						value: 'preferences',
					},
					{
						name: 'Provider',
						value: 'provider',
					},
					{
						name: 'Token',
						value: 'token',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},
			...accountDescription,
			...analyticsDescription,
			...balanceDescription,
			...bookDescription,
			...companyDescription,
			...currencyDescription,
			...customerDescription,
			...dataHubDescription,
			...documentDescription,
			...employeeDescription,
			...entryDescription,
			...fiscalYearDescription,
			...paymentTypeDescription,
			...preferencesDescription,
			...providerDescription,
			...tokenDescription,
			...userDescription,
		],
	};
}
