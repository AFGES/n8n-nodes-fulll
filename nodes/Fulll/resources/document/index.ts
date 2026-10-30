import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';

const showOnlyForDocument = { resource: ['document'] };

type FormPart = { name: string; value: string | Buffer; fileName?: string; mimeType?: string };

function appendIfSet(parts: FormPart[], name: string, value: unknown): void {
	if (value === undefined || value === null || value === '') return;
	parts.push({ name, value: String(value) });
}

// Serializes parts as a multipart/form-data body by hand: n8n's httpRequest
// only special-cases the `form-data` package, which community nodes cannot
// depend on, so a native FormData body is not reliably sent.
function encodeMultipart(parts: FormPart[]): { body: Buffer; contentType: string } {
	const boundary = `----n8nFulll${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
	const chunks: Buffer[] = [];
	for (const part of parts) {
		let header = `--${boundary}\r\nContent-Disposition: form-data; name="${part.name}"`;
		if (part.fileName !== undefined) {
			header += `; filename="${part.fileName.replace(/"/g, '%22')}"\r\nContent-Type: ${part.mimeType || 'application/octet-stream'}`;
		}
		chunks.push(Buffer.from(`${header}\r\n\r\n`), Buffer.from(part.value), Buffer.from('\r\n'));
	}
	chunks.push(Buffer.from(`--${boundary}--\r\n`));
	return { body: Buffer.concat(chunks), contentType: `multipart/form-data; boundary=${boundary}` };
}

