# Changelog

All notable changes to this project will be documented in this file.


## [0.11.1](https://github.com/lcofre/stash/compare/v0.11.0...v0.11.1) (2026-05-24)

### Refactoring

* dispatch ContentRenderer on category type ([#30](https://github.com/lcofre/stash/issues/30)) ([2ba4700](https://github.com/lcofre/stash/commit/2ba47009ef6d88ceb34c3b799d186b9e9d12aa3b))
* merge AddTodoModal + EditTodoModal into TodoFormModal ([#29](https://github.com/lcofre/stash/issues/29)) ([778593a](https://github.com/lcofre/stash/commit/778593a61b440c85305037e93a5f6ea4a1ee24e2))

## [0.11.0](https://github.com/lcofre/stash/compare/v0.10.4...v0.11.0) (2026-05-23)

### Features

* add ProfileId context to remove prop threading ([#25](https://github.com/lcofre/stash/issues/25)) ([4a4d4ae](https://github.com/lcofre/stash/commit/4a4d4ae84a731cfa09b16748a1e16031a419897f)), closes [#26](https://github.com/lcofre/stash/issues/26)
* extract ContentRenderer as standalone component ([#28](https://github.com/lcofre/stash/issues/28)) ([8df626d](https://github.com/lcofre/stash/commit/8df626db2c875e6af5423c9bb0a7c7c048eea3fd))
* replace __calendar__ magic string with VIEW_MODES enum ([#24](https://github.com/lcofre/stash/issues/24)) ([862963f](https://github.com/lcofre/stash/commit/862963f32b24711cb5ba11b9ccf37abf2c1005a0)), closes [#20](https://github.com/lcofre/stash/issues/20)
* validate and strip metadata at command layer ([#27](https://github.com/lcofre/stash/issues/27)) ([de5a720](https://github.com/lcofre/stash/commit/de5a7202db030d5e01d8afd366ef7e08c7db6145))

### Documentation

* update CONTEXT.md with domain glossary and commands layer ([#23](https://github.com/lcofre/stash/issues/23)) ([9c922c8](https://github.com/lcofre/stash/commit/9c922c88e6e5c28fa428b5d8ee4da6579703720e))

## [0.10.4](https://github.com/lcofre/stash/compare/v0.10.3...v0.10.4) (2026-05-23)

## [0.10.3](https://github.com/lcofre/stash/compare/v0.10.2...v0.10.3) (2026-05-10)

### Bug Fixes

* add defensive checks for corrupted indexeddb data ([e7aabcb](https://github.com/lcofre/stash/commit/e7aabcb6f3eab7a2cf6dfcb3dc8312378e7ab382))
* add diagnostic logging and recovery utilities for corrupted data ([7e5268c](https://github.com/lcofre/stash/commit/7e5268cc1a6de09cccbe84778c35bd9862a17073))

## [0.10.2](https://github.com/lcofre/stash/compare/v0.10.1...v0.10.2) (2026-05-10)

### Bug Fixes

* calendar view filter on useTodosByProfile result ([828f038](https://github.com/lcofre/stash/commit/828f038f2acadf3fbd88d74b8a9867471089df99))

## [0.10.1](https://github.com/lcofre/stash/compare/v0.10.0...v0.10.1) (2026-05-10)

### Refactoring

* migrate AddTodoModal and EditTodoModal to useTodoForm hook ([b3d61cc](https://github.com/lcofre/stash/commit/b3d61cc3e812b1a9944055314ead6849d7194170)), closes [#2](https://github.com/lcofre/stash/issues/2)

### Documentation

* update ARCHITECTURE.md with completed modal migration ([cd9206d](https://github.com/lcofre/stash/commit/cd9206d9e5224e2bb5c465afc46fdb9e14eb5cb9))

## [0.10.0](https://github.com/lcofre/stash/compare/v0.9.0...v0.10.0) (2026-05-10)

### Features

* add edit modal and wire up todo editing ([47fd3f3](https://github.com/lcofre/stash/commit/47fd3f3f6bc3718937e166c995339fb75ef70ce1))

## [0.9.0](https://github.com/lcofre/stash/compare/v0.8.1...v0.9.0) (2026-05-10)

### Features

* add calendar grid view for todos with dates ([#19](https://github.com/lcofre/stash/issues/19)) ([3cca707](https://github.com/lcofre/stash/commit/3cca707420a1781c5fe0383aff1430ab3e38ef0b))

## [0.8.1](https://github.com/lcofre/stash/compare/v0.8.0...v0.8.1) (2026-05-10)

### Refactoring

* remove category context, use hooks everywhere ([#16](https://github.com/lcofre/stash/issues/16)) ([c5a5501](https://github.com/lcofre/stash/commit/c5a5501ebbdab0ac8e4604af1e50e5f745e6297c))

## 0.8.0 (2026-05-10)

### Features

* allow profile names to be edited inline ([f890464](https://github.com/lcofre/stash/commit/f890464c190bcedae30089255b4d96ed6e90c704))
* implement data layer, commands, and enricher foundations ([099c66b](https://github.com/lcofre/stash/commit/099c66b264ec1e1aa13bf7f40da96fd6225dfd13)), closes [#3](https://github.com/lcofre/stash/issues/3) [#4](https://github.com/lcofre/stash/issues/4)
* refactor enrichers to use SearchEnricher ([698dfb8](https://github.com/lcofre/stash/commit/698dfb8807edbc0749279a1cadaf675987d58a6e))
* split settings modal, consolidate cards, implement category caching ([fdf0c67](https://github.com/lcofre/stash/commit/fdf0c6778acc09a3b54e835d7c1dd0034a7c621d))

### Bug Fixes

* replace lucide Github icon with inline SVG ([eef05c7](https://github.com/lcofre/stash/commit/eef05c7e5d9947a7d41091675a947ea9a3c5f71c))

### Refactoring

* consolidate architecture across issues [#12](https://github.com/lcofre/stash/issues/12)-18 ([994862a](https://github.com/lcofre/stash/commit/994862adfebb08931791cab8e00ddf701cafbb76)), closes [#12-18](https://github.com/lcofre/stash/issues/12-18)

## [0.7.0] - 2026-05-09

### Features

- Split settings modal, consolidate cards, implement category caching
- Refactor enrichers to use SearchEnricher
- Implement data layer, commands, and enricher foundations
- Allow profile names to be edited inline

### Bug Fixes

- Replace lucide Github icon with inline SVG

## [0.6.0] - 2026-05-09

> Version calculated from git history. Existing commits were mapped retroactively — future releases will use conventional commit messages.

### Features

- Replace horizontal scroll tabs with wrapping pills, add GitHub link
- Redesign UI for modern minimalism and mobile clarity
- Improve PWA offline support with aggressive caching
- Design polish: contrast, mobile typography, new icons
- Redesign UI — The Archivist aesthetic

## [0.1.0] - 2025-01-01

### Features

- Initial implementation of Stash PWA
