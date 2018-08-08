# Application Definition Files

**json-ui** uses 3 files to define the structure of an application:

- `menus.js` defines the structure of the menu and options
- `forms.js` defines the structure of the tables and forms called from the menu options
- `fields.js` defines the list of fields and lists referenced by `forms.js`

## Menu Definitions

The table describes the structure of the data in `menus.js` that defines the menus and menu options within the application.

|Element|Type|Mand.|Content|
|---|---|---|---|
|title|Object|Yes|Application banner.|
|title.text|String|Yes|Application name.|
|title.class|String|No|Styling for application name.|
|menubar|Array|Yes|Top level menus, each menu is defined in an object.|
|menubar[]|Object|Yes|Valid keys are *id, menu, options, title*.|
|menubar[].id|String|Yes|ID of the menu.|
|menubar[].menu|String|Yes|ID of the ????.|
|menubar[].title|String|Yes|Title of the menu.|
|menubar[].options|Array|Yes|Menu options, each option is defined in an object.|
|menubar[].options[]|Object|Yes|Valid keys are *access, action, id, title*.|
|menubar[].options[].access|Array|Yes|User access level. Must be one of *manager, superuser, user*.|
|menubar[].options[].action|String|Yes|Command to be invoked when the menu option is selected.|
|menubar[].options[].id|String|Yes|ID of the menu option.|
|menubar[].options[].title|String|Yes|Title of the menu option.|

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
|fields|Object|Yes|For forms only. Defines the set of fields that make up the form.|

The next table describes the elements within the `buttons` object. This object applies to both **tables** and **forms**.

|Button|Element|Type|Mand.|Content|
|---|---|---|---|---|
|||Object|Yes|Elements within the `buttons` object are also objects. They must be identified by one of the following names: *add*, *close*, *delete*, *edit* or *ok*.|
|add||Object|No|Add button only applies to *tables*.|
||form|String|Yes|Name of the form to be displayed for adding data. Value must be a top level object in `forms.js`.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|
|close||Object|No|Close button applies to *forms* and *tables*.|
||button|Object|Yes|Contains button styling.|
||button.class|String|Yes|Icon to be used for the button.|
||button.image|String|Yes|Background style for the button.|
|delete||Object|No|Delete button only applies to *tables*.|
||action|String|Yes|Function to be run when button is pressed.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|
||column|Object|Yes|Contains styling for the column heading of the Delete button in the table.|
||column.style|String|Yes|Style for the column heading.|
||column.title|String|Yes|Column heading.|
||key|String|Yes|Field holding the unique ID of the rows in the table. Value must be in the `fields` object in `fields.js`.|
|edit||Object|No|Edit button only applies to *tables*.|
||form|String|Yes|Name of the form to be displayed for editing data. Value must be a top level object in `forms.js`.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|
||column|Object|Yes|Contains styling for the column heading of the Edit button in the table.|
||column.style|String|Yes|Style for the column heading.|
||column.title|String|Yes|Column heading.|
|ok||Object|No|OK button only applies to *forms*.|
||action|String|Yes|Function to be run when button is pressed.|
||button|Object|Yes|Contains button styling.|
||button.background|String|Yes|Background style for the button.|
||button.class|String|Yes|Icon to be used for the button.|

The table below describes the elements within the `columns` object. This object only applies to **tables**.

|Element|Type|Mand.|Content|
|---|---|---|---|
||Array|Yes|Elements within the `columns` array are objects. They must be identified by one of the following names: *id*, *style* or *title*.|
|id|String|Yes|The data that will be displayed in the column. This element holds a field name that must be present in the `fields` object within `fields.js`.|
|style|String|No|The styling to be applied to the column heading.|
|title|String|No|The column heading.|

The next table describes the elements within the `fields` object. This object only applies to **forms**.

|Element|Type|Mand.|Content|
|---|---|---|---|
||Object|Yes|Elements within the `fields` object are also objects. They must be identified by one of the following names: *description*, *edit*, *options*, *title*, *type* or *visible*.|

- `fields` is mandatory for the *form* type and must be an object holding objects for each field
- `fields` must be in the map
- `fields.description` is optional if the field is visible but must be a string
- `fields.edit` is mandatory and must be true|false
- `fields.title` is mandatory if the field is visible and must be a string
- `fields.type` is mandatory and must be one of *id|integer|list|password|text*
- `fields.visible` is mandatory and must be *true|false*

type is *list*
- `fields.options` is mandatory and must be an object
- `fields.options.list` is mandatory and must be a string
- `fields.options.display` is mandatory and must be an object
- `fields.options.display.select` is mandatory and must be one of *single|multiple*
- `fields.options.display.height` is mandatory and must be an integer if `select` is *multiple*

type is *integer*
- `fields.options` is optional but must be an object
- `fields.options.checks` is mandatory and must be one of *format|mandatory|range*
- `fields.options.checks.format` is optional but must be a string
- `fields.options.checks.mandatory` is optional but must be *true|false*
- `fields.options.checks.range` is optional but must be an object
- `fields.options.checks.range.min` is optional but must be an integer
- `fields.options.checks.range.max` is optional but must be an integer
- `fields.options.checks.range` checks `min` is less than `max`

type is *password*
- `fields.options` is optional but must be an object
- `fields.options.checks` is mandatory and must be one of *format|mandatory*
- `fields.options.checks.format` is optional but must be a string
- `fields.options.checks.mandatory` is optional but must be *true|false*

type is *text*
- `fields.options` is optional but must be an object
- `fields.options.checks` is mandatory and must be one of *format|mandatory*
- `fields.options.checks.format` is optional but must be a string
- `fields.options.checks.mandatory` is optional but must be *true|false*
- `fields.options.display` is optional and must be an object
- `fields.options.display.height` is mandatory and must be an integer

## Missing tests

can fields.type:id no validation yet. have checks:mandatory set?
can fields.type:list have checks:mandatory set?
can fields.type:integer be extended to support number|float|etc and checks?
checkbox is supported in `_validate`

# Validating the Application Definition Files

A script called `example/client/check` can be run to validate the files in the sample application. The script must be run using NodeJS, and the output of the tests is written to the console.

~~~bash
JSONUI=./json-ui/js
ROOT=../../example/client/ui
node $JSONUI/validate.js $ROOT/forms.js $ROOT/menus.js $ROOT/fields.js
~~~

