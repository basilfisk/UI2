/**
 * @file validate.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description Validate the menu and form definitions for json-ui.
 */

/**
 * @namespace Validate
 * @author Basil Fisk
 * @param {array} args File name for forms, menus and fields.
 * @description Functions to validate the menu and form definition.
 */
class Validate {
	constructor (args) {
		this.fs = require('fs');
		this.msgs = [];
		this.status = {};
		this.file = {
			form: __dirname + '/' + args[0],
			menu: __dirname + '/' + args[1],
			field: __dirname + '/' + args[2]
		};

		// Validate the arguments
		if (args[0] === undefined || args[1] === undefined || args[2] === undefined) {
			console.log("Arguments:");
			console.log("  [1] Name of the file holding the form definitions");
			console.log("  [2] Name of the file holding the menu definitions");
			console.log("  [3] Name of the file holding the field definitions");
			console.log("All file names are relative to the directory holding 'validate.js'");
		}
		// Start loading the files to be validated
		else {
			this.load('form');
			this.load('menu');
			this.load('field');
		}
	}


	/**
	 * @method checkForms
	 * @memberof Validate
	 * @description Check the form definitions.
	 */
	checkForms () {
		var forms, i, form, list, n,
			elem = form + ".";

		forms = Object.keys(this.form);
		for (i=0; i<forms.length; i++) {
			form = this.form[forms[i]];

			// title - mandatory
			this.isString("form", form.title, forms[i] + ".title", true);
			// width - number 10-100
			if (this.isNumber("form", form.width, forms[i] + ".width", false)) {
				if (parseInt(form.width) < 10 || parseInt(form.width) > 100) {
					this.log("form", forms[i] + ".width must be between 10 and 100");
				}
			}
			// type - mandatory
			if (!form.type) {
				this.log("form", forms[i] + ".type is mandatory");
			}
			else {
				// Valid types
				list = ['form','table'];
				if (!this.isInList([form.type], list)) {
					this.log("form", forms[i] + ".type must only have these values: " + list.join(', '));
				}
				else {
					// elements in form or table
					if (form.type === 'form') {
						list = ['buttons','fields','title','type','width'];
					}
					else {
						list = ['buttons','columns','fields','title','type','width'];
					}
					if (!this.isInList(Object.keys(form), list)) {
						this.log("form", "'" + forms[i] + "' form must only have these elements: " + list.join(', '));
					}

					// key & column - table only
					if (form.type === 'table') {
						if (!this.isArray(form.columns)) {
							this.log("form", forms[i] + ".columns must be an array");
						}
						else {
							for (n=0; n<form.columns.length; n++) {
								elem = forms[i] + ".columns";
								list = ['id','style','title'];
								if (!this.isInList(Object.keys(form.columns[n]), list)) {
									this.log("menu", elem + " must only have these elements: " + list.join(', '));
								}
								if (this.isString("menu", form.columns[n].id, forms[i] + elem + "[" + n + "].id", true)) {
									if (!this.field.fields[form.columns[n].id]) {
										this.log("form", elem + ".columns.id '" + form.columns[n].id + "' is not a registered field");
									}
								}
								// optional
								this.isString("menu", form.columns[n].style, forms[i] + elem + "[" + n + "].style", false);
								this.isString("menu", form.columns[n].title, forms[i] + elem + "[" + n + "].title", false);
							}
						}
					}

					// buttons element
					this.checkFormButtons(forms[i], form.type, form.buttons);

					// fields element
					if (form.type === 'form') {
						this.checkFormFields(forms[i], form.fields);
					}
				}
			}
		}

		this.done("form");
	}


