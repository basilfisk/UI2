# Installation

To install the application.

~~~

~~~

# Using the Application

To display the application.

~~~
file:///home/bf/Google/basil.fisk@gmail.com/Software/UI2/index.html
~~~

# How the Application Works

When `index.html` is called, it loads several 3rd Party stylesheets and libraries.

~~~
packages/bootstrap.min.css
packages/bootstrap-datetimepicker.css
packages/jquery.min.js
packages/moment.min.js
packages/bootstrap.min.js
packages/bootstrap-datetimepicker.js
~~~

Then `index.html` loads several built-in user interface functions and configuration files.

File | Purpose
---- | -------
js/api.js | ????
js/ui.js | ????
js/config.js | ????
js/messages.js | ????

The last set of files to be loaded by `index.html` are the application definition scripts created by the user.

File | Purpose
---- | -------
app/functions.js | ????
app/definition.js | ???

To display the application, `index.html` calls the `onStart()` function from the *???* file.

## JSON Forms

https://github.com/joshfire/jsonform

https://github.com/joshfire/jsonform/wiki

http://ulion.github.io/jsonform/playground/?example=factory-sleek

## Flow Through Functions

|Event|Function|Description|
|---|---|---|
|Load site|login.init|Initiated from the `onload` event on the body element of `index.html`.|
||ui.init|Initialize the UI manager with menu and form definitions, post-processing functions and the messages. These are used to build build the menus.|
||ui.formEdit|Display the login form for the Admin Console.|
|Save button|ui.buttonSave|Save the data entered on a form and validate all fields on the form.|
||ui._runChecks|Run the set of checks defined for a single field. Return `true` if all tests passed or `false` if any errors are raised.|
||ui._checkMandatory|Check whether the value is `true` or `false`.|
||ui._checkFormat|Check the format of the supplied string against a pattern using a regular expression.|
||ui._checkRange|Validate the range of a number.|
|||If all checks for all fields return `true`, the form's post-processing function is run. The name of the function to be run is held in the `buttons.save` element of the form definition, held in the `forms.js` script.|

## UI Internal Data Objects

|Data Object|Description|
|---|---|
|_defs|User form definitions, passed as an argument to the `init` function.|
|_messages|Internal information and error messages to be displayed to users. Loaded from `js/messages.js`.|
|_post|Post-processing functions for user forms, passed as an argument to the `init` function.|
|_validation|Internal validation patterns (in regular expression format) used for validating data entered into fields. Loaded from `etc/validation.js`.|

# Issues

## Short Term

- How does the "access" element work?
- try/catch picks up later errors. How do I fix this?
    - ui.buttonSave 
    - admin.adminServer
- Match the names in message.func with the current function names

## Enhancements

- Provide a tool for validating the menu and form schemas before running
