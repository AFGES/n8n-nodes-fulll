# Changelog

All notable changes to this project will be documented in this file.

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