	/**
	 * @method checkFormButtons
	 * @memberof Validate
	 * @param {string} form Name of the form.
	 * @param {string} type Type of object to be displayed (form|table).
	 * @param {object} def Definition of the buttons element.
	 * @description Check the definition of the buttons element on a single form.
	 */
	checkFormButtons (form, type, def) {
		var keys, i, n, p, list,
			elem = form + ".buttons";

		// 'buttons' must exist
		if (this.isObject("form", def, form + ".buttons")) {
			// Valid fields
			list = ['add','close','delete','edit','ok'];
			if (!this.isInList(Object.keys(def), list)) {
				this.log("form", elem + " must only have these elements: " + list.join(', '));
			}

			// add button
			if (def.add) {
				// only on a table
				if (type === 'table') {
					this.isObject("form", def.add, form + ".buttons.add");
					list = ['form','button'];
					if (!this.isInList(Object.keys(def.add), list)) {
						this.log("form", elem + ".add must only have these elements: " + list.join(', '));
					}
					else {
						// form string
						if (this.isString("form", def.add.form, form + ".buttons.add.form", true)) {
							if (!this.form[def.add.form]) {
								this.log("form", elem + ".add.form '" + def.add.form + "' is not a form");
							}
						}
						// button object
						if(this.isObject("form", def.add.button, form + ".buttons.add.button")) {
							list = ['background','class'];
							if (!this.isInList(Object.keys(def.add.button), list)) {
								this.log("form", elem + ".add.button must only have these elements: " + list.join(', '));
							}
							else {
								this.isString("form", def.add.button.background, form + ".buttons.add.button.background", true);
								this.isString("form", def.add.button.class, form + ".buttons.add.button.class", true);
							}
						}
					}
				}
				else {
					this.log("form", elem + ".add button can only be on a table");
				}
			}

			// close button
			if (def.close) {
				if (this.isObject("form", def.close, form + ".buttons.close")) {
					list = ['button'];
					if (!this.isInList(Object.keys(def.close), list)) {
						this.log("form", elem + ".close must only have these elements: " + list.join(', '));
					}
					else {
						// close.button
						this.isObject("form", def.close.button, form + ".buttons.close.button");
						list = ['class','image'];
						if (!this.isInList(Object.keys(def.close.button), list)) {
							this.log("form", elem + ".close.button must only have these elements: " + list.join(', '));
						}
						else {
							this.isString("form", def.close.button.class, form + ".buttons.close.button.class", true);
							this.isString("form", def.close.button.image, form + ".buttons.close.button.image", true);
						}
					}
				}
			}

			// delete button
			if (def.delete) {
				// only on a table
				if (type === 'table') {
					this.isObject("form", def.delete, form + ".buttons.delete");
					list = ['action','button','column','key'];
					if (!this.isInList(Object.keys(def.delete), list)) {
						this.log("form", elem + ".delete must only have these elements: " + list.join(', '));
					}
					else {
						// form string
						this.isString("form", def.delete.action, form + ".buttons.delete.action", true);
						// button object
						if (this.isObject("form", def.delete.button, form + ".buttons.delete.button")) {
							list = ['background','class'];
							if (!this.isInList(Object.keys(def.delete.button), list)) {
								this.log("form", elem + ".delete.button must only have these elements: " + list.join(', '));
							}
							else {
								this.isString("form", def.delete.button.background, form + ".buttons.delete.button.background", true);
								this.isString("form", def.delete.button.class, form + ".buttons.delete.button.class", true);
							}
						}
						// column object
						if (this.isObject("form", def.delete.column, form + ".buttons.delete.column")) {
							list = ['style','title'];
							if (!this.isInList(Object.keys(def.delete.column), list)) {
								this.log("form", elem + ".delete.column must only have these elements: " + list.join(', '));
							}
							else {
								this.isString("form", def.delete.column.style, form + ".buttons.delete.column.style", true);
								this.isString("form", def.delete.column.title, form + ".buttons.delete.column.title", true);
							}
						}
						// key - string and linked to field
						if (this.isString("form", def.delete.key, form + ".buttons.delete.key", true)) {
							if (!this.field.fields[def.delete.key]) {
								this.log("form", elem + ".delete.key '" + def.delete.key + "' is not a registered field");
							}
						}
					}
				}
				else {
					this.log("form", elem + ".delete button can only be on a table");
				}
			}

			// edit button
			if (def.edit) {
				// only on a table
				if (type === 'table') {
					this.isObject("form", def.edit, form + ".buttons.edit");
					list = ['form','button','column'];
					if (!this.isInList(Object.keys(def.edit), list)) {
						this.log("form", elem + ".edit must only have these elements: " + list.join(', '));
					}
					else {
						// form string
						if (this.isString("form", def.edit.form, form + ".buttons.edit.form", true)) {
							if (!this.form[def.edit.form]) {
								this.log("form", elem + ".edit.form '" + def.edit.form + "' is not a form");
							}
						}
						// button object
						if (this.isObject("form", def.edit.button, form + ".buttons.edit.button")) {
							list = ['background','class'];
							if (!this.isInList(Object.keys(def.edit.button), list)) {
								this.log("form", elem + ".edit.button must only have these elements: " + list.join(', '));
							}
							else {
								this.isString("form", def.edit.button.background, form + ".buttons.edit.button.background", true);
								this.isString("form", def.edit.button.class, form + ".buttons.edit.button.class", true);
							}
						}
						// column object
						if (this.isObject("form", def.edit.column, form + ".buttons.edit.column")) {
							list = ['style','title'];
							if (!this.isInList(Object.keys(def.edit.column), list)) {
								this.log("form", elem + ".edit.column must only have these elements: " + list.join(', '));
							}
							else {
								this.isString("form", def.edit.column.style, form + ".buttons.edit.column.style", true);
								this.isString("form", def.edit.column.title, form + ".buttons.edit.column.title", true);
							}
						}
					}
				}
				else {
					this.log("form", elem + ".edit button can only be on a table");
				}
			}
		
			// ok button
			if (def.ok) {
				// only on a form
				if (type === 'form') {
					this.isObject("form", def.ok, form + ".buttons.ok");
					list = ['action','button'];
					if (!this.isInList(Object.keys(def.ok), list)) {
						this.log("form", elem + ".ok must only have these elements: " + list.join(', '));
					}
					else {
						// action string
						this.isString("form", def.ok.action, form + ".buttons.ok.action", true);
						// button object
						if (this.isObject("form", def.ok.button, form + ".buttons.ok.button")) {
							list = ['background','class'];
							if (!this.isInList(Object.keys(def.ok.button), list)) {
								this.log("form", elem + ".ok.button must only have these elements: " + list.join(', '));
							}
							else {
								this.isString("form", def.ok.button.background, form + ".buttons.ok.button.background", true);
								this.isString("form", def.ok.button.class, form + ".buttons.ok.button.class", true);
							}
						}
					}
				}
				else {
					this.log("form", elem + ".ok button can only be on a form");
				}
			}
		}
	}


