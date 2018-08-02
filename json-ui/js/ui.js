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
	_table: {
		lists: undefined,
		rows: undefined
	},
	_messages: {
		language: 'eng',
		callback: undefined
	},

	/**
	 * @method _buttonValidate
	 * @author Basil Fisk
	 * @param {string} id ID of UI form.
	 * @description Validate and save data modified on a form.
	 */
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

			// Assign data to element in object
			// TODO !!!!!!!!!!!!! NAFF, HARD-CODED FOR 3 LEVELS !!!!!!!!!!!!!!!!!!!!!!!!!
			// TODO This is the opposite to _objectRead
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
			pattern = _format[format].pattern;
			error = _format[format].description;

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
	 * @method _formAdd
	 * @author Basil Fisk
	 * @param {string} id ID of form to be displayed.
	 * @param {object} list Object holding lists for drop down fields.
	 * {field: [values], ...}
	 * @description Display a form for adding data.
	 */
	_formAdd: function (id, list) {
		var title, fields, names, width, i, div = '', button;

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
			button = _defs[id].buttons.close;
			div += '<button type="button" class="' + button.button.class + '" data-dismiss="modal">' + button.button.image + '</button>';
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
					div += this._showField(names[i], fields[names[i]], '', this._sortArrayObjects(list[fields[names[i]].options.list], 'text'));
					break;
				default:
					div += this._showField(names[i], fields[names[i]], '');
			}
		}

		// Close form body
		div += '</form></div>';

		// Add button in form footer
		if (_defs[id].buttons && _defs[id].buttons.ok) {
			button = _defs[id].buttons.ok;
			div += '<div class="modal-footer">';
			div += '<div class="col-md-12">';
			div += '<button type="button" class="' + button.button.background + '"';
			div += 'onClick="ui.buttonOK(' + "'" + id + "'" + '); return false;">';
			div += '<span class="' + button.button.class + '"></span></button>';
			div += '</div></div>';
		}

		// Close form container
		div += '</div></div>';

		// Remove existing form, then add new form and display
		this._showForm(id, div);
	},


	/**
	 * @method _formEdit
	 * @author Basil Fisk
	 * @param {string} id ID of the form.
	 * @param {object} data Data to be shown in fields for editing.
	 * @param {object} list Object holding lists for drop down fields.
	 * {field: [values], ...}
	 * @description Display a form for editing data.
	 */
	_formEdit: function (id, data, list) {
	var title, fields, names, width, i, elem, div = '', button;

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
			button = _defs[id].buttons.close;
			div += '<button type="button" class="' + button.button.class + '" data-dismiss="modal">' + button.button.image + '</button>';
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
					div += this._showField(names[i], fields[names[i]], data[names[i]].text, this._sortArrayObjects(list[fields[names[i]].options.list], 'text'));
					break;
				default:
					div += this._showField(names[i], fields[names[i]], data[names[i]].text);
			}
		}

		// Close form body
		div += '</form></div>';

		// Optional save button in form footer
		if (_defs[id].buttons) {
			div += '<div class="modal-footer">';
			div += '<div class="col-md-12">';
			if (_defs[id].buttons && _defs[id].buttons.ok) {
				button = _defs[id].buttons.ok;
				div += '<button type="button" class="' + button.button.background + '" ';
				div += 'onClick="ui.buttonOK(' + "'" + id + "'" + '); return false;">';
				div += '<span class="' + button.button.class + '"></span></button>';
			}
			div += '</div></div>';
		}

		// Close form container
		div += '</div></div>';

		// Remove existing form, then add new form and display
		this._showForm(id, div);
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
		var div = '', button;

		// Save the function
		if (callback !== undefined) {
			this._messages.callback = callback;
		}

		// Build message container
		div += '<div id="messageBox" class="modal fade" tabindex="-1" role="dialog">';
		div += '<div class="modal-dialog">';
		div += '<div class="modal-content">';

		// Form title and optional close button in header
		button = _defs.messageBox.buttons.close;
		div += '<div class="modal-header">';
		if (button) {
			div += '<button type="button" class="' + button.button.class + '" data-dismiss="modal">' + button.button.image + '</button>';
		}
		div += '<h4 class="modal-title" id="messageBoxLabel">' + title + '</h4>';
		div += '</div>';

		// Message text
		div += '<div class="modal-body">';
		div += '<textarea class="form-control" rows="5" id="messageBoxText" disabled>' + msg + '</textarea>';
		div += '</div>';

		// OK button in footer
		button = _defs.messageBox.buttons.ok;
		div += '<div class="modal-footer">';
		div += '<button type="button" class="' + button.button.background + '" data-dismiss="modal" ';
		div += 'onclick="ui.messageConfirmed(); return false;">';
		div += '<span class="' + button.button.class + '"></span></button>';
		
		div += '</div>';
		div += '</div>';
		div += '</div>';
		div += '</div>';

		// Remove the existing node, then add the new container to 'body' and display the new form
		$('#messageBox').remove();
		$('body').append(div);
		$('#messageBox').modal('show');
	},


	// Read values from object
	// TODO Is this obsolete ?????????????????????????????????????
	_objectRead: function (data, field) {
		var elem, value;

		// Split dot separated element name into array of element names
		elem = field.element.split('.');
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
	 * @param {string} action Action to be performed from the form (add|delete|ok).
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
					if (defs.options.display.height && defs.options.display.select === 'multiple') {
						multi += ' size="' + defs.options.display.height + '"';
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
					if (defs.options && defs.options.display && defs.options.display.height) {
						divot += '<div class="form-group" id="' + name + '-all">';
						divot += '<label for="' + name + '">' + title + ':</label>';
						divot += '<textarea class="form-control" id="' + name + '" placeholder="' + desc + '" rows="' + defs.options.display.height + '"' + readonly + '>' + value + '</textarea>';
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
	 * @method _showForm
	 * @author Basil Fisk
	 * @param {id} id ID of the form.
	 * @param {string} html HTML to be appended.
	 * @description Remove existing form, then add new form and display. 
	 */
	_showForm: function (id, html) {
		// Add a div to hold the form
		var div = '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog">' + html + '</div>';

		// Remove the node, then add the new form to 'body' and display the new form
		$('#' + id).remove();
		$('body').append(div);
		$('#' + id).modal('show');
	},


	/**
	 * @method _showTable
	 * @author Basil Fisk
	 * @param {id} id ID of the table.
	 * @param {string} html HTML to be appended.
	 * @description Remove existing table, then add new table and display. 
	 */
	_showTable: function (ids, html, lists, data) {
		// Add a div to hold the table
		var div = '<div class="modal fade" id="' + ids.table + '" tabindex="-1" role="dialog">' + html + '</div>';

		// Remove the node, then add the new table to 'body' and display the new form
		$('#' + ids.table).remove();
		$('body').append(div);

		if (ids.add) {
			$('#table-' + ids.add).click(() => {
				this._formAdd(ids.add, lists);
			});
		}

		$('#' + ids.table).modal('show');
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
	 * @method buttonAdd
	 * @author Basil Fisk
	 * @param {string} id ID of UI form.
	 * @description Validate and save new data entered on a form.
	 */
/*	buttonAdd: function (id) {
		var data = this._buttonValidate(id);

		// Hide the form and trigger the post-processing function
		if (data) {
			$('#' + id).modal('hide');
			this._postProcess('add', id, data);
		}
	},*/


	/**
	 * @method buttonDelete
	 * @author Basil Fisk
	 * @param {string} id ID of UI form.
	 * @description Delete the data on a form.
	 */
	buttonDelete: function (id, data) {
		this._postProcess('delete', id, {_id:data});
	},


	/**
	 * @method buttonOK
	 * @author Basil Fisk
	 * @param {string} id ID of UI form.
	 * @description Validate and save data modified on a form.
	 */
	buttonOK: function (id) {
		var data = this._buttonValidate(id);

		// Hide the form and trigger the post-processing function
		if (data) {
			$('#' + id).modal('hide');
			this._postProcess('ok', id, data);
		}
	},


	/**
	 * @method formClose
	 * @author Basil Fisk
	 * @param {string} name Name of the form.
	 * @description Close a form.
	 */
	formClose: function (name) {
		$('#' + name).modal('hide');
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
		this._formEdit (id, data, list);
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
	 * @method tableEditForm
	 * @author Basil Fisk
	 * @param {string} id ID of the form.
	 * @param {object} row Row index of the data to be shown in fields for editing.
	 * @description Display a form for editing data.
	 */
	tableEditForm: function (id, row) {
		this._formEdit(id, this._table.rows[row], this._table.lists);
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
	tableShow: function (id, rows, lists) {
		var width, div = '', i, key, row, n, cell, button, data = [], ids;

		// Build the container
		width = (_defs[id].width) ? parseInt(_defs[id].width) : 50;
		div += '<div class="modal-dialog" role="document" style="width:' + width + '%">';
		div += '<div class="modal-content">';

		// Build the form header
		div += '<div class="modal-header">';
		if (_defs[id].buttons && _defs[id].buttons.close) {
			button = _defs[id].buttons.close;
			div += '<button type="button" class="' + button.button.class + '" data-dismiss="modal">' + button.button.image + '</button>';
		}
		div += '<br/>';
		div += '<h4>' + _defs[id].title;

		// Display an Add button, if specified
		if (_defs[id].buttons && _defs[id].buttons.add) {
			button = _defs[id].buttons.add;
			div += '<button id="table-' + button.form + '" type="button" class="' + button.button.background + '" data-dismiss="modal">';
			div += '<span class="' + button.button.class + '"></span></button>';
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
			if (_defs[id].buttons.edit && _defs[id].buttons.edit.column.title) {
				div += (_defs[id].buttons.edit.column.style) ? '<th style="' + _defs[id].buttons.edit.column.style + '">' : '<th>'
				div += _defs[id].buttons.edit.column.title + '</th>';
			}
			if (_defs[id].buttons.delete && _defs[id].buttons.delete.column.title) {
				div += (_defs[id].buttons.delete.column.style) ? '<th style="' + _defs[id].buttons.delete.column.style + '">' : '<th>'
				div += _defs[id].buttons.delete.column.title + '</th>';
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
					row += (_defs[id].columns[n].style) ? '<td style="' + _defs[id].columns[n].style + '">' : '<td>';
					row += (rows[i][cell].text) ? rows[i][cell].text : '';
					row += '</td>';
				}
				else {
					row += '<td>Undefined</td>';
					console.log('Missing definition for cell: ' + id + '.' + cell);
				}
			}

			// Add an optional edit button at the end of the row
			if (_defs[id].buttons && _defs[id].buttons.edit) {
				button = _defs[id].buttons.edit;
				row += (button.column.style) ? '<td style="' + button.column.style + '">' : '<td>';
				row += '<button type="button" class="' + button.button.background + '" data-dismiss="modal" ';
				row += 'onClick="ui.tableEditForm(' + "'" + _defs[id].buttons.edit.form + "', " + i + '); return false;">';
				row += '<span class="' + button.button.class + '"></span></button>';
				row += '</td>';
			}

			// Add an optional delete button at the end of the row
			if (_defs[id].buttons && _defs[id].buttons.delete) {
				button = _defs[id].buttons.delete;
				row += (button.column.style) ? '<td style="' + button.column.style + '">' : '<td>';
				row += '<button type="button" class="' + button.button.background + '" data-dismiss="modal" ';
				if (_defs[id].key && rows[i][_defs[id].key] && rows[i][_defs[id].key].text) {
					row += 'onClick="ui.buttonDelete(' + "'" + id + "', '" + rows[i][_defs[id].key].text + "'" + '); return false;">';
				}
				else {
					console.log('Missing definition for Delete button: ' + id + '.' + _defs[id].key);
				}
				row += '<span class="' + button.button.class + '"></span></button>';
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

		// Add the table and form IDs
		ids = {
			table: id,
			add: _defs[id].buttons.add.form
		};

		// Save the table data for the edit form
		// TODO make this work like the Add form, by adding a click event to each row
		this._table = {
			lists: lists,
			rows: rows
		};

		// Remove existing table, then add new table and display
		this._showTable(ids, div, lists, rows);
	}
};
