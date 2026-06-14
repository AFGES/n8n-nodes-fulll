# API Documentation

This API is is organized around REST. Our API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API errors. We use built-in HTTP features, like HTTP authentication and HTTP verbs, which are understood by off-the-shelf HTTP clients. JSON is returned by all API responses, including errors, although our API libraries convert responses to appropriate language-specific objects.

## HTTP API

## HTTP Methods

### GET

`GET` requests are the most common and widely used methods in APIs and websites. Simply put, the GET method is used to **retreive data from a server at the specified resource.** You have 2 use :

### POST

`POST` requests are used to send data to the API sever to create or udpate a resource. The data sent to the server is stored in the request body of the HTTP request.

### PUT

Use `PUT` APIs primarily to update existing resource (if resource does not exist then API may decide to create a new resource or not)

### PATCH

Similar than POST, but The difference with `PATCH` is that you **only apply partial modifications to the resource.**

### DELETE

The `DELETE` method is exactly as it sounds: delete the resource at the specified URL. This method is one of the more common in RESTful APIs.

## Status Codes and Errors

### Introduction

HTTP defines forty standard status codes, they are divided into the five categories presented below, We use only 3 categories:

| Category | Name |
| --- | --- |
| 2xx: Sucesss | Indicates that the client's request was accepted successfully. |
| 4xx: Client Error | This category of error status codes points the finger at clients. |
| 5xx: Server Error | The server takes responsibility for these error status codes. |

### Common codes

These are the most commons code you will encounter:

| Code | Status | Description |
| --- | --- | --- |
| 200 | OK | Request was successful. |
| 201 | Created | A resource has been created on the server. |
| 202 | Accepted | The request has been accepted for processing but has not yet completed. |
| 204 | No Content | The request was processed successfully, but no response body is needed. |
| 400 | Bad Request | One or more parameters are missing or maybe mispelled. |
| 401 | Unauthorized | Invalid or missing credentials. |
| 403 | Forbidden | Usually due to an invalid authentication. |
| 404 | Not Found | You requested an invalid method. |
| 405 | Method Not Allowed | The verb/method you used to fulfill the request is not supported for this resource. |
| 409 | Conflict | The request could not be completed due to a conflict with the current state of the target resource. |
| 501 | Not implemented | Requested HTTP operation not supported. |
| 502 | Bad Gateway | The remote server returned an error. Likely a timeout. The request should be retried with exponential backoff. |
| 503 | Service Unavailable | Indicates that the services is temporarily unavailable due to system overload or maintenance. |
| 504 | Gateway Timeout | A service required to fulfill the request was not available. |

## Authentication

## Using OAuth 2.0

OAuth 2.0 is a protocol that lets your app request authorization to private details in a Fulll user's account without getting their password.

You'll need an unique Client ID and Client Secret which will be used in the OAuth flow.

**The Client Secret should not be shared.**

### Obtaining access tokens with OAuth 2.0

Fulll uses OAuth 2.0's [authorization code grant flow](https://tools.ietf.org/html/rfc6749#section-4.1) to issue access tokens on behalf of users.

#### 1. Sending users to authorize

Your web app should redirect users to the following URL:

`GET https://auth.fulll.io/oauth2/authorize`

The following values should be passed as GET parameters:

- `client_id` - provided by Fulll (required)
- `redirect_uri` - you can choose one of the redirection urls set-up in your profile (optional)

#### 2. Users are redirected to your server with a verification code

If the user authorizes your app, Fulll will redirect back to your specified `redirect_uri` or default with a temporary code in a `code` GET parameter and to finish the `X-Company` to be sent in every request Header.

#### 3. Exchanging a verification code for an access token

Using token route, exchange the auth code for an access token.

`POST https://api.fulll.io/cred/oauth2/token`

The following values should be passed as POST data:

- `grant_type` - should be `authorization_code` (required)
- `client_id` - provided by Fulll (required)
- `client_secret` - provided by Fulll (required)
- `code` - a temporary authorization code (required)

You'll receive a JSON response containing an `access_token`:

