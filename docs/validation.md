# Validation of the Structure Files

**json-ui** uses 2 files to define the structure of the application. The structure of the menu is defined by `menu.js` and the structure of the forms called from the menu options is defined by`forms.js`.

## Menu Definitions

- `title` is mandatory and must be an object
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

