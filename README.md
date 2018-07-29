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

# Triggering External Functions

Pressing `_postProcess` which calls the external function using the `call` method!! so that the external function will have access to the data entered on the form through the `this` object.

- `buttonAdd` is shown on:
    - the footer of the form created with the `formAdd` method
- `buttonDelete` is shown on:
    - the footer of the form created with the `formEdit` method
    - each row of the table created with the `tableShow` method
- `buttonSave` is shown on:
    - the footer of the form created with the `formEdit` method

When clicking on the edit icon on a row of a table, the external function is called with the `id` of ???
