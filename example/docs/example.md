# Sample Application

The sample application is the administration client for an API server. It is a traditional client/server application with a web interface that interacts with a server that accesses and processes data read from a database. The web client is written in JavaScript, the server is written in NodeJS and the database is MongoDB.

The sections below describe how to install and test the server, and how to launch the administration console.

>> Remove MongoDB before release and use JSON files instead.

## Administration Server

Start by adding the URL for the application to the local hosts file, then install the SSL certificates for the application into the `/etc/veryapi` directory.

~~~bash
sudo vi /etc/hosts
	local.very-api.net (add to the end of the line for 127.0.0.1)
mkdir /etc/veryapi/
sudo cp ~/UI2/example/server/ssl/local.very-api.net.* /etc/veryapi/
~~~

Install the NodeJS modules required to run the administration server, then start the administration server. By default, the log data is writtem to `/tmp/server.log` but this can be changed in the `config.json` file.

~~~bash
cd ~/UI2/example/server/
npm i
node server.js &
~~~

Check the server is running and listening on the correct port specified in `config.json`.

~~~bash
ps -ef | grep server.js | grep -v grep
sudo netstat -plnt | grep node
~~~

## Administration Console

>> Explain how to set up the web server for the administration console.

Use the first URL to access the administration console from the file system on a development server, or the second URL if a web server has been set-up.

~~~bash
file:///home/bf/Google/basil.fisk@gmail.com/Software/UI2/index.html
https://local.very-api.net
~~~

The sample application has 2 users:

- admin / admin (user with access to all options)
- client / password (user with restricted access to certain options)

# How the Application Works

When `index.html` is opened, it loads files that are part of the sample application and files that are part of `json-ui`.

## Client Application Files

The client files for the sample application are stored in the `example/client` directory. These files contain the logic for displaying the client interface (using `json-ui`) and for interacting with the administration server.

|Directory|File|Purpose|
|---|---|---|
|functions||Scripts defining functions that are triggered from menus and forms.|
||about.js|Functions for displaying the 'About' data.|
||bundle.js|Functions for managing bundles.|
||command.js|Functions for managing commands.|
||company.js|Functions for managing companies.|
||connector.js|Functions for managing connectors.|
||report.js|Functions for reporting.|
||user.js|Functions for managing users.|
|support||Support functions and data files for the sample application.|
||common.js|Functions that are used across the web application.|
||config.js|Defines configuration settings used by the application.|
||login.js|Functions that control the application's login process.|
||messages.js|Returns an object holding message definitions for the application.|
|ui||Menu and form definitions to build the user interface.|
||fields.js|Defines the set of valid fields and lists in client application.|
||forms.js|Defines how `json-ui` will display forms in the client application.|
||menu.js|Defines how `json-ui` will display menus in the client application.|

The structure and content of the data in the menu and form definition files in the `example/client/ui` directory can be validated prior to running the client application on a browser. The `validate.js` script will give a pass or fail message, along with an explanation of any issues found.

~~~bash
cd ~/UI2/example
node ../json-ui/js/validate.js client/ui/forms.js client/ui/menus.js client/ui/fields.js
~~~

## Server Application Files

The server files for the sample application are stored in the `example/server` directory. These files contain the logic for responding to requests from the client interface.

|Directory|File|Purpose|
|---|---|---|
|.|config.json|Server configuration and server related messages.|
|.|server.js|The server web interface script.|
|calls||Scripts handling requests from the client application.|
||bundle.js|Functions for managing bundles.|
||command.js|Functions for managing commands.|
||company.js|Functions for managing companies.|
||connector.js|Functions for managing connectors.|
||general.js|General purpose functions.|
||report.js|Functions for reporting.|
||user.js|Functions for managing users.|

## Files within the `json-ui` Package

These files are provided with the `json-ui` package, and include .., as well as fonts, 3rd Party stylesheets and libraries.

### Package Files

These files define the core `json-ui` functionality and shouldn't be edited by developers. The files are stored in the `json-ui/js` directory.

|File|Purpose|
|----|-------|
|messages.js|Returns an object holding message definitions for `json-ui`.|
|ui.js|Functions that control the display and validation of the web application.|

These files can be edited by developers to modify the way `json-ui` works. The files are stored in the `json-ui/etc` directory.

|File|Purpose|
|----|-------|
|validation.js|Defines the format validation tests that can be performed, as regular expressions.|

### Fonts

These files are provided with the `json-ui` package by default, and can be changed as required to modify the styling of the application.

~~~bash
json-ui/fonts/glyphicons-halflings-regular.ttf
json-ui/fonts/glyphicons-halflings-regular.woff
~~~

### 3rd Party Stylesheets and Libraries

These files are provided with the `json-ui` package by default. The CSS files can be changed as required to modify the styling of the application.

~~~bash
json-ui/packages/bootstrap.min.css
json-ui/packages/bootstrap.min.js
json-ui/packages/bootstrap-multiselect.css
json-ui/packages/bootstrap-multiselect.js
json-ui/packages/bootstrap-datetimepicker.css
json-ui/packages/bootstrap-datetimepicker.js
json-ui/packages/jquery.min.js
json-ui/packages/moment.min.js
~~~

# How the Sample Application Works

>> To display the application, `index.html` calls the `onStart()` function from the *???* file.

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

# Issues

## Management UI

### Build

- companies form
- command form
- connector form
- usage statistics
- event summary
- recent transactions
- recent errors

### Test

- bundles form
- users form

### New Forms

- configuration / channel
	- logo.path
	- logo.host
	- source.file
	- source.local
	- source.remote
- configuration / program
	- bleb.local.output
	- bleb.remote.host
	- bleb.remote.port
	- bleb.remote.user
	- bleb.remote.pass
	- bleb.remote.source
	- xmltv.download
	- xmltv.data
	- xmltv.host
	- xmltv.port
	- xmltv.period.1d.desc
	- xmltv.period.1d.path
	- xmltv.period.7d.desc
	- xmltv.period.7d.path
- subscriber
	- name
	- login.username
	- login.password
	- jwt
	- ???????? ACCESS CONTROL
- page to initiate the REST commands