```
{
    "access_token":"bearer_token",
    "token_type": "bearer",
    "expires_in": "token_expiration",
    "refresh_token": "refresh_token"
}
```

### Using access tokens

The token awarded can be used in request to our web APIs.

For using it to Authenticate request, presenting them in a request's `Authorization` HTTP header

```
GET /api/....
Authorization: Bearer xoxb-1234-abcdefgh
X-Company: 295399
```

Note: The `X-Company` can be omit for standard publisher. Once the token has been created, the server should store the x-company and use it in subsequent requests.

### Refreshing tokens

If a token has expired, it can be refreshed using the token route.

`POST https://api.fulll.io/cred/oauth2/token`

The following values should be passed as POST data:

- `grant_type` - should be `refresh_token` (required)
- `client_id` - provided by Fulll (required)
- `client_secret` - provided by Fulll (required)
- `refresh_token` - a refresh token provided in step 3 or after a previous refresh. A new refresh token is generated each time. (required)

Like in step 3, you'll receive a JSON response containing an `access_token`:

```
{
    "access_token":"bearer_token",
    "token_type": "bearer",
    "expires_in": "token_expiration",
    "refresh_token": "refresh_token"
}
```

## Accounting

### Preferences

#### List company's preferences [GET](#accounting-preferences-get)`/accounting/v1/preferences`

List the accounting preferences of the company.
Here you can find all informations about how accounts, labels, etc. are handled for this specific company.

#### Analytic

There's two possible modes for analytic

- `simple` - with a simple analytic mode, you will always 100% on a single center and a single axis. Usually only on Profit & Loss accounts.
- `complete` - complete mode allows splitting of amounts over multiple centers and multiple axes. Usally on all account types.

#### Account types

The preferences will list some account types. They're accounts or class of accounts (accounts beginning with xxx) that are categorized. That way you can know how to list or create some specific sub account types. Each type can be empty, or have multiple entries.

Possible account types

| type | description |
| --- | --- |
| C | Customers |
| F | Providers |
| S | Employees |
| R | Remuneration |
| CS | Social payments |
| ET | State tax |
| AT | Other transactions in case of direct payment |
| B | Bank related accounts |
| VI | Internal cash transfer |
| VATB | VAT accounts in case of buying something |
| VATS | VAT accounts in case of selling something |
| VAT | All VAT accounts |
| SHIPS | Shipping in case of selling something |
| SHIPB | Shipping in case of buying something |
| DISCS | Discount in case of selling something |
| DISCB | Discount in case of buying something |
| BANK | Strict bank accounts |
| LOSS | Loss acounts |
| PROFIT | Profit accounts |
| CASH | Cash operations related accounts |

#### Validation rules

The preferences will also list some validation rules. They're provided in addition to basic informations like the maximum length of an account to validate more precisely if informations are accepted by the accounting software. Each validation rule will have a string id, a regular expression and a message to display in case of validation fail.

Possible validation rules

| id | description |
| --- | --- |
| account.general.number | general account number |
| account.customer.number | customer account number |
| account.provider.number | provider account number |
| account.general.label | general account label |
| account.customer.label | customer account label |
| account.provider.label | provider account label |
| piece.number | piece number |
| piece.label | piece label |

### Fiscal years

#### List fiscal years — `GET /accounting/v1/fiscal_years{?last}`

List the available fiscal years. All existing fiscal years are listed, but closed ones are unavailable for writing.

last
:   `boolean` (optional) Default: false — Reduce to the last fiscal year

### Books

#### List books — `GET /accounting/v1/books`

List books.

> **Warning ⚠️** Only open (active) or closed (inactive) books are returned. Deleted books are not returned.

### Accounts

#### List accounts — `GET /accounting/v1/accounts{?account_class,complete_mode,page,limit}`

List accounts.

account\_class
:   `string` (optional) — Account **type**, not class. Choices: `G` `C` `F` `E`

complete\_mode
:   `string` (optional) — If 1, returns accounts with debit, credit and balance. Choices: `1` `0`

expand
:   `string` (optional) — Return the requested property in response

statuses
:   `string` (optional) — By default, returns all accounts regardless of status. Choices: `open` `closed` `deleted`

