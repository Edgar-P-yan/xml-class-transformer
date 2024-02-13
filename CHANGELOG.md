# Changelog

## WIP v2.0.0

- separate decorators XmlAttribute, XmlChardata, XmlComments, XmlChildElem
- add basic support for XML comments
- add support for bigint as primitive type
- rename XmlEntity to XmlElem, XmlProperty to XmlChildElem
- concatenate text nodes when parsing chardata (before this only first text node was being parsed)
- docs: added more JSDocs
- internal: minor improvements and refactoring

- support circular dependencies by specifying `type` and `union` only via functions
- rename `AnyClass` to `XmlClass` and add comments about constructor arguments
- internal: fix `serializeUnionForLog` error messages
- internal: add `isPrimitiveType` helper

## v1.0.3

[Compare](https://github.com/edgar-p-yan/xml-class-transformer/compare/v1.0.2...v1.0.3)

- fix export of XmlAttribute

## v1.0.2

[Compare](https://github.com/edgar-p-yan/xml-class-transformer/compare/v1.0.1...v1.0.2)

- fix types for XmlAttributeOptions

## v1.0.1

[Compare](https://github.com/edgar-p-yan/xml-class-transformer/compare/v1.0.0...v1.0.1)

- fix README.md

## v1.0.0

[Compare](https://github.com/edgar-p-yan/xml-class-transformer/compare/v0.1.1...v1.0.0)

- consistent null and undefined values handling and docs about it.
- consistent primitive values parsing, fixed floats.
- fixed support for non-array unions.
- unions are now specified with separate option "union".
- more fail fasts with helpful error messages.
- separate XmlAttribute decorator.
- add CHANGELOG.md
- internal: more test suits to test complex cases

## v0.1.1

[Compare](https://github.com/edgar-p-yan/xml-class-transformer/compare/v0.1.0...v0.1.1)

- update README.md.

## v0.1.0

[Compare](https://github.com/Edgar-P-yan/xml-class-transformer/compare/v0.0.5...v0.1.0)

- fail fast if the same XML tag name is used for more than one property inside the same XML class.

## v0.0.5

[Compare](https://github.com/Edgar-P-yan/xml-class-transformer/compare/v0.0.4...v0.0.5)

- internal: remove `.npmignore` in favor of `package.json`'s `files` field.

## v0.0.4

[Compare](https://github.com/Edgar-P-yan/xml-class-transformer/compare/v0.0.2...v0.0.4)

- add examples
- internal: refactor files structure
- internal: separate metadata registry

## v0.0.2

[Compare](https://github.com/Edgar-P-yan/xml-class-transformer/compare/v0.0.1...v0.0.2)

- add an option to remove or set custom doctype

## v0.0.1

[Compare](https://github.com/Edgar-P-yan/xml-class-transformer/tree/v0.0.1)

- first working version
