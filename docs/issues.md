# Issues

## Notes

- `ui.js` functions not tested yet
	- buttonDelete
	- formAdd
	- formClose
	- userAccess
- `init` in `login.js` has been hard-coded with the admin username & password
- `server/config.json` holds SSL certs pointing to VeryAPI. Sample should use HTTP only.
- `docs/example.md` references the VeryAPI SSL certificates.

## Issues with `json-ui`

- ui.js
	- move messages to config file and make language sensitive
	- abstract out all formatting used when building HTML
- messages.js
	- make language sensitive
	- How does the `access` element in `menu.js` work with `userAccess`?
- try/catch picks up later errors. How do I fix this?
	- ui.buttonSave 
	- admin.adminServer

## Issues Specific to Example Options

- about form
	- Company : name instead of code
- login.js
	- Is the admin.users element needed? Is it related to me.groupusers?
- login form
	- if login fails, show login form again
	- display loading icon until `setProgress` has finished
- logout option
	- clear `me` and `admin` variables before showing login form

## Future Enhancements

- Provide a tool for validating the menu and form schemas before running

# Useful References

## JSON Forms

https://github.com/joshfire/jsonform

https://github.com/joshfire/jsonform/wiki

http://ulion.github.io/jsonform/playground/?example=factory-sleek