	/**
	 * @method checkFormFields
	 * @memberof Validate
	 * @param {string} form Name of the form.
	 * @param {object} def Definition of the fields element.
	 * @description Check the definition of the fields element on a single form.
	 */
	checkFormFields (form, def) {
		var flds, keys, i, n, p, list,
			elem = form + ".fields";

		this.isObject("form", def, form + ".fields");

		// loop through fields
		flds = Object.keys(def);
		for (i=0; i<flds.length; i++) {
			elem = form + ".fields." + flds[i];
			// is the field valid
			if (!this.field.fields[flds[i]]) {
				this.log("form", elem + " is not a registered field");
			}
			// Valid fields
			list = ['description','edit','options','title','type','visible'];
			if (!this.isInList(Object.keys(def[flds[i]]), list)) {
				this.log("form", elem + " must only have these elements: " + list.join(', '));
			}
			else {
				// edit - mandatory
				if (!this.isTrueFalse(def[flds[i]].edit)) {
					this.log("form", elem + ".edit must be true|false");
				}
				// visible - mandatory
				if (!this.isTrueFalse(def[flds[i]].visible)) {
					this.log("form", elem + ".visible must be true|false");
				}
				else {
					// description - optional if visible
					if (def[flds[i]].visible) {
						this.isString("form", def[flds[i]].description, form + ".fields." + flds[i] + ".description", false);
						// title - mandatory if visible
						this.isString("form", def[flds[i]].title, form + ".fields." + flds[i] + ".title", true);
					}
				}
				// type - mandatory
				if (this.isString("form", def[flds[i]].type, form + ".fields." + flds[i] + ".type", true)) {
					// type - must be a permitted value
					if (def[flds[i]].type !== 'array' && 
						def[flds[i]].type !== 'id' && 
						def[flds[i]].type !== 'integer' && 
						def[flds[i]].type !== 'list' && 
						def[flds[i]].type !== 'password' &&
						def[flds[i]].type !== 'text') {
						this.log("form", elem + ".type must be one of 'id|integer|list|password|text'");
					}
					// array options - mandatory object
					if (def[flds[i]].type === 'array') {
						if (this.isObject("form", def[flds[i]].options, form + ".fields." + flds[i] + ".options")) {
							// Valid elements
							list = ['checks','separator'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								// separator - mandatory
								this.isString("form", def[flds[i]].options.separator, form + ".fields." + flds[i] + ".options.separator", true);
								if (def[flds[i]].options.checks) {
									// Valid elements for checks
									list = ['format','mandatory'];
									if (!this.isInList(Object.keys(def[flds[i]].options.checks), list)) {
										this.log("form", elem + ".options.checks must only have these elements: " + list.join(', '));
									}
									else {
										// checks.format - optional
										this.isString("form", def[flds[i]].options.checks.format, form + ".fields." + flds[i] + ".options.checks.format", true);
										// checks.mandatory - optional
										if (def[flds[i]].options.checks.mandatory && !this.isTrueFalse(def[flds[i]].options.checks.mandatory)) {
											this.log("form", elem + ".options.checks.mandatory must be true|false");
										}
									}
								}
							}
						}
					}
					// list options - mandatory object
					if (def[flds[i]].type === 'list') {
						if (this.isObject("form", def[flds[i]].options, form + ".fields." + flds[i] + ".options")) {
							// Valid elements
							list = ['display','list'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								// list - mandatory
								this.isString("form", def[flds[i]].options.list, form + ".fields." + flds[i] + ".options.list", true);
								// list - must be registered
								if (!this.field.lists[def[flds[i]].options.list]) {
									this.log("form", elem + ".options.list is not a registered list");
								}
								// display - mandatory
								if (this.isObject("form", def[flds[i]].options.display, form + ".fields." + flds[i] + ".options.display")) {
									// display.select - mandatory
									this.isString("form", def[flds[i]].options.display.select, form + ".fields." + flds[i] + ".options.display.select", true);
									// display.select - 'single' or 'multiple'
									if (def[flds[i]].options.display.select !== 'single' && def[flds[i]].options.display.select !== 'multiple') {
										this.log("form", elem + ".options.display.select must be single|multiple");
									}
									// display.height - mandatory if select is 'multiple'
									if (def[flds[i]].options.display.select === 'multiple') {
										this.isNumber("form", def[flds[i]].options.display.height, elem + ".options.display.height", true);
									}
								}
							}
						}
					}
					// integer options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'integer') {
						if (this.isObject("form", def[flds[i]].options, form + ".fields." + flds[i] + ".options")) {
							// Valid elements
							list = ['checks'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								// Valid elements for checks
								list = ['format','mandatory','range'];
								if (!this.isInList(Object.keys(def[flds[i]].options.checks), list)) {
									this.log("form", elem + ".options.checks must only have these elements: " + list.join(', '));
								}
								else {
									// checks.format - optional
									this.isString("form", def[flds[i]].options.checks.format, form + ".fields." + flds[i] + ".options.checks.format", true);
									// checks.mandatory - optional
									if (def[flds[i]].options.checks.mandatory && !this.isTrueFalse(def[flds[i]].options.checks.mandatory)) {
										this.log("form", elem + ".options.checks.mandatory must be true|false");
									}
									// checks.range - optional
									if (this.isObject("form", def[flds[i]].options.checks.range, form + ".fields." + flds[i] + ".options.checks.range")) {
//		DOUBLE!!					if (def[flds[i]].options.checks.range && !this.isObject(def[flds[i]].options.checks.range)) {
//										this.log("form", elem + ".options.checks.range must be an object");
//									}
//									else {
										// Valid elements for range
										list = ['min','max'];
										if (!this.isInList(Object.keys(def[flds[i]].options.checks.range), list)) {
											this.log("form", elem + ".options.checks.range must only have these elements: " + list.join(', '));
										}
										else {
											// min - integer optional
											this.isNumber("form", def[flds[i]].options.checks.range.min, form + ".fields." + flds[i] + ".options.checks.range.min", false);
											// max - integer optional
											this.isNumber("form", def[flds[i]].options.checks.range.max, form + ".fields." + flds[i] + ".options.checks.range.max", false);
											// min < max
											if (def[flds[i]].options.checks.range.min && def[flds[i]].options.checks.range.max) {
												if (parseInt(def[flds[i]].options.checks.range.min) >= parseInt(def[flds[i]].options.checks.range.max)) {
													this.log("form", elem + ".options.checks.range min must be less than max");
												}
											}
										}
									}
								}
							}
						}
					}
					// password options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'password') {
						if (this.isObject("form", def[flds[i]].options, form + ".fields." + flds[i] + ".options")) {
							// Valid elements
							list = ['checks'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								// Valid elements for checks
								list = ['format','mandatory'];
								if (!this.isInList(Object.keys(def[flds[i]].options.checks), list)) {
									this.log("form", elem + ".options.checks must only have these elements: " + list.join(', '));
								}
								else {
									// checks.format - optional
									this.isString("form", def[flds[i]].options.checks.format, form + ".fields." + flds[i] + ".options.checks.format", true);
									// checks.mandatory - optional
									if (def[flds[i]].options.checks.mandatory && !this.isTrueFalse(def[flds[i]].options.checks.mandatory)) {
										this.log("form", elem + ".options.checks.mandatory must be true|false");
									}
								}
							}
						}
					}
					// text options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'text') {
						if (this.isObject("form", def[flds[i]].options, form + ".fields." + flds[i] + ".options")) {
							// Valid elements
							list = ['checks','display'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								if (def[flds[i]].options.checks) {
									// Valid elements for checks
									list = ['format','mandatory'];
									if (!this.isInList(Object.keys(def[flds[i]].options.checks), list)) {
										this.log("form", elem + ".options.checks must only have these elements: " + list.join(', '));
									}
									else {
										// checks.format - optional
										this.isString("form", def[flds[i]].options.checks.format, form + ".fields." + flds[i] + ".options.checks.format", true);
										// checks.mandatory - optional
										if (def[flds[i]].options.checks.mandatory && !this.isTrueFalse(def[flds[i]].options.checks.mandatory)) {
											this.log("form", elem + ".options.checks.mandatory must be true|false");
										}
									}
								}
								if (def[flds[i]].options.display) {
									// display - mandatory
									if (this.isObject("form", def[flds[i]].options.display, form + ".fields." + flds[i] + ".options.display")) {
//		DOUBLE!!					if (def[flds[i]].options.display && !this.isObject(def[flds[i]].options.display)) {
//										this.log("form", elem + ".options.display must be an object");
//									}
//									else {
										// display.height - mandatory
										this.isNumber("form", def[flds[i]].options.display.height, form + ".fields." + flds[i] + ".options.display.height", true);
									}
								}
							}
						}
					}
				}
			}
		}
	}


	/**
	 * @method checkMenus
	 * @memberof Validate
	 * @description Check the menu definitions.
	 */
	checkMenus () {
		var list, keys, i, elem, n, p;

		// title element
		if (!this.menu.title) {
			this.log("menu", "Top level element 'title' is mandatory");
		}
		else {
			this.isObject("menu", this.menu.title, "title");
			list = ['text','class'];
			if (!this.isInList(Object.keys(this.menu.title), list)) {
				this.log("menu", "'title' must only have these elements: " + list.join(', '));
			}
		}
		
		// menubar element
		if (!this.menu.menubar) {
			this.log("menu", "Top level element 'menubar' is mandatory");
		}
		else {
			if (!this.isArray(this.menu.menubar)) {
				this.log("menu", "'menubar' element must be an array");
			}
			// menubar array objects
			for (i=0; i<this.menu.menubar.length; i++) {
				elem = "menubar[" + i + "]";
				keys = Object.keys(this.menu.menubar[i]);
				list = ['id','menu','options','title'];
				if (!this.isInList(Object.keys(this.menu.menubar[i]), list)) {
					this.log("menu", elem + " must only have these elements: " + list.join(', '));
				}
				for (n=0; n<keys.length; n++) {
					// menubar array, nested options array
					if (keys[n] === 'options') {
						elem = "menubar[" + i + "].options";
						if (!this.isArray(this.menu.menubar[i].options)) {
							this.log("menu", elem + " must be an array");
						}
						else {
							for (p=0; p<this.menu.menubar[i].options.length; p++) {
								elem = "menubar[" + i + "].options[" + p + "]";
								list = ['access','action','id','title'];
								if (!this.isInList(Object.keys(this.menu.menubar[i].options[p]), list)) {
									this.log("menu", elem + " must only have these elements: " + list.join(', '));
								}
								// elements within nested options array
								if (!this.isArray(this.menu.menubar[i].options[p].access)) {
									this.log("menu", elem + ".access must be an array");
								}
								this.isString("menu", this.menu.menubar[i].options[p].action, "menubar[" + i + "].action", true);
								this.isString("menu", this.menu.menubar[i].options[p].id, "menubar[" + i + "].id", true);
								this.isString("menu", this.menu.menubar[i].options[p].title, "menubar[" + i + "].title", true);
							}
						}
					}
					// menubar array, nested non-options array
					else {
						this.isString("menu", this.menu.menubar[i][keys[n]], "menubar[" + i + "]." + keys[n], true);
					}
				}
			}
		}

		this.done("menu");
	}


	/**
	 * @method done
	 * @memberof Validate
	 * @param {array} type Type of data tht has been validated.
	 * @description Display the messages that have been raised.
	 */
	done (type) {
		this.status[type] = true;
		if (this.status.form && this.status.menu) {
			if (this.msgs.length === 0) {
				console.log("Successfully validated");
			}
			else {
				console.log("Errors found during validation");
				for (var i=0; i<this.msgs.length; i++) {
					console.log(this.msgs[i]);
				}
			}
		}
	}


	/**
	 * @method isArray
	 * @memberof Validate
	 * @param {array} data Data to be validated.
	 * @description Check the data is an array.
	 */
	isArray (data) {
		return (typeof data === 'object' && data.length !== undefined) ? true : false;
	}


	/**
	 * @method isInList
	 * @memberof Validate
	 * @param {array} data Data to be validated.
	 * @param {array} list List of valid values.
	 * @description Check that each element of data matches a value in the list.
	 */
	isInList (data, list) {
		var i, n, status = true, match;
		for (i=0; i<data.length; i++) {
			match = false;
			for (n=0; n<list.length; n++) {
				if (data[i] === list[n]) {
					match = true;
				}
			}
			status = status && match;
		}
		return status;
	}


	/**
	 * @method isNumber
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {object} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {boolean} mand Is data element mandatory.
	 * @description Check the data is a number.
	 */
	isNumber (type, data, name, mand) {
		if (data || mand) {
			if (data) {
				if (typeof data === 'number') {
					return true;
				}
				else {
					this.log(type, name + " must be a number");
					return false;
				}
			}
			else {
				this.log(type, name + " is not defined");
				return false;
			}
		}
		else {
			return true;
		}
	}


	/**
	 * @method isObject
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {object} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @description Check the data is an object.
	 */
	isObject (type, data, name) {
		if (typeof data === 'object' && data.length === undefined) {
			return true;
		}
		else {
			this.log(type, name + " must be an object");
			return false;
		}
	}
