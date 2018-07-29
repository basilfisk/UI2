/**
 * @file ui.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace UserInterface
 * @author Basil Fisk
 * @description Functions that control the display and validation of the web application.
 */
var ui = {
	_messages: {
		language: 'eng',
		callback: undefined
	},

	/**
	 * @method _checkFormat
	 * @author Basil Fisk
	 * @param {object} format Object with min and max values.
	 * @param {string} title Name of field being checked.
	 * @param {string} value String to be checked.
	 * @return True or false.
	 * @description Check the format of the supplied string against a pattern using a regular expression.
	 */
	_checkFormat: function (format, title, value) {
		var pattern, error, regex;

		// No validation required
		if (format === 'none') {
			return true;
		}
		else {
			// Pick pattern to be used for validation
			pattern = _validation[format].pattern;
			error = _validation[format].description;

			// Error if format not recognized
			if (pattern == undefined) {
				console.error('Unrecognized validation format [' + format + ']');
				this._messageBox('UI002', [format]);
				return false;
			}
			else {
				// Test the value
				regex = new RegExp(pattern);
				if (regex.test(value)) {
					return true;
				}
				// Show an error message
				else {
					this._messageBox('UI003', [title, error]);
					return false;
				}
			}
		}
	},


	/**
	 * @method _checkMandatory
	 * @author Basil Fisk
	 * @param {string} mandatory Mandatory flag (true|false).
	 * @param {string} title Name of field being checked.
	 * @param {string} value String to be checked.
	 * @return True or false.
	 * @description Check whether the value is true or false.
	 */
	_checkMandatory: function (mandatory, title, value) {
		if (mandatory && value === '') {
			this._messageBox('UI001', [title]);
			return false;
		}
		else {
			return true;
		}
	},


	/**
	 * @method _checkRange
	 * @author Basil Fisk
	 * @param {string} range Object with min and max values.
	 * @param {string} title Name of field being checked.
	 * @param {string} value String to be checked (the format should already have been validated).
	 * @return True or false.
	 * @description Validate the range of a number.
	 */
	_checkRange: function (range, title, value) {
		var error = '', min = true, max = true;

		// Check minimum range
		if (range && range.min) {
			if (parseFloat(value) < range.min) {
				error += '>=' + range.min + ' ';
				min = false;
			}
		}

		// Check maximum range
		if (range && range.max) {
			if (parseFloat(value) > range.max) {
				error += '<=' + range.max;
				max = false;
			}
		}

		// Return result
		if (min && max) {
			return true;
		}
		// Show an error message
		else {
			this._messageBox('UI004', [title, error]);
			return false;
		}
	},


	/**
	 * @method _convertData
	 * @author Basil Fisk
	 * @param {string} type Type of data.
	 * @param {string} value Value to be converted.
	 * @return Converted value.
	 * @description Convert the text data from a field to the correct type.
	 */
	_convertData: function (type, value) {
		switch (type) {
			case 'integer':
				return parseInt(value);
			case 'float':
				return parseFloat(value);
			default:
				return value;
		}
	},


	/**
	 * @method _messageBox
	 * @author Basil Fisk
	 * @param {string} code Message code.
	 * @param {array} prms Message parameters.
	 * @description Build a message to be displayed in a dialogue box.
	 */
	_messageBox: function (code, prms) {
		var msg, text, i, title;

		// Find message and substitute parameters
		msg = _messages[code];
		text = msg.external[_messages.language];
		for (i=0; i<prms.length; i++) {
			text = text.replace(new RegExp('_p'+(1+i),'g'), prms[i]);
		}

		// Title
		title = (msg.type === 'error') ? 'Error Message' : 'Information Message';
		title += ' [' + code + ']';

		// Display the message
		this._messageShow(title, text);
	},


	/**
	 * @method _messageShow
	 * @author Basil Fisk
	 * @param {string} title Title of message box.
	 * @param {string} msg Message to be displayed.
	 * @param {function} callback Function to be run after OK button is pressed (optional).
	 * @description Display a message in a dialogue box.
	 */
	_messageShow: function (title, msg, callback) {
		var div = '';

		// Save the function
		if (callback !== undefined) {
			this._messages.callback = callback;
		}

		// Build the message container
		div += '<div id="messageBox" class="modal fade" tabindex="-1" role="dialog">';
		div += '<div class="modal-dialog">';
		div += '<div class="modal-content">';
		div += '<div class="modal-header">';
		div += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		div += '<h4 class="modal-title" id="messageBoxLabel">' + title + '</h4>';
		div += '</div>';
		div += '<div class="modal-body">';
		div += '<textarea class="form-control" rows="5" id="messageBoxText" disabled>' + msg + '</textarea>';
		div += '</div>';
		div += '<div class="modal-footer">';
		div += '<button type="button" class="btn btn-success" data-dismiss="modal" onclick="ui.messageConfirmed(); return false;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
		div += '</div>';
		div += '</div>';
		div += '</div>';
		div += '</div>';

		// Remove the existing node, then add the new container to 'body' and display the new form
		$('#messageBox').remove();
		$('body').append(div);
		$('#messageBox').modal('show');
	},


	/**
	 * @method _pageTitle
	 * @author Basil Fisk
	 * @param {string} style Class to be applied to the title.
	 * @param {string} text Title text.
	 * @return An HTML DIV element holding the formatted title.
	 * @description Display the page title.
	 */
	_pageTitle: function (style, text) {
		var div = '';
		div += '<div';
		div += (style) ? ' class="' + style + '"' : '';
		div += '>';
		div += text;
		div += '</div>';
		return div;
	},


	/**
	 * @method _postProcess
	 * @author Basil Fisk
	 * @param {string} action Action to be performed from the form (add|delete|save).
	 * @param {string} id ID of form to being processed.
	 * @param {object} data Object holding data read from the form.
	 * @description Trigger the post-processing script to process the data captured on the form.
	 */
	_postProcess: function (action, id, data) {
		var fn, parts;

		fn = _defs[id].buttons[action].action;
		if (fn) {
			parts = fn.split('.');
			if (parts.length === 2) {
				try {
					window[parts[0]][parts[1]].call(data);
				}
				catch (err) {
					this._messageBox('UI005', [fn, err.message]);
				}
			}
			else {
				this._messageBox('UI006', [id, action, fn]);
			}
		}
		else {
			this._messageBox('UI007', [id, action, fn]);
		}
	},


	/**
	 * @method _runChecks
	 * @author Basil Fisk
	 * @param {object} checks Object holding checks to be performed.
	 * @param {string} title Name of field.
	 * @param {string} value Value to be checked.
	 * @return True if all tests passed or false if any errors are raised.
	 * @description Run the set of checks defined for a field.
	 */
	_runChecks: function (checks, title, value) {
		var test;

		// Field is optional if no check has been defined
		test = (checks.mandatory) ? checks.mandatory : false;

		// If field is mandatory, check that a value has been entered
		if (!this._checkMandatory(test, title, value)) {
			return false;
		}
		// Field is optional
		else {
			// No checks needed if no value has been entered
			if (value === '') {
				return true;
			}

			// Value entered, so carry out rest of checks
			if (checks.format) {
				if (!this._checkFormat(checks.format, title, value)) {
					return false;
				}
			}
			if (checks.range) {
				if (!this._checkRange(checks.range, title, value)) {
					return false;
				}
			}

			// All checks passed
			return true;
		}
	},


	/**
	 * @method _showContainer
	 * @author Basil Fisk
	 * @param {id} id ID of the container.
	 * @param {string} html HTML to be appended.
	 * @description Remove existing container, then add new container and display. 
	 * The container can be a form, table or report.
	 */
	_showContainer: function (id, html) {
		// Add a div to hold the container
		var div = '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog">' + html + '</div>';

		// Remove the node, then add the new container to 'body' and display the new form
		$('#' + id).remove();
		$('body').append(div);
		$('#' + id).modal('show');
	},


	/**
	 * @method _showField
	 * @author Basil Fisk
	 * @param {string} name Field name.
	 * @param {object} defs Field definitions.
	 * @param {string} value Field value.
	 * @param {array} list Array of values for a drop down list field.
	 * @return A div with the field structure.
	 * @description Add the fields to the form.
	 */
	_showField: function (name, defs, value, list) {
		var divot = '', i, desc, title, readonly, disabled, checked, multi, selected;

		// Default for description and title
		desc = (defs.description) ? defs.description : '';
		title = (defs.title) ? defs.title : '';

		// Set read only and checkbox attributes
		readonly = (defs.edit) ? '' : ' readonly';
		disabled = (defs.edit) ? '' : ' disabled';
		checked = (value) ? ' checked' : '';

		// Visible field
		if (defs.visible) {
			switch (defs.type) {
				case 'checkbox':
					divot += '<div class="form-group" id="' + name + '-all">';
					divot += '<input type="checkbox" data-mini="true" id="' + name + '" placeholder="' + desc + '"' + checked + disabled + '>';
					divot += '<label for="' + name + '">' + title + ':</label>';
					divot += '</div>';
					break;
				case 'list':
					// Initialize a multi select list
					multi = (defs.options.display.select === 'multiple') ? ' multiple' : '';
					if (defs.options.display.size && defs.options.display.select === 'multiple') {
						multi += ' size="' + defs.options.display.size + '"';
					}
					// Open list
					divot += '<div class="form-group" id="' + name + '-all">';
					divot += '<label for="' + name + '">' + title + ':</label>';
					divot += '<select class="form-control" id="' + name + '" placeholder="' + desc + '"' + disabled + multi + '>';
					// Add list options
					if (list) {
						for (i=0; i<list.length; i++) {
							// Select if value is in list
							selected = (value.indexOf(list[i].value) === -1) ? '' : ' selected';
							divot += '<option value="' + list[i].value + '" ' + selected + '>' + list[i].text + '</option>';
						}
					}
					// Close list
					divot += '</select>';
					divot += '</div>';
					break;
				default:
					// Convert array to separated string
					if (defs.options && defs.options.content && defs.options.content.type && defs.options.content.type === 'array') {
						if (value) {
							value = value.join(defs.options.content.separator);
						}
					}
					// If size defined, use a textarea control
					if (defs.options && defs.options.display && defs.options.display.size) {
						divot += '<div class="form-group" id="' + name + '-all">';
						divot += '<label for="' + name + '">' + title + ':</label>';
						divot += '<textarea class="form-control" id="' + name + '" placeholder="' + desc + '" rows="' + defs.options.display.size + '"' + readonly + '>' + value + '</textarea>';
						divot += '</div>';
					}
					// Write string to input control
					else {
						divot += '<div class="form-group" id="' + name + '-all">';
						divot += '<label for="' + name + '">' + title + ':</label>';
						divot += '<input type="' + defs.type + '" class="form-control" id="' + name + '" placeholder="' + desc + '" value="' + value + '"' + readonly + '>';
						divot += '</div>';
					}
					break;
			}
		}
		// Hidden field
		else {
			divot += '<div class="hidden">';
			divot += '<input type="text" class="form-control" id="' + name + '" value="' + value + '">';
			divot += '</div>';
		}
		return divot;
	},


	/**
	 * @method _sortArrayObjects
	 * @author Basil Fisk
	 * @param {array} arr Array of objects to be sorted.
	 * @param {string} key Field in each object to sort by.
	 * @description Sort an array of objects by a field in the object.
	 */
	_sortArrayObjects: function (arr, key) {
		var sorted;
		if (arr) {
			sorted = arr.sort(function (a, b) {
				return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
			});
		}
		else {
			sorted = [];
		}
		return sorted;
	},


	/**
	 * @method _userAccess
	 * @author Basil Fisk
	 * @param {string} level User's access level.
	 * @param {array} access List of user levels that have access to this menu option.
	 * @return {boolean} true or false.
	 * @description Check whether the user has access to the menu option.
	 */
	_userAccess: function (level, access) {
		var i, ok = false;

		for (i=0; i<access.length; i++) {
			if (access[i] === level) {
				ok = true;
			}
		}
		return ok;
	},
		


	// ***************************************************************************************
	//
	//		EXTERNAL FUNCTIONS
	//
	// ***************************************************************************************

	/**
	 * @method buttonSave
	 * @author Basil Fisk
	 * @param {string} id ID of UI form.
	 * @description Validate and save the data entered on a form.
	 */
	buttonAdd: function (id) {
		var data = this._buttonValidate(id);

		// Hide the form and trigger the post-processing function
		if (data) {
			$('#' + id).modal('hide');
			this._postProcess('add', id, data);
		}
		else {
console.log("buttonAdd: error validating form '" + id);
		}
	},


	// ---------------------------------------------------------------------------------------
	// Delete the data on a form
	//
	// Argument 1 : Name of UI form
	// ---------------------------------------------------------------------------------------
	buttonDelete: function (id, data) {
console.log('buttonDelete', id, data);
//		var fields, i, field, data = {};

		// Read and validate each field
/*		fields = Object.keys(structure.forms[form].fields);
		for (i=0; i<fields.length; i++) {
			field = fields[i];
			data[field] = document.getElementById(field).value;
		}
*/
		// Hide the form and delete the data
		$('#' + id).modal('hide');
//		_post(id + '-delete', data);
//		func = (id + '-delete').split('.');
//		window[func[0]][func[1]].apply(data);
		this._postProcess('delete', id, {_id:data});
	},


	/**
	 * @method buttonSave
	 * @author Basil Fisk
	 * @param {string} id ID of UI form.
	 * @description Validate and save the data entered on a form.
	 */
	buttonSave: function (id) {
		var data = this._buttonValidate(id);

		// Hide the form and trigger the post-processing function
		if (data) {
			$('#' + id).modal('hide');
			this._postProcess('save', id, data);
		}
		else {
console.log("buttonSave: error validating form '" + id);
		}
	},


	_buttonValidate: function (id) {
		var fields, names, i, name, temp = {}, elem = [], e, text, data = {};

		// Read fields and their names
		fields = _defs[id].fields;
		names = Object.keys(fields);

		// Read and validate each field
		for (i=0; i<names.length; i++) {
			name = names[i];

			// Read the value(s) based on the stated data type of the field
			switch (fields[name].type) {
				// True or false, assign direct to data object
				case 'checkbox':
					temp[name] = (document.getElementById(name).checked) ? true : false;
					break;
				// ID field
				case 'id':
					temp[name] = document.getElementById(name).value;
					break;
				// Single value or an array of values, assign direct to data object
				case 'list':
					if (fields[name].options.display.select === 'multiple') {
						temp[name] = [];
						elem = document.getElementById(name);
						for (e=0; e<elem.length; e++) {
							if (elem[e].selected) {
								temp[name].push(elem[e].value);
							}
						}
					}
					else {
						temp[name] = document.getElementById(name).value;
					}
					break;
				// All other field types (text, float, integer)
				default:
					// Read data as a text string
					text = document.getElementById(name).value;

					// Validate using 'options.checks' section
					if (fields[name].options && fields[name].options.checks) {
						// Field holds an array of values
						if (fields[name].options.content && fields[name].options.content.type === 'array') {
							// Validate each element of the field
							temp[name] = [];
							elem = text.split(fields[name].options.content.separator);
							for (e=0; e<elem.length; e++) {
								// Run the check
								if (!this._runChecks(fields[name].options.checks, fields[name].title, elem[e])) {
									return;
								}
								// Convert value to the correct type
								temp[name].push(this._convertData(fields[name].type, elem[e]));
							}
						}
						// Field holds a single value (default)
						else {
							// Run the check
							if (!this._runChecks(fields[name].options.checks, fields[name].title, text)) {
								return;
							}
							// Convert value to the correct type
							temp[name] = this._convertData(fields[name].type, text);
						}
					}
					// Nothing in the 'options.checks' section, so treat value as text
					else {
						temp[name] = text;
					}
			}

			// Split dot separated element name into array of element names
			elem = fields[name].element.split('.');
//console.log('elem', elem);

			// Assign data to element in object
			// TODO !!!!!!!!!!!!! NAFF, HARD-CODED FOR 3 LEVELS !!!!!!!!!!!!!!!!!!!!!!!!!
			if (elem.length === 1) {
				data[elem[0]] = temp[name];
			}
			else if (elem.length === 2) {
				if (data[elem[0]] === undefined) { data[elem[0]] = {}; }
				data[elem[0]][elem[1]] = temp[name];
			}
			else if (elem.length === 3) {
				if (data[elem[0]] === undefined) { data[elem[0]] = {}; }
				if (data[elem[0]][elem[1]] === undefined) { data[elem[0]][elem[1]] = {}; }
				data[elem[0]][elem[1]][elem[2]] = temp[name];
			}
		}
		
		// Success, so return data
		return data;
	},


	/**
	 * @method formAdd
	 * @author Basil Fisk
	 * @param {string} id ID of form to be displayed.
	 * @param {object} list Object holding lists for drop down fields.
	 * {field: [values], ...}
	 * @description Display a form for adding data.
	 */
	formAdd: function (id, list) {
		var title, fields, names, width, i, div = '';

		// Read fields and their names
		title = _defs[id].title;
		fields = _defs[id].fields;
		names = Object.keys(fields);

		// Build form container
		width = (_defs[id].width) ? parseInt(_defs[id].width) : 50;
		div += '<div class="modal-dialog" role="document" style="width:' + width + '%;">';
		div += '<div class="modal-content">';

		// Add form header and title
		div += '<div class="modal-header">';
		if (_defs[id].buttons && _defs[id].buttons.close) {
			div += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
		}
		div += '<h4 class="modal-title">' + title + '</h4>';
		div += '</div>';

		// Add form body
		div += '<div class="modal-body">';
		div += '<form role="form">';

		// Add fields
		for (i=0; i<names.length; i++) {
			switch (fields[names[i]].type) {
				case 'list':
					div += this._showField(names[i], fields[names[i]], '', this._sortArrayObjects(list[names[i]], 'text'));
					break;
				default:
					div += this._showField(names[i], fields[names[i]], '');
			}
		}

		// Close form body
		div += '</form></div>';

		// Add button in form footer
		if (_defs[id].buttons && _defs[id].buttons.add) {
			div += '<div class="modal-footer">';
			div += '<div class="col-md-12">';
			div += '<button type="button" class="btn btn-success"';
			div += 'onClick="ui.buttonAdd(' + "'" + id + "'" + '); return false;">';
			div += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
			div += '</div></div>';
		}

		// Close form container
		div += '</div></div>';
console.log('formAdd', id, div);

		// Remove existing form, then add new form and display
		this._showContainer(id, div);
	},


	// ---------------------------------------------------------------------------------------
	// Close a form
	//
	// Argument 1 : Name of form
	// ---------------------------------------------------------------------------------------
	formClose: function (form) {
		$('#' + form).modal('hide');
	},


	/**
	 * @method formEdit
	 * @author Basil Fisk
	 * @param {string} id ID of the form.
	 * @param {object} data Data to be shown in fields for editing.
	 * @param {object} list Object holding lists for drop down fields.
	 * {field: [values], ...}
	 * @description Display a form for editing data.
	 */
	formEdit: function (id, data, list) {
		var title, fields, names, width, i, elem, value, div = '';

		// Read fields and their names
		title = _defs[id].title;
		fields = _defs[id].fields;
		names = Object.keys(fields);

		// Build form container
		width = (_defs[id].width) ? parseInt(_defs[id].width) : 50;
		div += '<div class="modal-dialog" role="document" style="width:' + width + '%;">';
		div += '<div class="modal-content">';

		// Add form header and title
		div += '<div class="modal-header">';
		if (_defs[id].buttons && _defs[id].buttons.close) {
			div += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
		}
		div += '<h4 class="modal-title">' + title + '</h4>';
		div += '</div>';

		// Add form body
		div += '<div class="modal-body">';
		div += '<form role="form">';

		// Add fields
		for (i=0; i<names.length; i++) {
			// Split dot separated element name into array of element names
			elem = fields[names[i]].element.split('.');

			// Read data from object
			// TODO !!!!!!!!!!!!! NAFF, HARD-CODED FOR 3 LEVELS !!!!!!!!!!!!!!!!!!!!!!!!!
			if (elem.length === 1) {
				value = data[elem[0]];
			}
			else if (elem.length === 2) {
				if (data[elem[0]] === undefined) {
					value = '';
				}
				else {
					value = data[elem[0]][elem[1]];
				}
			}
			else if (elem.length === 3) {
				if (data[elem[0]] === undefined || data[elem[0]][elem[1]] === undefined) {
					value = '';
				}
				else {
					value = data[elem[0]][elem[1]][elem[2]];
				}
			}
			value = (value) ? value : '';

			// Add field
			switch (fields[names[i]].type) {
				case 'list':
					div += this._showField(names[i], fields[names[i]], value, this._sortArrayObjects(list[names[i]], 'text'));
					break;
				default:
					div += this._showField(names[i], fields[names[i]], value);
			}
		}

		// Close form body
		div += '</form></div>';

		// Save and/or Delete buttons in form footer
		if (_defs[id].buttons) {
			div += '<div class="modal-footer">';
			div += '<div class="col-md-12">';
			if (_defs[id].buttons.delete) {
				div += '<button type="button" class="btn btn-danger" data-dismiss="modal" ';
				div += 'onClick="ui.buttonDelete(' + id + '); return false;">';
				div += '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
			}
			if (_defs[id].buttons.save) {
				div += '<button type="button" class="btn btn-success" ';
				div += 'onClick="ui.buttonSave(' + "'" + id + "'" + '); return false;">';
				div += '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
			}
			div += '</div></div>';
		}

		// Close form container
		div += '</div></div>';
console.log('formEdit', id, div);

		// Remove existing form, then add new form and display
		this._showContainer(id, div);
	},


	/**
	 * @method init
	 * @author Basil Fisk
	 * @param {object} forms Application's form definitions.
	 * @param {object} messages Application's message definitions.
	 * @description Load the application's UI data structures for building forms and reports.
	 */
	init: function (forms, messages) {
		_defs = forms;
		_msgs = messages;
	},


	/**
	 * @method menus
	 * @author Basil Fisk
	 * @param {object} menu User's menu definition.
	 * @param {string} role User's access level.
	 * @param {string} language User's preferred language.
	 * @description Build the menus and options based on the user's access level.
	 */
	menus: function (menu, role, language) {
		var i, n, option, div = '', opt;

		// Save the language for messages
		_messages.language = language;

		// Open the container for the menus and titles
		div += '<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">';
		div += '<ul class="nav navbar-nav">';

		// Build the menu
		if (menu.menubar.length > 0) {
			div += '<ul class="nav navbar-nav">';
			for (i=0; i<menu.menubar.length; i++) {
				// Build list of options
				opt = '';
				for (n=0; n<menu.menubar[i].options.length; n++) {
					// Skip if user doesn't have access to option
					if (this._userAccess(role, menu.menubar[i].options[n].access)) {
						option = menu.menubar[i].options[n];
						opt += '<li id="' + option.id + '-option" class="option"><a href="#' + option.id + '" onClick="' + option.action + '(); return false;">' + option.title + '</a></li>';
					}
				}
				// Dont add top level menu if no options in menu
				if (opt !== '') {
					div += '<li id="' + menu.menubar[i].id + '-menu" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" data-target="#' + menu.menubar[i].name + '" href="#">' + menu.menubar[i].title + '<span class="caret"></span></a>';
					div += '<ul class="dropdown-menu">';
					div += opt;
					div += '</ul>';
					div += '</li>';
				}
			}
			div += '</ul>';
		}

		// Create page title and add to body
		div += '</ul>';
		div += this._pageTitle(menu.title.class, menu.title.text);
		div += '</div>';
		$('body').append(div);
	},


	/**
	 * @method messageBox
	 * @author Basil Fisk
	 * @param {string} code Message code.
	 * @param {array} prms Parameters to be substituted into the message.
	 * @param {function} callback Function to be run after OK button is pressed (optional).
	 * @description Display a message in a dialogue box.
	 */
	messageBox: function (code, prms, callback) {
		var text, title;
		
		// Find message and substitute parameters
		if (_msgs[code]) {
			if (_msgs[code].external[_messages.language]) {
				text = _msgs[code].external[_messages.language];
			}
			else {
				text = _msgs[code].internal;
			}
			if (prms.length > 0) {
				for (i=0; i<prms.length; i++) {
					text = text.replace(new RegExp('_p'+(1+i),'g'), prms[i]);
				}
			}
			
			// Title
			title = (_msgs[code].type === 'error') ? 'Error Message' : 'Information Message';
			title += ' [' + code + ']';
		}
		else {
			text = 'No explanation found for message code [' + code + ']';
			text = 'Message Code [' + code + ']';
		}
		
		// Display the message
console.log(title, text, callback);
		this._messageShow(title, text, callback);
	},


	/**
	 * @method messageConfirmed
	 * @author Basil Fisk
	 * @description Run the post-processing script when the message OK button is pressed.
	 */
	messageConfirmed: function () {
		if (this._messages.callback !== undefined) {
			this._messages.callback();
			this._messages.callback = undefined;
		}
	},


	/**
	 * @method tableShow
	 * @author Basil Fisk
	 * @param {string} id ID of the table.
	 * @param {array} rows Array of objects holding row data.
	 * id:     UID of the data record in the row.
	 * cols:   Array of objects holding column cell data.
	 * text:   Text to be shown in row/column cell.
	 * link:   Function called when link is pressed (optional).
	 * button: Function called when a button is pressed (optional).
	 * style:  Name of Bootstrap button style (only for 'button').
	 * icon:   Name of Glyph icon (only for 'button').
	 * @description Display a table of data.
	 */
	tableShow: function (id, rows) {
		var width, div = '', i, key, row, n, cell, button;

		// Build the container
		width = (_defs[id].width) ? parseInt(_defs[id].width) : 50;
		div += '<div class="modal-dialog" role="document" style="width:' + width + '%">';
		div += '<div class="modal-content">';

		// Build the form header
		div += '<div class="modal-header">';
		if (_defs[id].buttons && _defs[id].buttons.close) {
			div += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
		}
		div += '<br/>';
		div += '<h4>' + _defs[id].title;

		// Display an Add button, if specified
		if (_defs[id].buttons && _defs[id].buttons.add && _defs[id].buttons.add.action) {
			div += '<button type="button" class="btn btn-success btn-sm pull-right" data-dismiss="modal" ';
			div += 'onClick="' + _defs[id].buttons.add.action + '(); return false;">';
			div += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
		}
		div += '</h4>';
		div += '</div>';

		// Build the table container
		div += '<div class="modal-body">';
		div += '<form class="form-horizontal bv-form">';
		div += '<table class="table table-striped table-condensed table-bordered" id="user-table-rows">';

		// Build the table header
		div += '<thead>';
		div += '<tr>';
		for (i=0; i<_defs[id].columns.length; i++) {
			div += (_defs[id].columns[i].style) ? '<th style="' + _defs[id].columns[i].style + '">' : '<th>';
			div += _defs[id].columns[i].title + '</th>';
		}

		// Column headings for optional edit and delete columns added later
		if (_defs[id].buttons) {
			if (_defs[id].buttons.edit && _defs[id].buttons.edit.title) {
				div += (_defs[id].buttons.edit.style) ? '<th style="' + _defs[id].buttons.edit.style + '">' : '<th>'
				div += _defs[id].buttons.edit.title + '</th>';
			}
			if (_defs[id].buttons.delete && _defs[id].buttons.delete.title) {
				div += (_defs[id].buttons.delete.style) ? '<th style="' + _defs[id].buttons.delete.style + '">' : '<th>'
				div += _defs[id].buttons.delete.title + '</th>';
			}
		}
		div += '</tr>';
		div += '</thead>';

		// Build the table body
		div += '<tbody>';

		// Add each element of the array as a table row
		for (i=0; i<rows.length; i++) {
			row = '<tr>';

			// Add user defined columns in sequence specified in form definition
			for (n=0; n<_defs[id].columns.length; n++) {
				cell = _defs[id].columns[n].id;
				if (rows[i][cell]) {
					row += (rows[i][cell].style) ? '<td style="' + rows[i][cell].style + '">' : '<td>';
					row += (rows[i][cell].text) ? rows[i][cell].text : '';
					row += '</td>';
				}
			}

			// Add an optional edit button at the end of the row
			if (_defs[id].buttons && _defs[id].buttons.edit && _defs[id].buttons.edit.action) {
				button = _defs[id].buttons.edit;
console.log(button.action, rows[i]);
				row += (button.style) ? '<td style="' + button.style + '">' : '<td>';
				row += '<button type="button" class="btn btn-' + button.icon.colour + ' btn-xs" data-dismiss="modal" ';
				row += 'onClick="' + _defs[id].buttons.edit.action + "('" + rows[i]._id + "'" + '); return false;">';
				row += '<span class="glyphicon glyphicon-' + button.icon.type + '" aria-hidden="true"></span></button>';
				row += '</td>';
			}

			// Add an optional delete button at the end of the row
			if (_defs[id].buttons && _defs[id].buttons.delete && _defs[id].buttons.delete.action) {
				button = _defs[id].buttons.delete;
				row += (button.style) ? '<td style="' + button.style + '">' : '<td>';
				row += '<button type="button" class="btn btn-' + button.icon.colour + ' btn-xs" data-dismiss="modal" ';
				row += 'onClick="ui.buttonDelete(' + "'" + id + "', '" + rows[i]._id + "'" + '); return false;">';
				row += '<span class="glyphicon glyphicon-' + button.icon.type + '" aria-hidden="true"></span></button>';
				row += '</td>';
			}

			// Close row and add to bottom of table
			row += '</tr>';
			div += row;
		}

		// Close the table and form container
		div += '</tbody>';
		div += '</table>';
		div += '</form>';
		div += '</div></div></div>';

		// Remove existing table, then add new table and display
		this._showContainer(id, div);
	},
};
