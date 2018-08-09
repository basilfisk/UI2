# Application Definition Files

**json-ui** uses 3 files to build an application:

- `menus.js` defines the structure of the menu and options
- `forms.js` defines the structure of the tables and forms called from the menu options
- `fields.js` defines the list of fields and lists referenced by `forms.js`

## Missing tests

can fields.type:id no validation yet. have checks:mandatory set?
can fields.type:list have checks:mandatory set?
can fields.type:integer be extended to support number|float|etc and checks?
checkbox is supported in `_validate`, but needs to be validated
id is supported in `_validate` as text, but needs to be validated

## Menu Definitions

The table describes the structure of the data in `menus.js` that defines the menus and menu options within the application.

|Structure|Element|Type|Mand.|Content|
|---|---|---|---|---|
|title||Object|Yes|Application banner.|
||text|String|Yes|Application name.|
||class|String|No|Styling for application name.|
|menubar||Array|Yes|Top level menus, each menu is defined in an object.|
|||Object|Yes|Valid keys are *id, menu, options, title*.|
||id|String|Yes|ID of the menu.|
||menu|String|Yes|ID of the ????.|
||title|String|Yes|Title of the menu.|
||options|Array|Yes|Menu options, each option is defined in an object.|
||options[]|Object|Yes|Valid keys are *access, action, id, title*.|
||options[].access|Array|Yes|User access level. Must be one of *manager, superuser, user*.|
||options[].action|String|Yes|Command to be invoked when the menu option is selected.|
||options[].id|String|Yes|ID of the menu option.|
||options[].title|String|Yes|Title of the menu option.|

## Field Definitions

The `fields.js` file holds the definition of all fields and lists referenced by forms within the application. This file is used to check that the fields and lists referenced in forms are valid. The `fields` object is made up of the field name and the mapping to the element that holds the field data within the data object passed into the `init` function using the `tableShow` function. The `lists` object holds the name of each list with a value of `true`.

~~~
{
	"fields": {
		"aboutBundles": "bundles",
		"aboutClients": "clients",
		...
	},
	"lists": {
		"bundleCommandList": true,
		"bundleConnectorList": true,
		...
	}
}
~~~

## Form Definitions

The structure of `forms.js` is an object that contains a series of nested objects that each holds the definition of a table or form within the application. Each nested object is identified by a unique name whose value is an object that defines the form or table.

~~~
{
	"formN": {
		form definition...
	},
	"tableN": {
		table definition...
	},
	...
}
~~~

The table describes the structure of the elements holding the form and table definitions for the application that are held within `forms.js`.

|Element|Type|Mand.|Content|
|---|---|---|---|
||Object|Yes|Each form object must have the *type*, *title*, *buttons* and *fields* elements. Each table object must have the *type*, *title*, *buttons* and *columns* elements. Both forms and tables can have the optional *width* element.|
|type|String|Yes|Type of structure. Must be one of *form* or *table*.|
|title|String|Yes|Form or table title.|
|width|Integer|No|Width of the form or table, expressed as a percentage. Must be between in the range 10 to 100.|
|buttons|Object|Yes|Defines the set of buttons available on the form or table.|
|columns|Array|Yes|For tables only. Defines the set of columns that make up the table.|
|fields|Object|Yes|For forms only. Defines the set of fields that make up the form. The contents of this object are described in details below.|

The next table describes the elements within the `buttons` object. This object applies to both **tables** and **forms**.

|Button|Element|Type|Mand.|Content|
|---|---|---|---|---|
|||Object|Yes|Elements within the `buttons` object are also objects. They must be identified by one of the following names: *add*, *close*, *delete*, *edit* or *ok*.|
|add||Object|No|The Add button only applies to *tables*.|
||form|String|Yes|Name of the form to be displayed for adding data. The value must reference a top level object in `forms.js`.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|
|close||Object|No|The Close button applies to *forms* and *tables*.|
||button|Object|Yes|Contains button styling.|
||button.class|String|Yes|Icon to be used for the button.|
||button.image|String|Yes|Background style for the button.|
|delete||Object|No|The Delete button only applies to *tables*.|
||action|String|Yes|Function to be run when button is pressed.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|
||column|Object|Yes|Contains styling for the column heading of the Delete button in the table.|
||column.style|String|Yes|Style for the column heading.|
||column.title|String|Yes|Column heading.|
||key|String|Yes|Field holding the unique ID of the rows in the table. The value must be in the `fields` object in `fields.js`.|
|edit||Object|No|The Edit button only applies to *tables*.|
||form|String|Yes|Name of the form to be displayed for editing data. The value must reference a top level object in `forms.js`.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|
||column|Array|Yes|Contains styling for the column heading of the Edit button in the table. Elements within the `columns` array are objects.|
||column.style|String|Yes|Style for the column heading.|
||column.title|String|Yes|Column heading.|
|ok||Object|No|The OK button only applies to *forms*.|
||action|String|Yes|Function to be run when button is pressed.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|

