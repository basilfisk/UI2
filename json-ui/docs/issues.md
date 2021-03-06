# Issues

## Notes

- `init` in `login.js` has been hard-coded with the admin username & password
- `server/config.json` holds SSL certs pointing to VeryAPI. Sample should use HTTP only.
- `docs/example.md` references the VeryAPI SSL certificates.

## Issues with `json-ui`

- table must hold all fields and should support a 'hidden' attribute
- validate
	- if field is in an 'edit' form it must be defined in the table
	- if field is in an 'add' form it must be defined in the table
- check uniqueness of menu, form and field names/IDs
- form.js
	- define styles in `style.js` and substitute in `ui.js`
- ui.js
	- abstract out all formatting used when building HTML
	- move all styling data to `style.js`
- try/catch picks up later errors. How do I fix this?
	- ui.buttonSave 
	- admin.adminServer

## Issues Specific to Example Options

- about form
	- Company : name instead of code
- login form
	- display loading icon until `setProgress` has finished
- logout option
	- clear `me` and `admin` variables before showing login form

## Future Enhancements

- ui.js
	- table row, allow data columns to be merged/prettified without changing underlying data
	- remove all English text to `messages.js`
	- option to override edit/delete buttons on a per row basis

# Useful References

## JSON Editor

https://github.com/josdejong/jsoneditor

## JSON Forms

https://github.com/joshfire/jsonform

https://github.com/joshfire/jsonform/wiki

http://ulion.github.io/jsonform/playground/?example=factory-sleek