//	isObjectOrig (data) {
//		return (typeof data === 'object' && data.length === undefined) ? true : false;
//	}


	/**
	 * @method isString
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {object} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {boolean} mand Is data element mandatory.
	 * @description Check the data is a string.
	 */
	isString (type, data, name, mand) {
		if (data || mand) {
			if (data) {
				if (typeof data === 'string') {
					return true;
				}
				else {
					this.log(type, name + " must be a string");
					return false;
				}
			}
			else {
				this.log(type, name + " is not defined");
				return false;
			}
		}
		else {
			return true;
		}
//		return (typeof data === 'string') ? true : false;
	}


	/**
	 * @method isTrueFalse
	 * @memberof Validate
	 * @param {string} data Data to be validated.
	 * @description Check the data is either 'true' or 'false'.
	 */
	isTrueFalse (data) {
		return (typeof data === 'boolean') ? true : false;
	}


	/**
	 * @method load
	 * @memberof Validate
	 * @param {string} type Type of data to be loaded.
	 * @description Read a file to be validated.
	 */
	load (type) {
		this.status[type] = false;
		console.log("Checking: " + this.file[type]);

		// Read file and replace Javascript header and footer lives with { and }
		this.fs.readFile(this.file[type], (err, data) => {
			var file;
			if (err) {
				console.log("Error reading file: " + err.message);
			}
			else {
				file = data.toString();
				file = file.replace(/^.+\n/, '{\n');
				file = file.replace('};', '}');
//				try {
					this[type] = JSON.parse(file);
					this.start(type);
//				}
//				catch (err) {
//					this.log("form", "Invalid JSON in " + type + ".js: " + err.message);
//				}
			}
		});
	}


	/**
	 * @method log
	 * @memberof Validate
	 * @description Add message to the log array.
	 */
	log (type, msg) {
		this.msgs.push("[" + type + "] " + msg);
	}


	/**
	 * @method start
	 * @memberof Validate
	 * @param {string} type Type of data to be loaded.
	 * @description Start validating when all files have been loaded.
	 */
	start (type) {
		var keys, i, ready = true;

		this.status[type] = true;
		keys = Object.keys(this.status);
		for (i=0; i<keys.length; i++) {
			ready = ready && this.status[keys[i]];
		}
		if (ready) {
			this.status = {
				form: false,
				menu: false
			};
			this.checkMenus();
			this.checkForms();
		}
	}
}

new Validate(process.argv.slice(2));