// Builds a multipart/form-data body for the document `create` and `upload`
// operations: reads the binary property and the scalar fields, then replaces
// the JSON body and Content-Type header.
async function presendDocumentUpload(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const operation = this.getNodeParameter('operation') as string;
	const binaryProperty = this.getNodeParameter('inputDataFieldName', 'data') as string;
	const binary = this.helpers.assertBinaryData(binaryProperty);
	const buffer = await this.helpers.getBinaryDataBuffer(binaryProperty);

	const parts: FormPart[] = [];
	const fileName = (this.getNodeParameter('fileName', '') as string) || binary.fileName || 'file';
	parts.push({ name: 'file', value: buffer, fileName, mimeType: binary.mimeType });

	if (operation === 'create') {
		const fields = this.getNodeParameter('additionalFields', {}) as Record<string, unknown>;
		appendIfSet(parts, 'node', this.getNodeParameter('node', ''));
		appendIfSet(parts, 'nodeId', this.getNodeParameter('nodeId', ''));
		appendIfSet(parts, 'fileName', fileName);
		for (const [key, value] of Object.entries(fields)) {
			if (key === 'confidentialFor') {
				// API.md: can be used only if isConfidential is true.
				if (fields.isConfidential !== true) continue;
				const ids = typeof value === 'string' ? value.split(',') : Array.isArray(value) ? value : [];
				for (const id of ids) {
					const trimmed = String(id).trim();
					if (trimmed) parts.push({ name: 'confidentialFor[]', value: trimmed });
				}
			} else if (typeof value === 'boolean') {
				parts.push({ name: key, value: value ? 'true' : 'false' });
			} else {
				appendIfSet(parts, key, value);
			}
		}
	} else {
		// upload → /accounting/v1/documents
		appendIfSet(parts, 'company', this.getNodeParameter('company', ''));
		appendIfSet(parts, 'book', this.getNodeParameter('book', ''));
		appendIfSet(parts, 'bookCode', this.getNodeParameter('bookCode', ''));
	}

	const { body, contentType } = encodeMultipart(parts);
	requestOptions.body = body;
	requestOptions.json = false;
	const headers = { ...(requestOptions.headers ?? {}) };
	delete headers['content-type'];
	headers['Content-Type'] = contentType;
	requestOptions.headers = headers;
	return requestOptions;
}

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
				routing: { request: { method: 'POST', url: '/document/v1/documents.json' } },
			},
			{
				name: 'List By Type',
				value: 'listByType',
				action: 'List documents by type',
				description: 'List documents filtered by type',
				routing: { request: { method: 'GET', url: '=/document/v1/files/{{$parameter.documentTypeSlug}}/list.json' } },
			},
			{
				name: 'List Types',
				value: 'listTypes',
				action: 'List document types',
				description: 'List available document types',
				routing: { request: { method: 'GET', url: '/document/v1/company/types.json' } },
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload document',
				description: 'Upload a document to accounting',
				routing: { request: { method: 'POST', url: '/accounting/v1/documents' } },
			},
		],
		default: 'create',
	},
	{
		displayName: 'Input Binary Field',
		name: 'inputDataFieldName',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['create', 'upload'] } },
		default: 'data',
		required: true,
		hint: 'The name of the input binary field containing the file to upload',
		// preSend builds the multipart body for both create and upload operations.
		routing: { send: { preSend: [presendDocumentUpload] } },
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['create', 'upload'] } },
		default: '',
		description: 'Public filename for the document. Defaults to the binary file name.',
	},
	{
		displayName: 'Node',
		name: 'node',
		type: 'options',
		options: [
			{ name: 'My Documents', value: 'myDocuments' },
			{ name: 'Companies', value: 'companies' },
			{ name: 'Users', value: 'users' },
		],
		displayOptions: { show: { ...showOnlyForDocument, operation: ['create'] } },
		default: 'companies',
		required: true,
		description: 'Master location of the document privacy',
	},
	{
		displayName: 'Node ID',
		name: 'nodeId',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['create'] } },
		default: '',
		description: 'ID of the user or company (e.g. companies_295399); leave empty for My Documents',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['create'] } },
		default: {},
		options: [
			{
				displayName: 'Classification Date',
				name: 'classificationDate',
				type: 'string',
				default: '',
				description: 'Yyyy-mm-dd, required if the document path is detailed per month',
			},
			{ displayName: 'Comments', name: 'comments', type: 'string', default: '' },
			{
				displayName: 'Confidential For',
				name: 'confidentialFor',
				type: 'string',
				default: '',
				description:
					'Comma-separated client user IDs granted access. Only used when Is Confidential is true.',
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'string',
				default: '',
				description: 'Yyyy-mm-dd; defaults to the current date',
			},
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				description: 'Document ID if this is a new version of an existing document',
			},
			{
				displayName: 'Is Confidential',
				name: 'isConfidential',
				type: 'boolean',
				default: false,
				description: 'Whether the document is visible to practitioners only',
			},
			{
				displayName: 'Parent',
				name: 'parent',
				type: 'string',
				default: '',
				description: 'Document type ID. Cannot be used with Parent Slug.',
			},
			{
				displayName: 'Parent Slug',
				name: 'parentSlug',
				type: 'string',
				default: '',
				description: 'Document type slug. Cannot be used with Parent.',
			},
			{ displayName: 'Source App', name: 'sourceApp', type: 'string', default: '' },
			{
				displayName: 'Source ID',
				name: 'sourceId',
				type: 'string',
				default: '',
				description: 'ID of the document stored in the source app',
			},
			{
				displayName: 'Source URL',
				name: 'sourceUrl',
				type: 'string',
				default: '',
				description: 'URL of the document stored in the source app',
			},
		],
	},
	{
		displayName: 'Company',
		name: 'company',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['upload'] } },
		default: '',
		required: true,
		description: 'ID of the company',
	},
	{
		displayName: 'Book',
		name: 'book',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['upload'] } },
		default: '',
		description: 'Book ID known to the company. Either Book or Book Code must be set.',
	},
	{
		displayName: 'Book Code',
		name: 'bookCode',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['upload'] } },
		default: '',
		description: 'Book code known to the company. Either Book or Book Code must be set.',
	},
	{
		displayName: 'Document Type Slug',
		name: 'documentTypeSlug',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Date From',
		name: 'date_from',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: '',
		description: 'Filter from date',
		routing: { send: { type: 'query', property: 'date_from', value: '={{$value || undefined}}' } },
	},
	{
		displayName: 'Date To',
		name: 'date_to',
		type: 'string',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: '',
		description: 'Filter to date',
		routing: { send: { type: 'query', property: 'date_to', value: '={{$value || undefined}}' } },
	},
	{
		displayName: 'Sort By',
		name: 'sort_by',
		type: 'options',
		options: [
			{ name: 'Classification Date', value: 'classification_date' },
			{ name: 'Creation Date', value: 'creation_date' },
			{ name: 'Document Date', value: 'document_date' },
		],
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 'creation_date',
		description: 'Sort by field',
		routing: { send: { type: 'query', property: 'sort_by' } },
	},
	{
		displayName: 'Sort Order',
		name: 'sort_order',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 'asc',
		description: 'Sort direction',
		routing: { send: { type: 'query', property: 'sort_order' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 1,
		routing: { send: { type: 'query', property: 'page' } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnlyForDocument, operation: ['listByType'] } },
		default: 50,
		description: 'Max number of results to return',
		typeOptions: { minValue: 1 },
		routing: { send: { type: 'query', property: 'limit' } },
	},
];
