# Build Web Interfaces with JSON

`json-ui` is aimed at people who want to build a web interface, but don't want to mess about with design tools or frameworks. Not that they are a bad thing, but sometimes you just need to get a web interface up and running with minimum hassle.

>> Blah...

## How `json-ui` Works

>> ?????????????

### Internal Data Objects

|Data Object|Description|
|---|---|
|_defs|User form definitions, passed as an argument to the `init` function.|
|_messages|Internal information and error messages to be displayed to users. Loaded from `js/messages.js`.|
|_post|Post-processing functions for user forms, passed as an argument to the `init` function.|
|_validation|Internal validation patterns (in regular expression format) used for validating data entered into fields. Loaded from `etc/validation.js`.|

# Useful Links

- [Example Application](docs/example.md)
- [WIP and Issues](docs/issues.md)