page
:   `number` (optional) Default: 1 — Page number

limit
:   `number` (optional) — Maximum number of accounts per page

#### List counterparts of an account — `GET /accounting/v1/accounts/{account_number}/counterparts/{book_code}{?third_label}`

List the counterparts (linked accounts) for a given account in a given book. The account number can be of any type.

account\_number
:   `string` (required) — Account number. Example: `9PROVIDER`

book\_code
:   `string` (required) — Book code. Example: `AC`

third\_label
:   `string` (optional) — Filter results with a label that contains the required string. Example: `PARIS`

#### Account creation — `POST /accounting/v1/accounts`

Create a new account for the given type.

#### Account's balances — `GET /accounting/v1/balances`

Get the balance of accounts.

> **Warning ⚠️** In the response, there is either the `period` or `date` property. If the `mode` parameter is set to `period`, then the `period` property will be returned. If the `mode` parameter is set to `date`, then the `date` property will be returned.

mode
:   `string` (required) — `period` or `date`

class
:   `string` (required) — Account type (C/F) otherwise start number (706, 4456…)

periodstart
:   `string` (optional) — filter on period `mm/yyyy` of the exercice

periodend
:   `string` (optional) — filter on period `mm/yyyy` of the exercice

exercice
:   `string` (optional) — filter to the given code exercice, otherwise use the current (last) exercice

### Providers

#### List providers — `GET /accounting/v1/providers{?complete_mode,page,limit}`

List of providers, which are a specific account type.

complete\_mode
:   `string` (optional) — If 1, returns accounts with debit, credit and balance. Choices: `1` `0`

page
:   `number` (optional) Default: 1 — Page number

limit
:   `number` (optional) — Maximum number of accounts per page

#### List counterparts of a provider — `GET /accounting/v1/providers/{provider_number}/counterparts/{book_code}{?third_label}`

provider\_number
:   `string` (required) — Account number of the provider

book\_code
:   `string` (required) — Book code

third\_label
:   `string` (optional) — Filter results with a label that contains the required string

#### Provider creation — `POST /accounting/v1/providers`

Create a new provider.

### Customers

#### List customers — `GET /accounting/v1/customers{?complete_mode,page,limit}`

complete\_mode
:   `string` (optional) — If 1, returns accounts with debit, credit and balance.

page
:   `number` (optional) Default: 1

limit
:   `number` (optional)

#### List counterparts of a customer — `GET /accounting/v1/customers/{customer_number}/counterparts/{book_code}{?third_label}`

customer\_number
:   `string` (required)

book\_code
:   `string` (required)

third\_label
:   `string` (optional)

#### Customer creation — `POST /accounting/v1/customers`

Create a new customer.

### Employees

#### List employees — `GET /accounting/v1/employees{?complete_mode,page,limit}`

complete\_mode
:   `string` (optional)

page
:   `number` (optional) Default: 1

limit
:   `number` (optional)

#### List counterparts of an employee — `GET /accounting/v1/employees/{employee_number}/counterparts/{book_code}{?third_label}`

employee\_number
:   `string` (required)

book\_code
:   `string` (required)

third\_label
:   `string` (optional)

#### Employee creation — `POST /accounting/v1/employees`

Create a new employee.

### Analytics

#### List analytic settings — `GET /accounting/v1/analytics`

List the analytic settings. A company can have multiple independant analyzes. Each analysis can have up to 3 axes. Each axis will have its own sections.

### Currencies

#### List currencies — `GET /accounting/v1/currencies`

List the available currencies. All listed currencies can be used while creating entries.

### Payment types

#### List payment types — `GET /accounting/v1/payment_types`

List the available payment types of the company.

### Documents

#### Send a document to Image Posting — `POST /accounting/v1/documents`

Send document to Image Posting. If the company has configured the Purchase module and the document is sent to a purchase book, the document will initially be available in the Purchase application.

| Name | Example | Description |
| --- | --- | --- |
| `company` (string, required) | `295399` | ID of the company |
| `book` (number, optional) | `1234` | Book ID, the ID must be known to the company |
| `bookCode` (string, optional) | `AC` | Book code - the code must be known to the company |
| `file` (object, required) | `myfile.pdf` | File to upload - only pdf format accepted |

