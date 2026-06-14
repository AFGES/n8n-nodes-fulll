import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { userDescription } from './resources/user';
import { companyDescription } from './resources/company';
import { tokenDescription } from './resources/token';

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
						name: 'Company',
						value: 'company',
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
			...userDescription,
			...companyDescription,
			...tokenDescription,
		],
	};
}
