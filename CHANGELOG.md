# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.1] - 2026-02-10

### Changed

- Removed a log
- Control Panel closed on demo page by default.

## [1.5.0] - 2026-02-09

### Added

- Added a new `filterVariables` option to exclude variables with specific prefixes from auto-detection (e.g. `"--arc-"` or `["--arc-", "--other-"]`).
- Control groups now have type-specific class names: `control-group--slider`, `control-group--color-modern` (oklch etc.), and `control-group--color-standard` for styling.

### Changed

- Order the properties in the UI based on the order they are defined in the CSS.
- Modern color formats display in the color chip so they have more visible room.

## [1.4.0] - 2026-01-14

### Changed

- Values properly written back to the scope they came from.
- Added [modern color picker](https://github.com/argyleink/css-color-component/) for colors like oklch().
- Shows warning if no variables are found.
- Updated README to link to prior art and the third-party bookmarklet.