> **Warning ⚠️** The user can set a book identifier in the `book` property or a book code in the `bookCode` property. At least one of them must be defined.

### Entries

#### List Entries — `GET /accounting/v1/entries{?expand[],period_start,period_end,date_start,date_end,number_start,number_end,lettered,account_type,prefix,book_start,book_end,account}`

List entries. By default entries are retrieved on current fiscal year (**last**) only. To retrieve previous fiscal years entries, date or period filters have to be set, and then other filters are eventually applied.

account\_type
:   `string` (optional) — Choices: `C` `F` `E`

prefix
:   `string` (optional) — filter to the given number prefix, override account\_type if given

period\_start
:   `string` (optional) — `mm/yyyy`

period\_end
:   `string` (optional) — `mm/yyyy`

date\_start
:   `string` (optional) — `dd/mm/yyyy`

date\_end
:   `string` (optional) — `dd/mm/yyyy`

number\_start
:   `string` (optional)

number\_end
:   `string` (optional)

book\_start
:   `string` (optional) — from book code

book\_end
:   `string` (optional) — to book code

account
:   `string` (optional) — filter to the given account number

lettered
:   `boolean` (optional) — `true`: lettered entries only / `false`: non-lettered only / empty: both

expand[]
:   `string` (optional) — Choices: `document_url` `analytics`

#### Add entries — `POST /accounting/v1/entries`

Add entries. Adding entries is divided in two parts: first the global infos, then the lines. Multiple entries sent at once are called a piece. Entries are handled in asynchronous transactions, the ID of the command is returned by the POST.

> **Warning ⚠️** The user can set a book identifier in the `journal_id` parameter or a book code in the `book_code` parameter. At least one of them must be defined. If both are defined, the value of `journal_id` will be used. The user can set a piece value in the `piece` parameter. It could be possible to set the value \* and the final value will be auto-complete by the accounting software. This field is only supported by Production FULLL accounting software.

#### Add expense report — `POST /accounting/v1/expense_report`

Add entries specifically for an expense report piece. Entries are handled in asynchronous transactions, the ID of the command is returned by the POST.

> **Warning ⚠️** The user can set a book identifier in the `journal_id` parameter or a book code in the `book_code` parameter. If the `journal_id` parameter is set, then it will be used instead of the `book_code`. If the `journal_id` parameter is set, a restriction is applied if the identifier is unknown to the company.

#### Add purchase invoice — `POST /accounting/v1/purchase`

Add entries specifically for purchase invoice piece. Entries are handled in asynchronous transactions, the ID of the command is returned by the POST.

#### Add sales invoice — `POST /accounting/v1/sales`

Add entries specifically for sales invoice piece. Entries are handled in asynchronous transactions, the ID of the command is returned by the POST.

#### List commands — `GET /accounting/v1/commands{?ids,page,limit}`

List asynchronous commands with their statuses.

| status | indicator | description |
| --- | --- | --- |
| 0 | Queued | The command has been queued and should be processed shortly |
| 1 | Recorded | The command has been processed without any error |
| 2 | Error | An error has been encountered, the error message is provided |
| 3 | Processing | The command is being processed |

ids
:   `array` (optional) — List of command IDs separated by commas

page
:   `number` (optional) Default: 1

limit
:   `number` (optional)

## Cred

### Companies

#### List companies — `GET /cred/v1/access/companies.json{?page,max_per_page,q,state,expand}`

List companies that the user can access.

state
:   `string` (optional) Default: `active` — Choices: `active` `locked`

page
:   `number` (optional)

max\_per\_page
:   `number` (optional)

q
:   `string` (optional) — Searched term in corporate name and file number

expand
:   `array` (optional) — Choices: `corporate_name` `file_number` `vip` `favorite`

### Companies access

#### Check companies access — `GET /cred/v1/access/companies/{company_ids}.json`

Check if a user has access right to the requested companies.

company\_ids
:   `string` (required) — Company ids separated by `,`. Example: `128,345,56`

