# Validation of the Structure Files

**json-ui** uses 2 files to define the structure of the application. The structure of the menu is defined by `menu.js` and the structure of the forms called from the menu options is defined by`forms.js`.

## Menu Definitions

- `title` is mandatory and must be a string
- `title.text` is mandatory
- `title.class` is optional

- `menubar` is mandatory and must be an array
- `menubar[].id` is mandatory and must be a string
- `menubar[].menu` is mandatory and must be a string
- `menubar[].title` is mandatory and must be a string
- `menubar[].options` is mandatory and must be an array
- `menubar[].options[].access` is mandatory and must be an array
- `menubar[].options[].action` is mandatory and must be a string
- `menubar[].options[].id` is mandatory and must be a string
- `menubar[].options[].title` is mandatory and must be a string

## Form Definitions

- `title` is mandatory and must be a string
- `width` is optional and must be a number
- `type` is mandatory and must be one of *form* or *table*
- `key` only applies to a *table* and must be an integer between 20 and 100
- `columns` only applies to a *table* and must be an array of objects
- `columns[].id` is mandatory and must be a string
- `columns[].title` is mandatory and must be a string

- `buttons` is mandatory and must be an object
- `buttons` elements must be one of *add*, *close*, *delete*, *edit* or *ok*
- `buttons.add` only applies to a *table* and must be an object
- `buttons.add.form` is mandatory and must be a string
- `buttons.add.button` is a mandatory object with elements of *background* and *class*
- `buttons.add.button.background` must be a string
- `buttons.add.button.class` must be a string
- `buttons.close` must be an object
- `buttons.close.button` is a mandatory object with elements of *class* and *image*
- `buttons.close.button.class` must be a string
- `buttons.close.button.image` must be a string
- `buttons.delete` only applies to a *table* and must be an object
- `buttons.delete.action` is mandatory and must be a string
- `buttons.delete.button` is a mandatory object with elements of *background* and *class*
- `buttons.delete.button.background` must be a string
- `buttons.delete.button.class` must be a string
- `buttons.delete.column` is a mandatory object with elements of *style* and *title*
- `buttons.delete.column.style` must be a string
- `buttons.delete.column.title` must be a string
- `buttons.edit` only applies to a *table* and must be an object
- `buttons.edit.form` is mandatory and must be a string
- `buttons.edit.button` is a mandatory object with elements of *background* and *class*
- `buttons.edit.button.background` must be a string
- `buttons.edit.button.class` must be a string
- `buttons.edit.column` is a mandatory object with elements of *style* and *title*
- `buttons.edit.column.style` must be a string
- `buttons.edit.column.title` must be a string
- `buttons.ok` only applies to a *form* and must be an object
- `buttons.ok.action` is mandatory and must be a string
- `buttons.ok.button` is a mandatory object with elements of *background* and *class*
- `buttons.ok.button.background` must be a string
- `buttons.ok.button.class` must be a string

- `fields` is mandatory for the *form* type and must be an object holding objects for each field
- `fields.description` is optional if the field is visible but must be a string
- `fields.edit` is mandatory and must be true|false
- `fields.element` is mandatory and must be a string
- `fields.title` is mandatory if the field is visible and must be a string
- `fields.type` is mandatory and must be one of *id|integer|list|password|text*
- `fields.visible` is mandatory and must be true|false
- `fields.options` is mandatory and an object if the type is *list*
- `fields.options` is optional but must be an object if the type is one of *integer|password|text*

				"type": "text",
				"options": {
					"checks": {
						"mandatory": true|false,
						"format": "alphaMixed|ipv4|..."
					}
					"display": {
						"height": 20			USED BY LISTS and TEXT
					}
					"content": {				MOVE THIS TO AN ARRAY TYPE
						"type": "array",
						"separator": ","
					}
				}

				"type": "list",
				"options": {
					"list": "bundleCommandList",
					"display": {
						"select": "single"		ONLY USED BY LISTS
					}
				}

				"type": "list",
				"options": {
					"display": {			
						"select": "multiple",	ONLY USED BY LISTS
						"height": 5				USED BY LISTS and TEXT
					}
				}

				"type": "integer",
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1,			OPTIONAL
							"max": 65535		OPTIONAL
						}
					}
				}

				"type": "password",
				"options": {
					"checks": {
						"mandatory": true,
						"format": "password"
					}
				}


## Missing tests

button.add.form: link to {form key}
button.edit.form: link to {form key}
columns.id: link to {form key}.fields.{fields key}

width: 20-100 integer

companyTable.columns[] has a style element

options: checkbox
can id|list have checks:mandatory set?
is there are number|float type and checks?
