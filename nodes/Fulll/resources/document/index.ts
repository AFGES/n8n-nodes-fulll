import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocument = { resource: ['document'] };

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDocument },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create document',
				description: 'Create a new document',
				routing: {
					request: {
						method: 'POST',
						url: '/document/document_creation',
					},
				},
			},
			{
				name: 'List By Type',
				value: 'listByType',
				action: 'List documents by type',
				description: 'List documents filtered by type',
				routing: {
					request: {
						method: 'GET',
						url: '/document/list_documents_by_type',
					},
				},
			},
			{
				name: 'List Types',
				value: 'listTypes',
				action: 'List document types',
				description: 'List available document types',
				routing: {
					request: {
						method: 'GET',
						url: '/document/list_document_types',
					},
				},
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload document',
				description: 'Upload a document to accounting',
				routing: {
					request: {
						method: 'POST',
						url: '/accounting/v1/documents',
					},
				},
			},
		],
		default: 'create',
	},
];