### Users

#### List users — `GET /cred/v1/access/users.json{?page,max_per_page,q,state,type,company,include_me,expand}`

List other users that the user can access.

page
:   `number` (optional)

max\_per\_page
:   `number` (optional)

q
:   `string` (optional) — Searched term in firstname, lastname and email

state
:   `string` (optional) Default: `active` — Choices: `active` `locked`

type
:   `string` (optional) Default: `all` — Choices: `all` `practitioner` `client`

company
:   `string` (optional) — Filter by company identifier

include\_me
:   `bool` (optional) — Force requested user to be returned in response

expand
:   `array` (optional) — Choices: `email` `firstname` `lastname` `profile`

### Users access

#### Check users access — `GET /cred/v1/access/users/{user_ids}.json`

Check if a user has access right to the requested users.

user\_ids
:   `string` (required) — User ids separated by `,`. Example: `128,345,56`

### Module access

#### Check module access — `GET /cred/v1/access/modules/{module_id}.json`

Check if a user is allowed to use an application.

module\_id
:   `string` (required) — Module id

## Document

### Document creation

#### Document creation — `POST /document/v1/documents.json`

Upload a new document.

| Name | Example | Description |
| --- | --- | --- |
| `node` (string, required) | `companies` | Master location of a document privacy between `myDocuments`, `companies` or `users` |
| `nodeId` (string, required) | `companies_295399` | Id of the user or the company, null if myDocuments |
| `parent` (string, optional) | `123` | Document type ID for node `companies` or `users`. Cannot be used with `parentSlug` |
| `parentSlug` (string, optional) | `payslip` | Document type slug. Cannot be used with `parent` |
| `documentId` (number, optional) | `214` | Document ID if new version of an existing document |
| `file` (object, required) | `(binary)` | File to upload |
| `fileName` (string, optional) | `AnotherFile.pdf` | Document public filename |
| `comments` (string, optional) | `This is an amazing file` | Comment about the document |
| `confidential` (string, optional) |  | Only visible by practitioners |
| `documentDate` (string, optional) | `2019-07-31` | `yyyy-mm-dd`, if null document's date will be current date |
| `classificationDate` (string, optional) | `2019-07-31` | `yyyy-mm-dd` necessary if document's path is detailed per month |
| `sourceApp` (string, optional) | `sourceAppName` | Name of app that sent the document |
| `sourceId` (number, optional) | `124` | ID of the document stored in the source app |
| `sourceUrl` (string, optional) | `https://source-app-url.eu/tasks/1234` | URL of the document stored in the source app |
| `isConfidential` (boolean, optional) | true | Mark the document visible and available for practitioners only |
| `confidentialFor` (array[number], optional) | [123] | Can be used only if `isConfidential` is true. Contains only ids of client users you want to grant access to the document |

### List document types

#### List document types — `GET /document/v1/company/types.json`

List all document types with the slug for a company according user accesses.

### List documents by type

#### List documents by type — `GET /document/v1/files/{documentTypeSlug}/list.json{?date_from,date_to,sort_by,sort_order,page,limit}`

List documents the user has access to on a company based on a slug of a document type.

documentTypeSlug
:   `string` (required)

date\_from
:   `date` (optional)

date\_to
:   `date` (optional)

sort\_by
:   `enum` (optional) — Choices: `classification_date` `creation_date` `document_date`

sort\_order
:   `enum` (optional) — Choices: `asc` `desc`

page
:   `number` (optional)

limit
:   `number` (optional)

## Datahub

This set of API gives access to our datahub to query data easily. Quick and Complete Access to all data sources: After a first step of authentication, every connected application/client has immediate access to all allowed data in the system.

List of available dataTypes:

- Accounting (COA/Account)
- Indicator
- Forecast
- DSN
- Fact

### Company

#### Company — `POST /datahub/v1/graphql`

Retrieve specific information regarding a company. For now only accounting metadata information are available.

| Name | Example | Description |
| --- | --- | --- |
| `isClosed` (boolean, optional) | `false` | When true or false, returns either open or closed fiscal years. When not specified, returns all. |
| `sort` (Sort, optional) | `ASC` | Sort fiscal years chronologically or vice versa. Default: chronological. |

