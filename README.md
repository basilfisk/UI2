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
data/functions.js | ????
data/forms.js | ???

To display the application, `index.html` calls the `onStart()` function from the *???* file.

## JSON Forms

https://github.com/joshfire/jsonform

https://github.com/joshfire/jsonform/wiki

http://ulion.github.io/jsonform/playground/?example=factory-sleek
