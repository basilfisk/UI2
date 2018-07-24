# Issues

## Notes

- `ui.js` functions not fully tested yet
	- buttonDelete
	- formAdd
	- formClose
	- table
	- tableShow
	- userAccess
- `loginCheck` in `functions.js` has been hard-coded with the admin username & password
- `server/config.json` holds SSL certificates pointing to VeryAPI. Sample should use HTTP only.
- `docs/example.md` references the VeryAPI SSL certificates.

## General Issues

- How does the `access` element in `menu.js` work?
- try/catch picks up later errors. How do I fix this?
	- ui.buttonSave 
	- admin.adminServer
- Match the names in message.func with the current function names
- Are these API calls used anywhere?
	- bundleRead1
	- connectorUpdateName
	- report
	- reportEventSummary
- Is the admin.users element needed in login.js? Is it related to me.groupusers?

## Issues Specific to Options

- about form
	- Company : name instead of code
- login form
	- if login fails, show login form again
- logout option
	- clear `me` and `admin` variables before showing login form

## Future Enhancements

- Provide a tool for validating the menu and form schemas before running

# Useful References

## JSON Forms

https://github.com/joshfire/jsonform

https://github.com/joshfire/jsonform/wiki

http://ulion.github.io/jsonform/playground/?example=factory-sleek