### DataTypes

#### List dataTypes — `POST /datahub/v1/graphql`

List all data sources available (or that were once available) for a given company.

### AtomDefinition

#### Atoms definitions — `POST /datahub/v1/graphql`

List all the Atom IDs available for a specific data source and give the detailed datastructure of those atoms. A filter can be added to do a search.

| Name | Example | Description |
| --- | --- | --- |
| `dataType` (DataType, required) | `COA` | Filter to restrict the search on the COA dataType. |
| `filter` (string, optional) | `abc` | Search for a pattern in the name and label of the atom definition. |
| `first` (number, optional) | `2` | Number of elements to retrieve. |
| `after` (string, optional) | `Mdo=` | Starting base64-encoded index of the pagination. |

### FiscalYears

#### Fiscal years — `POST /datahub/v1/graphql`

Retrieve the list of fiscal years associated with a company.

| Name | Example | Description |
| --- | --- | --- |
| `isClosed` (boolean, optional) | `false` | When true or false returns either open or closed fiscal years. When not specified returns all. |
| `sort` (Sort, optional) | `ASC` | Sort chronologically or vice versa. Default: chronological. |

### Currency

#### Currency — `POST /datahub/v1/graphql`

Retrieve the currency associated to a company.

### Entries

#### Entries — `POST /graphql`

List all the Entries for a company for a period. Filters can be added to define a more precise result.

| Name | Example | Description |
| --- | --- | --- |
| `period` (Period, required) | `2020-31-12` | Object to define the date range. Format: year-month-day. |
| `accountId` (string, optional) | `e931a0edb6a6` | Account id to filter on this specific entry field. |
| `filter` (EntriesByCompanyIdFilterInput, optional) | `abc` | Filter to search on different entry fields such as `label` or `analytics`. |
| `sort` (EntriesColumnSort, optional) | `ASC` | Sorting instruction allowing you to choose the column and direction. Default: anti-chronological on date. |

### Accounts

#### Accounts — `POST /graphql`

Request the list of accounts available on the company.

### Analytic

#### Analytic — `POST /graphql`

Get the analytic associated to a company. Allows to know if analytic dimensions are present for a specific company.

### Analysis

#### Analysis — `POST /graphql`

Get the tree structure associated to a company. Allows to retrieve analysis for a specific company.

### Values by DataTypes

#### Headings sums — `POST /datahub/v1/graphql`

Get raw or aggregated values for a list of headings sums.

| Name | Example | Description |
| --- | --- | --- |
| `dataType` (DataType, required) | `COA` | Filter to restrict the search on the COA dataType. |
| `atomInputs` (array[AtomInput], required) | `{ id:"044acf60" dataPart:["heading_value"]}` | ID and part of the required Atom. |
| `period` (object, required) | `(startDate, endDate)` | Data period. |
| `scale` (Scale, required) | `MONTH` | Unit in the period. |
| `calculation` (CalculationMode, required) | `TRANSACTIONAL` | Type of calculation. |
| `first` (number, optional) | `2` | Number of elements to retrieve. |
| `after` (string, optional) | `Mdo=` | Starting base64-encoded index of the pagination. |

### Raw or aggregated account sums

#### Accounts sums — `POST /datahub/v1/graphql`

Get raw or aggregated values for a list of accounts sums.

| Name | Example | Description |
| --- | --- | --- |
| `dataType` (DataType, required) | `ACCOUNT` | Filter to restrict the search on the ACCOUNT dataType. |
| `atomInputs` (array[AtomInput], required) | `{id:"044acf60" dataPart:["heading_value"]}` | ID and part of the required Atom. |
| `period` (object, required) | `(startDate, endDate)` | Data period. |
| `scale` (Scale, required) | `MONTH` | Unit in the period. |
| `calculation` (CalculationMode, required) | `TRANSACTIONAL` | Type of calculation. |
| `first` (number, optional) | `2` | Number of elements to retrieve. |
| `after` (string, optional) | `Mdo=` | Starting base64-encoded index of the pagination. |
