// *********************************************************************************************
// *********************************************************************************************
//
// VeryAPI
// Copyright 2016 Breato Ltd.
//
// User interface functions
//
// Requirements in index.html for successful operation:
//  A div with an ID for each form
//  Message box element at the end of index.html so that it is displayed above everything else
//
// *********************************************************************************************
// *********************************************************************************************

var ui = (function (checks) {
	"use strict";

	var _defs = {},
		_post,
		_msgOK,
		_valn = {};

	// ***************************************************************************************
	//
	//		INTERNAL FUNCTIONS
	//
	// ***************************************************************************************

	// ---------------------------------------------------------------------------------------
	// Validate the format of the supplied string
	//
	// Argument 1 : Expected format of string
	// Argument 2 : Name of field being checked
	// Argument 3 : String to be checked
	//
	// Return true or false
	// ---------------------------------------------------------------------------------------
	function check_format (format, title, value) {
		var pattern, error, regex;

		// No validation required
		if (format === 'none') {
			return true;
		}
		else {
			// Pick pattern to be used for validation
			pattern = _valn[format].pattern;
			error = _valn[format].description;

			// Error if format not recognised
			if (pattern == undefined) {
				console.error('Unrecognised validation format [' + format + ']');
				message_build('UI002', [format]);
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
					message_build('UI003', [title, error]);
					return false;
				}
			}
		}
	}

	// ---------------------------------------------------------------------------------------
	// If field is mandatory, check that a value has been entered
	//
	// Argument 1 : Mandatory flag (true|false)
	// Argument 2 : Name of field being checked
	// Argument 3 : String to be checked
	//
	// Return true or false
	// ---------------------------------------------------------------------------------------
	function check_mandatory (mandatory, title, value) {
		if (mandatory && value === '') {
			message_build('UI001', [title]);
			return false;
		}
		else {
			return true;
		}
	}

	// ---------------------------------------------------------------------------------------
	// Validate the range of a number
	//
	// Argument 1 : Object with min and max values
	// Argument 2 : Name of field being checked
	// Argument 3 : String to be checked (the format should already have been validated)
	//
	// Return true or false
	// ---------------------------------------------------------------------------------------
	function check_range (range, title, value) {
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
			message_build('UI004', [title, error]);
			return false;
		}
	}

	// ---------------------------------------------------------------------------------------
	// Convert the text data from a field to the correct type
	//
	// Argument 1 : Type of data
	// Argument 2 : Value to be converted
	//
	// Return converted value
	// ---------------------------------------------------------------------------------------
	function convert_data (type, value) {
		switch (type) {
			case 'integer':
				return parseInt(value);
			case 'float':
				return parseFloat(value);
			default:
				return value;
		}
	}

	// ---------------------------------------------------------------------------------------------
	// Find index of element in UI object
	//
	// Argument 1 : Name of element
	//
	// Index in array or -1
	// ---------------------------------------------------------------------------------------------
	function find_element (name) {
		var i;
		for (i=0; i<_defs.length; i++) {
			if (_defs[i].name === name) { return i; }
		}
		return -1;
	}

	// ---------------------------------------------------------------------------------------
	// Build a message to be displayed in a dialogue box
	//
	// Argument 1 : Message code
	// Argument 2 : Message parameter array
	// ---------------------------------------------------------------------------------------
	function message_build (code, prms) {
		var msg, text, i, title;

		// Find message and substitute parameters
		msg = messages[code];
		text = msg.text;
		for (i=0; i<prms.length; i++) {
			text = text.replace(new RegExp('_p'+(1+i),'g'), prms[i]);
		}

		// Title
		title = (msg.type === 'error') ? 'Error Message' : 'Information Message';
		title += ' [' + code + ']';

		// Display the message
		message_show(title, text);
	}

	// ---------------------------------------------------------------------------------------
	// Display a message in a dialogue box
	//
	// Argument 1 : Title of message box
	// Argument 2 : Message to be displayed
	// Argument 3 : Function to be run after OK button is pressed (optional)
	// ---------------------------------------------------------------------------------------
	function message_show (title, msg, callback) {
		var div = '';

		// Save the function
		if (callback !== undefined) {
			_msgOK = callback;
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
	}

	// ---------------------------------------------------------------------------------------------
	// Display the hostname and an optional name in the title bar
	//      {optional} - VeryAPI [{hostname}]
	//
	// Argument 1 : Name (optional)
	// ---------------------------------------------------------------------------------------------
	function page_title (name) {
		var title, host;

		// Add divider after optional name
		title = (name) ? name + ' - ' : '';

		// window.location.hostname gives dev.very-api.net
		host = window.location.hostname.split('.').shift();
		switch (host) {
			case 'dev':
				title += 'VeryAPI [Dev]';
				break;
			case 'test':
				title += 'VeryAPI [Test]';
				break;
			case 'live':
				title += 'VeryAPI';
				break;
			default:
				title += 'VeryAPI [Unknown]';
				break;
		}
		$('#pageTitle').text(title);
	}

	// ---------------------------------------------------------------------------------------
	// Run the set of checks defined for a field
	//
	// Argument 1 : Object holding checks to be performed
	// Argument 2 : Name of field
	// Argument 3 : Value to be checked
	//
	// Return true if all tests passed or false
	// ---------------------------------------------------------------------------------------
	function run_checks (checks, title, value) {
		var mand;

		// Field is optional if no check has been defined
		mand = (checks.mandatory === undefined) ? false : checks.mandatory;

		// If field is mandatory, check that a value has been entered
		if (!check_mandatory(mand, title, value)) {
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
				if (!check_format(checks.format, title, value)) {
					return false;
				}
			}
			if (checks.range) {
				if (!check_range(checks.range, title, value)) {
					return false;
				}
			}

			// All checks passed
			return true;
		}
	}

	// ---------------------------------------------------------------------------------------
	// Remove existing container, then add new container and display
	// The container can be a form, table or report
	//
	// Argument 1 : ID of the container
	// Argument 2 : HTML to be appended
	// ---------------------------------------------------------------------------------------
	function show_container (id, html) {
		var div;

		// Add a div to hold the container
		div = '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog">' + html + '</div>';

		// Remove the node, then add the new container to 'body' and display the new form
		$('#' + id).remove();
		$('body').append(div);
		$('#' + id).modal('show');
	}

	// ---------------------------------------------------------------------------------------
	// Sort an array of objects by a field in the object
	//
	// Argument 1 : Array of objects to be sorted
	// Argument 2 : Field in each object to sort by
	// ---------------------------------------------------------------------------------------
	function sort_array_objects (arr, key) {
		var sorted = arr.sort(function (a, b) {
			return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
		});
		return sorted;
	}

	// ---------------------------------------------------------------------------------------
	// Add the fields to the form
	//
	// Argument 1 : Field name
	// Argument 2 : Field definitions
	// Argument 3 : Field value
	// Argument 4 : Array of values for a dropdown list field
	//
	// Return a div
	// ---------------------------------------------------------------------------------------
	function show_field (name, defs, value, list) {
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
					// Initialise a multi select list
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
	}

	// ***************************************************************************************
	//
	//		EXTERNAL FUNCTIONS
	//
	// ***************************************************************************************

	return {
		// ---------------------------------------------------------------------------------------
		// Delete the data on a form
		//
		// Argument 1 : Name of UI form
		// ---------------------------------------------------------------------------------------
		delete: function (form) {
			var fields, i, field, data = {};

			// Read and validate each field
			fields = Object.keys(structure.forms[form].fields);
			for (i=0; i<fields.length; i++) {
				field = fields[i];
				data[field] = document.getElementById(field).value;
			}

			// Hide the form and delete the data
			$('#' + form).modal('hide');
			_post(form + '-delete', data);
		},

		// ---------------------------------------------------------------------------------------
		// Display a form for adding data
		//
		// Argument 1 : Name of form
		// Argument 2 : Object holding list for dropdown field
		//					{field: [values], ...}
		// ---------------------------------------------------------------------------------------
		formAdd: function (form, list) {
			var index, form, title, fields, names, i, div = '';

			// Locate UI element
			index = find_element(form);

			// Read fields and their names
			title = _defs[index].title;
			fields = _defs[index].fields;
			names = Object.keys(fields);

			// Build form container
			div += '<div class="modal-dialog" role="document" style="width:50%;">';
			div += '<div class="modal-content">';

			// Add form header and title
			div += '<div class="modal-header">';
			div += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
			div += '<h4 class="modal-title">' + title + '</h4>';
			div += '</div>';

			// Add form body
			div += '<div class="modal-body">';
			div += '<form role="form">';

			// Add fields
			for (i=0; i<names.length; i++) {
				switch (fields[names[i]].type) {
					case 'list':
	//        			    div += show_field(names[i], fields[names[i]], '', list[names[i]]);
						div += show_field(names[i], fields[names[i]], '', sort_array_objects(list[names[i]], 'text'));
						break;
					default:
						div += show_field(names[i], fields[names[i]], '');
				}
			}

			// Close form body
			div += '</form></div>';

			// Add button in form footer
			if (_defs[index].buttons && _defs[index].buttons.add) {
				div += '<div class="modal-footer">';
				div += '<div class="col-md-12">';
	//            	div += '<button type="button" class="btn btn-success" data-dismiss="modal" onClick="ui.saveData(' + index + '); return false;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
				div += '<button type="button" class="btn btn-success" onClick="ui.saveData(' + index + '); return false;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
				div += '</div></div>';
			}

			// Close form container
			div += '</div></div>';

			// Remove existing form, then add new form and display
			show_container(form, div);
		},

		// ---------------------------------------------------------------------------------------
		// Close a form
		//
		// Argument 1 : Name of form
		// ---------------------------------------------------------------------------------------
		formClose: function (form) {
			$('#' + form).modal('hide');
		},

		// ---------------------------------------------------------------------------------------
		// Display a form for editing data
		//
		// Argument 1 : Name of form
		// Argument 2 : Data to be shown in fields for editing
		// Argument 3 : Object holding list for dropdown field
		//					{field: [values], ...}
		// ---------------------------------------------------------------------------------------
		formEdit: function (form, data, list) {
			var index, title, fields, names, i, elem, value, div = '';

			// Locate UI element
			index = find_element(form);

			// Read fields and their names
			title = _defs[index].title;
			fields = _defs[index].fields;
			names = Object.keys(fields);

			// Build form container
			div += '<div class="modal-dialog" role="document" style="width:50%;">';
			div += '<div class="modal-content">';

			// Add form header and title
			div += '<div class="modal-header">';
			div += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
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
	//        			    div += show_field(names[i], fields[names[i]], value, list[names[i]]);
						div += show_field(names[i], fields[names[i]], value, sort_array_objects(list[names[i]], 'text'));
						break;
					default:
						div += show_field(names[i], fields[names[i]], value);
				}
			}

			// Close form body
			div += '</form></div>';

			// Save and/or delete buttons in form footer
			if (_defs[index].buttons) {
				div += '<div class="modal-footer">';
				div += '<div class="col-md-12">';
				if (_defs[index].buttons && _defs[index].buttons.delete) {
					div += '<button type="button" class="btn btn-danger" data-dismiss="modal" onClick="ui.deleteData(' + index + '); return false;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
				}
				if (_defs[index].buttons && _defs[index].buttons.save) {
	//            	    div += '<button type="button" class="btn btn-success" data-dismiss="modal" onClick="ui.saveData(' + index + '); return false;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
					div += '<button type="button" class="btn btn-success" onClick="ui.saveData(' + index + '); return false;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
				}
				div += '</div></div>';
			}

			// Close form container
			div += '</div></div>';

			// Remove existing form, then add new form and display
			show_container(form, div);
		},

		// ---------------------------------------------------------------------------------------
		// Display a form
		//
		// Argument 1 : ID of form
		// Argument 2 : Data to be shown in fields for editing
		// Argument 3 : Object holding list for dropdown field
		//					{field: [values], ...}
		// ---------------------------------------------------------------------------------------
		form: function (id, data, list) {
			var title, fields, names, add, div = '', i, elem, value, buttons;

			// Read fields and their names
			title = structure.forms[id].title;
			fields = structure.forms[id].fields;
			names = Object.keys(fields);

			// If data object is empty, form has been opened for new data
			add = (Object.keys(data).length === 0) ? true : false;

			// Build form container
			div += '<div class="modal-dialog" role="document" style="width:50%;">';
			div += '<div class="modal-content">';

			// Add form header and title
			div += '<div class="modal-header">';
			div += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
			div += '<h4 class="modal-title">';
			div += ((add) ? 'Add ' : 'Edit ') + title;
			div += '</h4>';
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
						div += show_field(names[i], fields[names[i]], value, sort_array_objects(list[names[i]], 'text'));
						break;
					default:
						div += show_field(names[i], fields[names[i]], value);
				}
			}

			// Close form body
			div += '</form></div>';

			// Place buttons in footer
			div += '<div class="modal-footer">';
			div += '<div class="col-md-12">';
			// Show Add button
			if (add) {
				div += '<button type="button" class="btn btn-success" onClick="ui.save(\'' + id + '\'); return false;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
			}
			// Show save, copy and delete buttons
			else {
				if (structure.forms[id].buttons) {
					buttons = structure.forms[id].buttons;
					if (buttons && buttons.add) {
						div += '<button type="button" class="btn btn-success" onClick="ui.save(\'' + id + '\'); return false;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
					}
					if (buttons && buttons.delete) {
						div += '<button type="button" class="btn btn-danger" data-dismiss="modal" onClick="ui.delete(\'' + id + '\'); return false;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
					}
					if (buttons && buttons.save) {
						div += '<button type="button" class="btn btn-success" onClick="ui.save(\'' + id + '\'); return false;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
					}
				}
			}
			div += '</div></div>';

			// Close form container
			div += '</div></div>';

			// Remove existing form, then add new form and display
			show_container(id, div);
		},

		// ---------------------------------------------------------------------------------------
		// Display the message in a message box
		//
		// Argument 1 : Title of message box
		// Argument 2 : Message to be displayed
		// Argument 3 : Function to be run after OK button is pressed (optional)
		// ---------------------------------------------------------------------------------------
	//        messageBox: function (title, text, callback) {
	//            message_show(title, text, callback);
	//        },
		// ---------------------------------------------------------------------------------------
		// Display a message in a dialogue box
		//
		// Argument 1 : Message code
		// Argument 2 : Message parameter array
		// Argument 3 : Function to be run after OK button is pressed (optional)
		// ---------------------------------------------------------------------------------------
		messageBox: function (code, prms, callback) {
			var msg, text, title;

			// Find message and substitute parameters
			msg = messages[code];
			text = msg.text;
			if (prms.length > 0) {
				for (i=0; i<prms.length; i++) {
					text = text.replace(new RegExp('_p'+(1+i),'g'), prms[i]);
				}
			}

			// Title
			title = (msg.type === 'error') ? 'Error Message' : 'Information Message';
			title += ' [' + code + ']';

			// Display the message
	//			console.log(text);
			message_show(title, text, callback);
		},

		// ---------------------------------------------------------------------------------------
		// Run the post-processing script when the message OK button is pressed
		// ---------------------------------------------------------------------------------------
		messageConfirmed: function () {
			if (_msgOK !== undefined) {
				_msgOK();
				_msgOK = undefined;
			}
		},

		// ---------------------------------------------------------------------------------------------
		// Display the hostname and company name (if provided) in the title bar
		//
		// Argument 1 : Name (optional)
		// ---------------------------------------------------------------------------------------------
		pageTitle: function (name) {
			page_title(name);
		},

		// ---------------------------------------------------------------------------------------
		// Initialise the form post-processing script
		// ---------------------------------------------------------------------------------------
		postProcess: function (callback) {
			_post = callback;
		},

		// ---------------------------------------------------------------------------------------
		// Validate and save the data on a form
		//
		// Argument 1 : Index of UI form
		// ---------------------------------------------------------------------------------------
		saveData: function (index) {
			var fields, names, i, name, temp = {}, elem = [], e, text, data = {};

			// Read fields and their names
			fields = _defs[index].fields;
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
									if (!run_checks(fields[name].options.checks, fields[name].title, elem[e])) {
										return;
									}
									// Convert value to the correct type
									temp[name].push(convert_data(fields[name].type, elem[e]));
								}
							}
							// Field holds a single value (default)
							else {
								// Run the check
								if (!run_checks(fields[name].options.checks, fields[name].title, text)) {
									return;
								}
								// Convert value to the correct type
								temp[name] = convert_data(fields[name].type, text);
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

			// Hide the form and save the data
			$('#' + _defs[index].name).modal('hide');
			_post(_defs[index].name, data);
		},

		// ---------------------------------------------------------------------------------------
		// Validate and save the data on a form
		//
		// Argument 1 : ID of UI form
		// ---------------------------------------------------------------------------------------
		save: function (id) {
			var fields, names, i, name, temp = {}, elem = [], e, text, data = {};
			
			// Read fields and their names
			fields = structure.forms[id].fields;
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
								if (!run_checks(fields[name].options.checks, fields[name].title, elem[e])) {
									return;
								}
								// Convert value to the correct type
								temp[name].push(convert_data(fields[name].type, elem[e]));
							}
						}
						// Field holds a single value (default)
						else {
							// Run the check
							if (!run_checks(fields[name].options.checks, fields[name].title, text)) {
								return;
							}
							// Convert value to the correct type
							temp[name] = convert_data(fields[name].type, text);
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
			
			// Hide the form and save the data
			$('#' + id).modal('hide');
console.log(data);
//			_post(id, data);
//			structure.forms[id].functions.post(data); WORKS -- groupUpsert()
			var obj = {};
			obj.id = admin.company._id;
			obj.name = data.groups.name;
			obj.desc = data.groups.description;
			obj.plan = data.groups.plan;
console.log(obj);
//			api_call('companyGroupUpsert', obj, company_group_table_load);
		},
		
		// ---------------------------------------------------------------------------------------
		// Display a table of data
		//
		// Argument 1 :	ID of the table
		// Argument 2 : Array of objects holding row data
		//              id:     UID of the data record in the row
		//              cols:   Array of objects holding column cell data for the row
		//                  text:   Text to be shown in row/column cell
		//                  link:   Function called when link is pressed (optional)
		//                  button: Function called when a button is pressed (optional)
		//                  style:  Name of Bootstrap button style (only for 'button')
		//                  icon:   Name of Glyph icon (only for 'button')
		// ---------------------------------------------------------------------------------------
		table: function (id, rows) {
			var body = '', i, n, row, rowid, cell = {};

			// Build the container
			body += '<div class="modal-dialog" role="document" style="width:50%">'; // TODO Make a parameter
			body += '<div class="modal-content">';

			// Build the form header
			body += '<div class="modal-header">';
			body += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
			body += '<br/>';
			body += '<h4>' + structure.tables[id].title;

			// Display an Add button, if specified
			if (structure.tables[id].add) {
				body += '<button type="button" class="btn btn-success btn-sm pull-right" data-dismiss="modal" onClick="' + structure.tables[id].add + '; return false;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
			}
			body += '</h4>';
			body += '</div>';

			// Build the table container
			body += '<div class="modal-body">';
			body += '<form class="form-horizontal bv-form">';
			body += '<table class="table table-striped table-condensed table-bordered" id="user-table-rows">';

			// Build the table header
			body += '<thead>';
			body += '<tr>';
			for (i=0; i<structure.tables[id].columns.length; i++) {
				body += '<th>' + structure.tables[id].columns[i] + '</th>';
			}
			body += '</tr>';
			body += '</thead>';

			// Build the table body
			body += '<tbody>';

			// Add each element of the array as a table row
			for (i=0; i<rows.length; i++) {
				rowid = rows[i].id;
				row = '<tr>';

				// Add columns
				for (n=0; n<rows[i].cols.length; n++) {
					cell = rows[i].cols[n];
					row += '<td>';
					// Show hyperlink if 'link' property provided
					if (cell.link) {
						row += '<a data-dismiss="modal" onClick="' + cell.link + '(\'' + rowid + '\');">';
					}

					// Show text if provided
					row += (cell.text) ? cell.text : '';

					// Close edit link if 'edit' property provided
					if (cell.link) {
						row += '</a>';
					}

					// Only show icon link if 'button' property provided
					if (cell.button) {
						row += '<button type="button" class="btn btn-' + cell.style + ' btn-xs" data-dismiss="modal" onClick="' + cell.button + '(\'' + rowid + '\'); return false;"><span class="glyphicon glyphicon-' + cell.icon + '" aria-hidden="true"></span></button>';
					}
					row += '</td>';
				}
				
				// Display a Delete button, if specified
				if (structure.tables[id].delete) {
					row += '<td>';
					row += '<button type="button" class="btn btn-danger btn-xs" data-dismiss="modal" onClick="' + structure.tables[id].delete + '(\'' + rowid + '\'); return false;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
					row += '</td>';
				}

				// Close row and add to bottom of table
				row += '</tr>';
				body += row;
			}

			// Close the table and form container
			body += '</tbody>';
			body += '</table>';
			body += '</form>';
			body += '</div></div></div>';

			// Remove existing table, then add new table and display
			show_container(id, body);
		},

		// ---------------------------------------------------------------------------------------
		// Display a table of data
		//
		// Argument 1 :	Reference name of the table
		// Argument 2 : Array of objects holding row data
		//              id:     UID of the data record in the row
		//              cols:   Array of objects holding column cell data
		//                  text:   Text to be shown in row/column cell
		//                  link:   Function called when link is pressed (optional)
		//                  button: Function called when a button is pressed (optional)
		//                  style:  Name of Bootstrap button style (only for 'button')
		//                  icon:   Name of Glyph icon (only for 'button')
		// ---------------------------------------------------------------------------------------
		tableShow: function (id, rows) {
			var index, body = '', i, n, row, rowid, cell = {};

			// Locate UI element
			index = find_element(id);

			// Build the container
			body += '<div class="modal-dialog" role="document" style="width:50%">'; // TODO Make a parameter
			body += '<div class="modal-content">';

			// Build the form header
			body += '<div class="modal-header">';
			body += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
			body += '<br/>';
			body += '<h4>' + _defs[index].title;

			// Display an Add button, if specified
			if (_defs[index].add) {
				body += '<button type="button" class="btn btn-success btn-sm pull-right" data-dismiss="modal" onClick="' + _defs[index].add + '; return false;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>';
			}
			body += '</h4>';
			body += '</div>';

			// Build the table container
			body += '<div class="modal-body">';
			body += '<form class="form-horizontal bv-form">';
			body += '<table class="table table-striped table-condensed table-bordered" id="user-table-rows">';

			// Build the table header
			body += '<thead>';
			body += '<tr>';
			for (i=0; i<_defs[index].columns.length; i++) {
				body += '<th>' + _defs[index].columns[i] + '</th>';
			}
			body += '</tr>';
			body += '</thead>';

			// Build the table body
			body += '<tbody>';

			// Add each element of the array as a table row
			for (i=0; i<rows.length; i++) {
				rowid = rows[i].id;
				row = '<tr>';

				// Add columns
				for (n=0; n<rows[i].cols.length; n++) {
					cell = rows[i].cols[n];
					row += '<td>';
					// Show hyperlink if 'link' property provided
					if (cell.link) {
						row += '<a data-dismiss="modal" onClick="' + cell.link + '(\'' + rowid + '\');">';
					}

					// Show text if provided
					row += (cell.text) ? cell.text : '';

					// Close edit link if 'edit' property provided
					if (cell.link) {
						row += '</a>';
					}

					// Only show icon link if 'button' property provided
					if (cell.button) {
						row += '<button type="button" class="btn btn-' + cell.style + ' btn-xs" data-dismiss="modal" onClick="' + cell.button + '(\'' + rowid + '\'); return false;"><span class="glyphicon glyphicon-' + cell.icon + '" aria-hidden="true"></span></button>';
					}
					row += '</td>';
				}

				// Close row and add to bottom of table
				row += '</tr>';
				body += row;
			}

			// Close the table and form container
			body += '</tbody>';
			body += '</table>';
			body += '</form>';
			body += '</div></div></div>';

			// Remove existing table, then add new table and display
			show_container(id, body);
		},

		// ---------------------------------------------------------------------------------------
		// Check whether user has access to the named UI element
		//
		// Argument 1 : Name of UI element
		//
		// Return true or false
		// ---------------------------------------------------------------------------------------
		userAccess: function (name) {
			return (find_element(name) > -1) ? true : false;
		},

		// ---------------------------------------------------------------------------------------
		// User's UI data for building the menus, forms and reports
		//
		// Argument 1 : User's UI definition
		// ---------------------------------------------------------------------------------------
		userData: function (data) {
			var i, menu = {}, div = '', main, n, option, html = '';

			// Save the UI documents
			_defs = {};
			_defs = data;

			// Show the menu options for the user
			for (i=0; i<_defs.length; i++) {
				// Is this entry part of the menu
				if (_defs[i].menu) {
					// Create an empty menu object for a new menu
					if(!menu[_defs[i].menu.menu]) {
						menu[_defs[i].menu.menu] = [];
					}
					// Add a menu option
					menu[_defs[i].menu.menu][_defs[i].menu.order] = {
						name: _defs[i].name,
						title: _defs[i].menu.title || _defs[i].title,
						action: _defs[i].menu.select
					};
				}
			}

			// Build the menu
			main = Object.keys(menu);
			if (main.length > 0) {
				for (i=0; i<menu.main.length; i++) {
					// Skip if the menu option is not available
					if (menu.main[i] !== undefined) {
						// Option on main menu
						if (main.indexOf(menu.main[i].name) === -1) {
							div += '<li id="' + menu.main[i].name + '-option" class="option"><a href="#' + menu.main[i].name + '" onClick="' + menu.main[i].action + '; return false;">' + menu.main[i].title + '</a></li>';
						}
						// Menu of options
						else {
							div += '<li id="' + menu.main[i].name + '-menu" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" data-target="#' + menu.main[i].name + '" href="#">' + menu.main[i].title + '<span class="caret"></span></a>';
							div += '<ul class="dropdown-menu">';
							option = menu.main[i].name;
							for (n=0; n<menu[option].length; n++) {
								// Skip if the menu option is not available
								if (menu[option][n] !== undefined) {
									div += '<li id="' + menu[option][n].name + '-option" class="option"><a href="#' + menu[option][n].name + '" onClick="' + menu[option][n].action + '; return false;">' + menu[option][n].title + '</a></li>';
								}
							}
							div += '</ul>';
							div += '</li>';
						}
					}
				}
			}

			// Complete the container for the menu, then add to 'body'
			html += '<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">';
			html += '<ul class="nav navbar-nav">' + div + '</ul>';
			html += '<div class="navbar-brand pull-right" id="pageTitle"></div>';
			html += '</div>';
			$('body').append(html);

			// Show the page title
			page_title();
		},

		// ---------------------------------------------------------------------------------------
		// Load the validation checks
		//
		// Argument 1 : Object of checks containing keyed by check name
		//                  pattern:     The regxep used for the validation
		//                  description: A description of the check, shown when the check fails
		// ---------------------------------------------------------------------------------------
	//        validation: function (checks) {
	//            _valn = checks;
	//        }
		// ---------------------------------------------------------------------------------------
		// Define the validation tests to be carried out by the UI script
		// ---------------------------------------------------------------------------------------
		validation: function () {
			_valn = {
				"alphaLower": {
					"pattern": "[a-z]+$",
					"description": "Lower case alphabetic string"
				},
				"alphaMixed": {
					"pattern": "[a-zA-Z]+$",
					"description": "Mixed case alphabetic string"
				},
				"alphaUpper": {
					"pattern": "[A-Z]+$",
					"description": "Upper case alphabetic string"
				},
				"alphaNumeric": {
					"pattern": "^\\w+$",
					"description": "Alphanumeric string"
				},
				"alphaNumericSpecial": {
					"pattern": "^[\\w \\-_]+$",
					"description": "Alphanumeric string, including space, hyphen and underscore"
				},
				"email": {
					"pattern": "[a-z0-9!#$%&\"*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
					"description": "must be an email address"
				},
				"filename": {
					"pattern": "^[\\w\/\\-_]+$",
					"description": "Alphanumeric string, including forward slash, hyphen and underscore"
				},
				"float": {
					"pattern": "^-*\\d*\\.\\d+$",
					"description": "Floatng point"
				},
				"integer": {
					"pattern": "^-*\\d+$",
					"description": "Integer"
				},
				"ipv4": {
					"pattern": "^\\*$|^(?!0)(?!.*\\.$)((1?\\d?\\d|25[0-5]|2[0-4]\\d)(\\.|$)){4}$",
					"description": "IP v4 address or * for any client"
				},
				"password": {
					"pattern": "^[\\w \\-_]+$",
					"description": "Password, with alphanumeric, space, hyphen and underscore characters"
				},
				"url": {
					"pattern": "^[\\w\/\\.\\-_]+$",
					"description": "URL"
				}
			};
		}
	}
}());