The following table describes the elements within the `fields` object. Each element has the name of a field to be displayed on the form and a value which is an object. The name must be in the `fields` object in `fields.js`. Each object in the value holds a set of elements that are identified by one of the following names: *description*, *edit*, *options*, *title*, *type* or *visible*. The `fields` object only applies to **forms**.

|Element|Type|Mand.|Content|
|---|---|---|---|
|description|String|No|Description of the field. This is displayed within an empty field.|
|edit|Boolean|No|Flags whether the field can be edited or is read only.|
|title|String|No|The label displayed to the left of the field. This is mandatory if the field is visible.|
|type|String|Yes|This defines the content of the field. Valid values are *id*, *integer*, *list*, *password* and *text*.|
|visible|Boolean|Yes|Flags whether the field is displayed or hidden.|

The `type` element defines the content and operation of the field to which it belongs. The `type` element works in conjunction with the `options` object, which provides context to the way in which the field operates. The table describes the elements within the `options` object for each type. Valid types are *id*, *integer*, *list*, *password* and *text*.

|Type|Element|Type|Mand.|Content|
|---|---|---|---|---|
|array|checks|Object|Yes|Defines the checks that can be applied to the entry.|
||checks.format|String|Yes|The format pattern to be used to validate the entry (see below for a list of patterns).|
||checks.mandatory|Boolean|Yes|Defines whether a value must be entered in the field.|
||separator|String|Yes|The character used to separate elements of the array when displayed as a string in the field.|
|checkbox||||To be completed.|
|id||||To be completed.|
|integer|checks|Object|Yes|Defines the checks that can be applied to the entry.|
||checks.format|String|Yes|The format pattern to be used to validate the entry (see below for a list of patterns).|
||checks.mandatory|Boolean|Yes|Defines whether a value must be entered in the field.|
||checks.range|Object|No|Checks whether the data entry is within a range. Tests the `min` value and/or the `max` value. If both are defined, checks whether the `min` is less than `max`.|
||checks.range.min|Integer|No|Minimum value that can be entered in the field.|
||checks.range.max|Integer|No|Maximum value that can be entered in the field.|
|list|list|String|Yes|This is the name of the list that holds the values to be displayed. The name must be in the `lists` object in `fields.js`.|
||display|Object|Yes|Controls the display of the list.|
||display.height|Integer|No|Defines the height of the list. This is mandatory if `select` is *multiple*.|
||display.select|String|Yes|Defines whether the list allows a single option or multiple options to be selected. The value must be *single* or *multiple*.|
|password|checks|Object|Yes|Defines the checks that can be applied to the entry.|
||checks.format|String|Yes|The format pattern to be used to validate the entry (see below for a list of patterns).|
||checks.mandatory|Boolean|Yes|Defines whether a value must be entered in the field.|
|text|checks|Object|Yes|Defines the checks that can be applied to the entry.|
||checks.format|String|Yes|The format pattern to be used to validate the entry (see below for a list of patterns).|
||checks.mandatory|Boolean|Yes|Defines whether a value must be entered in the field.|
||display|Object|No|Controls the display of the list.|
||display.height|Integer|No|Defines the height of the text field.|

The table shows the list of validation patterns that are available to test the content of the data entered into a field. These patterns are regular expressions.

|Code|Pattern|Description|
|---|---|---|
|alphaLower|[a-z]+$|Lower case alphabetic string|
|alphaMixed|[a-zA-Z]+$|Mixed case alphabetic string|
|alphaUpper|[A-Z]+$|Upper case alphabetic string|
|alphaNumeric|^\\w+$|Alphanumeric string|
|alphaNumericSpecial|^[\\w \\-_]+$|Alphanumeric string, including space, hyphen and underscore|
|email|[a-z0-9!#$%&\"*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|must be an email address|
|filename|^[\\w\/\\-_]+$|Alphanumeric string, including forward slash, hyphen and underscore|
|float|^-*\\d*\\.\\d+$|Floatng point|
|integer|^-*\\d+$|Integer|
|ipv4|^\\*$|^(?!0)(?!.*\\.$)((1?\\d?\\d|25[0-5]|2[0-4]\\d)(\\.|$)){4}$|IP v4 address or * for any client|
|password|^[\\w \\-_]+$|Password, with alphanumeric, space, hyphen and underscore characters|
|url|^[\\w\/\\.\\-_]+$|URL|

# Validating the Application Definition Files

A script called `example/client/check` can be run to validate the files in the sample application. The script must be run using NodeJS, and the output of the tests is written to the console.

~~~bash
JSONUI=./json-ui/js
ROOT=../../example/client/ui
node $JSONUI/validate.js $ROOT/forms.js $ROOT/menus.js $ROOT/fields.js
~~~

