# Changelog

All notable changes to this project will be documented in this file.

## [0.0.3] - 2026-06-14

### Fixed
- Credential test no longer returns 403: `X-Company` moved into the credential
  `authenticate` headers (was only in node `requestDefaults`, which does not
  apply to credential tests); added `Accept: application/json` to the test request
- Wire `routing.send` on every parameter so query filters and request bodies are
  actually transmitted (previously all inputs except token refresh were ignored)
- Replace invalid `typeOptions.objectLikeOptions` in the Customer create body
  with a proper `options` collection
- JSON parameters (entry `lines` / piece data, Datahub `period`, `atomInputs`,
  filter and sort) accept objects from expressions, not only JSON strings
- Datahub Entries sort is now an `EntriesColumnSort` JSON object instead of the
  plain `ASC`/`DESC` enum
- Datahub: the old `graphqlQuery` field (never sent) is replaced by a GraphQL
  query field plus an Additional Variables JSON field available on every operation
- Account list: Account Class defaults to All instead of filtering on `G`;
  Expand renamed internally to `accountExpand` to avoid a type clash with the
  multi-option `expand` of company/user/entry
- Account/customer/provider/employee lists only send `page`/`limit` when set
  in the Pagination collection, so the API default page size applies otherwise
- Document create: `confidentialFor[]` is only sent when Is Confidential is
  true; Document ID / Source ID are no longer sent as `0` when left empty;
  multipart body is encoded manually instead of relying on native `FormData`

### Added
- Missing query parameters per API.md: account list filters
  (`account_class`, `complete_mode`, `expand`, `statuses`, `page`, `limit`),
  entry list filters (period/date/number/book ranges, `lettered`, `account_type`,
  `prefix`, `account`, `expand[]`), `complete_mode`/`page`/`limit` on
  provider/customer/employee lists, `third_label` on all counterpart lookups,
  `last` on fiscal years, and `expand` on companies/users
- Employee create body fields (previously missing)
- Datahub: typed per-operation fields that build the GraphQL `variables`, plus a
  GraphQL query field (selection sets are not documented in API.md)
- Document `create` and `upload`: binary/multipart file upload with the
  documented fields, overriding the default JSON content type

## [0.0.2] - 2026-06-14

### Changed
- Replace OAuth2 credential with custom integration auth for Fulll API
- Support environment selection (Production Fulll / Production Inexweb)
- Dynamic base URL based on selected environment
- Fixed node path in package.json

### Added
- Custom credential class `FulllApi` with client ID, secret, access token, refresh token
- Token resource with Refresh Token operation to rotate credentials
- Bearer token authentication via Authorization header

## [0.0.1] - Initial release
