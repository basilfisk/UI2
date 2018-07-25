# Sample Application

The sample application is the administration client for an API server. It is a traditional client/server application with a web interface that interacts with a server that accesses and processes data read from a database. The web client is written in JavaScript, the server is written in NodeJS and the database is MongoDB.

The sections below describe how to install and test the server, and how to launch the administration console.

>> Remove MongoDB before release and use JSON files instead.

## Administration Server

The administration server must be installed first.

~~~bash
cd ~/UI2/example/server/
npm i
sudo vi /etc/hosts
    local.very-api.net (add to the end of the line for 127.0.0.1)
~~~

Now install the SSL certificates into the `/etc/veryapi` directory.

~~~bash
mkdir /etc/veryapi/
sudo cp ~/UI2/example/server/ssl/local.very-api.net.* /etc/veryapi/
~~~

Finally, start the administration server. By default, the log data is writtem to `/tmp/server.log` but this can be changed in the `config.json` file.

~~~bash
cd ~/UI2/example/server/
node server.js &
~~~

Check the server is running and listening on the correct port.

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

- admin / password (user with access to all options)
- client / password (user with restricted access to certain options)

# How the Application Works

When `index.html` is opened, it loads files that are part of the sample application and files that are part of `json-ui`.

## Sample Application Files

The sample application files are stored in the `example/client` directory. These files contain the logic for displaying the web interface (using `json-ui`) and for interacting with the administration server.

|Directory|File|Purpose|
|---|---|---|
|functions||Scripts defining functions that are triggered from menus and forms|
||bundle.js|Functions for managing bundles.|
||command.js|Functions for managing commands.|
||company.js|Functions for managing companies.|
||connector.js|Functions for managing connectors.|
||general.js|General purpose functions.|
||report.js|Functions for reporting.|
||user.js|Functions for managing users.|
|support||Support functions and data files for the sample application|
||common.js|Functions that are used across the web application.|
||config.js|Defines configuration settings used by the application.|
||login.js|Functions that control the application's login process.|
||messages.js|Returns an object holding message definitions for the application.|
|ui||Menu and form definitions to build the user interface|
||forms.js|Defines how `json-ui` will display forms in the web application.|
||menu.js|Defines how `json-ui` will display menus in the web application.|

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
