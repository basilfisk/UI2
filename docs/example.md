# Sample Application

## Administration Server

The VeryAPI administration server must be installed first.

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

Finally, start the VeryAPI administration server. By default, the log data is writtem to `/tmp/veryapi.log` but this can be changed in the `config.json` file.

~~~bash
cd ~/UI2/example/server/
node server.js &
~~~

Check the server is running and listening on the correct port.

~~~bash
ps -ef | grep server.js | grep -v grep
sudo netstat -plnt | grep node
~~~

>> Set up the web server for the Administration console.

## Administration Console

Use the first URL to access the Administration Console from the file system on a development server, or the second URL if a web server has been set-up.

~~~bash
file:///home/bf/Google/basil.fisk@gmail.com/Software/UI2/index.html
https://local.very-api.net
~~~

The example application has 2 users:

- admin / password (user with access to all options)
- client / password (user with restricted access to certain options)

# How the Application Works

When `index.html` is called, it loads files that are part of the example application and files that are part of `json-ui`.

## Example Application Files

These files are part of the example application and are held in the `example/client` directory.

## `json-ui` Package Files

These files are part of the `json-ui` package.

### Fonts

These files are provided with the `json-ui` package by default, and can be changed as required to modify the styling of the application.

~~~bash
json-ui/fonts/glyphicons-halflings-regular.ttf
json-ui/fonts/glyphicons-halflings-regular.woff
~~~

### 3rd Party stylesheets and libraries

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

### `json-ui` Package

These files hold the core `json-ui` functionality and shouldn't be edited by developers.

|File|Purpose|
|----|-------|
|json-ui/js/messages.js||
|json-ui/js/ui.js||

These files can be edited by developers to modify the way `json-ui` works.

|File|Purpose|
|----|-------|
|json-ui/etc/config.js||
|json-ui/etc/validation.js||

# How the Example Application Works

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
