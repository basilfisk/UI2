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
- `width` is optional and must be an integer between 10 and 100
- `type` is mandatory and must be one of *form* or *table*
- `columns` only applies to a *table* and must be an array of objects
- `columns[].id` is mandatory and must be a string
- `columns[].style` is optional and must be a string
- `columns[].title` is mandatory and must be a string

- `buttons` is mandatory and must be an object
- `buttons` elements must be one of *add*, *close*, *delete*, *edit* or *ok*
- `buttons.add` only applies to a *table* and must be an object
- `buttons.add.form` is mandatory, must be a string and form must exist
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
>> - `buttons.delete.column.key` only applies to a *table*, must be a string and field must exist
- `buttons.edit` only applies to a *table* and must be an object
- `buttons.edit.form` is mandatory, must be a string and form must exist
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

	"type": "text",
	"options": {
		"content": {				MOVE THIS TO AN ARRAY TYPE
			"type": "array",
			"separator": ","
		}
	}

## Missing tests

can id|list have checks:mandatory set?
are there number|float types and checks?

## What to do about links?

links to {form key}.fields.{fields key}
- {form}.buttons.delete.key
- {form}.columns[].id: 
Edit and Add forms should use the same field names
{table}.columns should use the same field names

Should ?????
- {table}.columns hold the master column list with a visible attribute
- Edit must have field names in {table}.columns
- Add must have field names in {table}.columns
