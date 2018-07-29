# Issues

## Notes

- `ui.js` functions not tested yet
	- buttonDelete
	- formAdd
	- formClose
- `init` in `login.js` has been hard-coded with the admin username & password
- `server/config.json` holds SSL certs pointing to VeryAPI. Sample should use HTTP only.
- `docs/example.md` references the VeryAPI SSL certificates.

## Issues with `json-ui`

- ui.js
	- abstract out all formatting used when building HTML
- try/catch picks up later errors. How do I fix this?
	- ui.buttonSave 
	- admin.adminServer

## Issues Specific to Example Options

- about form
	- Company : name instead of code
- login.js
	- Is the admin.users element needed? Is it related to me.groupUsers?
- login form
	- if login fails, show login form again
	- display loading icon until `setProgress` has finished
- logout option
	- clear `me` and `admin` variables before showing login form

## Future Enhancements

- Provide a tool for validating the menu and form schemas before running
- form.js
	- define styles in `style.js` and substitute in `ui.js`
- ui.js
	- table row, allow data columns to be merged/prettified without changing underlying data
	- remove all English text to `messages.js`
	- move all styling data to `style.js`
	- option to override edit/delete buttons on a per row basis

# Useful References

## JSON Editor

https://github.com/josdejong/jsoneditor

## JSON Forms

https://github.com/joshfire/jsonform

https://github.com/joshfire/jsonform/wiki

http://ulion.github.io/jsonform/playground/?example=factory-sleek
