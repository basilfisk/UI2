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
			if (!this.isString(form.title)) {
				this.log("form", forms[i] + ".title must be a string");
			}

			// width - number 10-100
			if (form.width && !this.isNumber(form.width)) {
				this.log("form", forms[i] + ".width must be a number");
			}
			else {
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
								if (!this.isString(form.columns[n].id)) {
									this.log("menu", elem + "[" + n + "].id must be a string");
								}
								else {
									if (!this.field[form.columns[n].id]) {
										this.log("form", elem + ".columns.id '" + form.columns[n].id + "' does not match a field");
									}
								}
								// optional
								if (form.columns[n].style && !this.isString(form.columns[n].style)) {
									this.log("menu", elem + "[" + n + "].style must be a string");
								}
								if (!this.isString(form.columns[n].title)) {
									this.log("menu", elem + "[" + n + "].title must be a string");
								}
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

		if (!this.isObject(def)) {
			this.log("form", elem + " must be an object");
		}

		// Valid fields
		list = ['add','close','delete','edit','ok'];
		if (!this.isInList(Object.keys(def), list)) {
			this.log("form", elem + " must only have these elements: " + list.join(', '));
		}

		// add button
		if (def.add) {
			// only on a table
			if (type === 'table') {
				if (!this.isObject(def.add)) {
					this.log("form", elem + ".add must be an object");
				}
				list = ['form','button'];
				if (!this.isInList(Object.keys(def.add), list)) {
					this.log("form", elem + ".add must only have these elements: " + list.join(', '));
				}
				else {
					// form string
					if (!this.isString(def.add.form)) {
						this.log("form", elem + ".add.form must be a string");
					}
					else {
						if (!this.form[def.add.form]) {
							this.log("form", elem + ".add.form '" + def.add.form + "' is not a form");
						}
					}
					// button object
					if (!this.isObject(def.add.button)) {
						this.log("form", elem + ".add.button must be an object");
					}
					else {
						list = ['background','class'];
						if (!this.isInList(Object.keys(def.add.button), list)) {
							this.log("form", elem + ".add.button must only have these elements: " + list.join(', '));
						}
						else {
							if (!this.isString(def.add.button.background)) {
								this.log("form", elem + ".add.button.background must be a string");
							}
							if (!this.isString(def.add.button.class)) {
								this.log("form", elem + ".add.button.class must be a string");
							}
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
			if (!this.isObject(def.close)) {
				this.log("form", elem + ".close must be an object");
			}
			else {
				list = ['button'];
				if (!this.isInList(Object.keys(def.close), list)) {
					this.log("form", elem + ".close must only have these elements: " + list.join(', '));
				}
				else {
					// close.button
					if (!this.isObject(def.close.button)) {
						this.log("form", elem + ".close.button must be an object");
					}
					list = ['class','image'];
					if (!this.isInList(Object.keys(def.close.button), list)) {
						this.log("form", elem + ".close.button must only have these elements: " + list.join(', '));
					}
					else {
						if (!this.isString(def.close.button.class)) {
							this.log("form", elem + ".close.button.class must be a string");
						}
						if (!this.isString(def.close.button.image)) {
							this.log("form", elem + ".close.button.image must be a string");
						}
					}
				}
			}
		}

		// delete button
		if (def.delete) {
			// only on a table
			if (type === 'table') {
				if (!this.isObject(def.delete)) {
					this.log("form", elem + ".delete must be an object");
				}
				list = ['action','button','column','key'];
				if (!this.isInList(Object.keys(def.delete), list)) {
					this.log("form", elem + ".delete must only have these elements: " + list.join(', '));
				}
				else {
					// form string
					if (!this.isString(def.delete.action)) {
						this.log("form", elem + ".delete.action must be a string");
					}
					// button object
					if (!this.isObject(def.delete.button)) {
						this.log("form", elem + ".delete.button must be an object");
					}
					else {
						list = ['background','class'];
						if (!this.isInList(Object.keys(def.delete.button), list)) {
							this.log("form", elem + ".delete.button must only have these elements: " + list.join(', '));
						}
						else {
							if (!this.isString(def.delete.button.background)) {
								this.log("form", elem + ".delete.button.background must be a string");
							}
							if (!this.isString(def.delete.button.class)) {
								this.log("form", elem + ".delete.button.class must be a string");
							}
						}
					}
					// column object
					if (!this.isObject(def.delete.column)) {
						this.log("form", elem + ".delete.column must be an object");
					}
					else {
						list = ['style','title'];
						if (!this.isInList(Object.keys(def.delete.column), list)) {
							this.log("form", elem + ".delete.column must only have these elements: " + list.join(', '));
						}
						else {
							if (!this.isString(def.delete.column.style)) {
								this.log("form", elem + ".delete.column.style must be a string");
							}
							if (!this.isString(def.delete.column.title)) {
								this.log("form", elem + ".delete.column.title must be a string");
							}
						}
					}
					// key - string and linked to field
					if (!this.isString(def.delete.key)) {
						this.log("form", elem + ".delete.key must be a string");
					}
					else {
						if (!this.field[def.delete.key]) {
							this.log("form", elem + ".delete.key '" + def.delete.key + "' does not match a field");
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
				if (!this.isObject(def.edit)) {
					this.log("form", elem + ".edit must be an object");
				}
				list = ['form','button','column'];
				if (!this.isInList(Object.keys(def.edit), list)) {
					this.log("form", elem + ".edit must only have these elements: " + list.join(', '));
				}
				else {
					// form string
					if (!this.isString(def.edit.form)) {
						this.log("form", elem + ".edit.form must be a string");
					}
					else {
						if (!this.form[def.edit.form]) {
							this.log("form", elem + ".edit.form '" + def.edit.form + "' is not a form");
						}
					}
					// button object
					if (!this.isObject(def.edit.button)) {
						this.log("form", elem + ".edit.button must be an object");
					}
					else {
						list = ['background','class'];
						if (!this.isInList(Object.keys(def.edit.button), list)) {
							this.log("form", elem + ".edit.button must only have these elements: " + list.join(', '));
						}
						else {
							if (!this.isString(def.edit.button.background)) {
								this.log("form", elem + ".edit.button.background must be a string");
							}
							if (!this.isString(def.edit.button.class)) {
								this.log("form", elem + ".edit.button.class must be a string");
							}
						}
					}
					// column object
					if (!this.isObject(def.edit.column)) {
						this.log("form", elem + ".edit.column must be an object");
					}
					else {
						list = ['style','title'];
						if (!this.isInList(Object.keys(def.edit.column), list)) {
							this.log("form", elem + ".edit.column must only have these elements: " + list.join(', '));
						}
						else {
							if (!this.isString(def.edit.column.style)) {
								this.log("form", elem + ".edit.column.style must be a string");
							}
							if (!this.isString(def.edit.column.title)) {
								this.log("form", elem + ".edit.column.title must be a string");
							}
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
				if (!this.isObject(def.ok)) {
					this.log("form", elem + ".ok must be an object");
				}
				list = ['action','button'];
				if (!this.isInList(Object.keys(def.ok), list)) {
					this.log("form", elem + ".ok must only have these elements: " + list.join(', '));
				}
				else {
					// action string
					if (!this.isString(def.ok.action)) {
						this.log("form", elem + ".ok.action must be a string");
					}
					// button object
					if (!this.isObject(def.ok.button)) {
						this.log("form", elem + ".ok.button must be an object");
					}
					else {
						list = ['background','class'];
						if (!this.isInList(Object.keys(def.ok.button), list)) {
							this.log("form", elem + ".ok.button must only have these elements: " + list.join(', '));
						}
						else {
							if (!this.isString(def.ok.button.background)) {
								this.log("form", elem + ".ok.button.background must be a string");
							}
							if (!this.isString(def.ok.button.class)) {
								this.log("form", elem + ".ok.button.class must be a string");
							}
						}
					}
				}
			}
			else {
				this.log("form", elem + ".ok button can only be on a form");
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

		if (!this.isObject(def)) {
			this.log("form", elem + " must be an object");
		}

		// loop through fields
		flds = Object.keys(def);
		for (i=0; i<flds.length; i++) {
			elem = form + ".fields." + flds[i];
			// is the field valid
			if (!this.field[flds[i]]) {
				this.log("form", elem + " does not match a field");
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
					if (def[flds[i]].visible && def[flds[i]].description && !this.isString(def[flds[i]].description)) {
						this.log("form", elem + ".description must be a string");
					}
					// title - mandatory if visible
					if (def[flds[i]].visible && !this.isString(def[flds[i]].title)) {
						this.log("form", elem + ".title must be a string");
					}
				}
				// type - mandatory
				if (!this.isString(def[flds[i]].type)) {
					this.log("form", elem + ".type must be a string");
				}
				else {
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
						if (!this.isObject(def[flds[i]].options)) {
							this.log("form", elem + ".options must be an object for text");
						}
						else {
							// Valid elements
							list = ['checks','separator'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								// separator - mandatory
								if (!this.isString(def[flds[i]].options.separator)) {
									this.log("form", elem + ".options.separator must be a string");
								}
								if (def[flds[i]].options.checks) {
									// Valid elements for checks
									list = ['format','mandatory'];
									if (!this.isInList(Object.keys(def[flds[i]].options.checks), list)) {
										this.log("form", elem + ".options.checks must only have these elements: " + list.join(', '));
									}
									else {
										// checks.format - optional
										if (def[flds[i]].options.checks.format && !this.isString(def[flds[i]].options.checks.format)) {
											this.log("form", elem + ".options.checks.format must be a string");
										}
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
						if (!this.isObject(def[flds[i]].options)) {
							this.log("form", elem + ".options must be an object for a list");
						}
						else {
							// Valid elements
							list = ['display','list'];
							if (!this.isInList(Object.keys(def[flds[i]].options), list)) {
								this.log("form", elem + ".options must only have these elements: " + list.join(', '));
							}
							else {
								// list - mandatory
								if (!this.isString(def[flds[i]].options.list)) {
									this.log("form", elem + ".options.list must be a string");
								}
								// display - mandatory
								if (!this.isObject(def[flds[i]].options.display)) {
									this.log("form", elem + ".options.display must be an object");
								}
								else {
									// display.select - mandatory
									if (!this.isString(def[flds[i]].options.display.select)) {
										this.log("form", elem + ".options.display.select must be a string");
									}
									// display.select - 'single' or 'multiple'
									if (def[flds[i]].options.display.select !== 'single' && def[flds[i]].options.display.select !== 'multiple') {
										this.log("form", elem + ".options.display.select must be single|multiple");
									}
									// display.height - mandatory if select is 'multiple'
									if (def[flds[i]].options.display.select === 'multiple' && !this.isNumber(def[flds[i]].options.display.height)) {
										this.log("form", elem + ".options.display.height must be an integer");
									}
								}
							}
						}
					}
					// integer options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'integer') {
						if (!this.isObject(def[flds[i]].options)) {
							this.log("form", elem + ".options must be an object for an integer");
						}
						else {
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
									if (def[flds[i]].options.checks.format && !this.isString(def[flds[i]].options.checks.format)) {
										this.log("form", elem + ".options.checks.format must be a string");
									}
									// checks.mandatory - optional
									if (def[flds[i]].options.checks.mandatory && !this.isTrueFalse(def[flds[i]].options.checks.mandatory)) {
										this.log("form", elem + ".options.checks.mandatory must be true|false");
									}
									// checks.range - optional
									if (def[flds[i]].options.checks.range && !this.isObject(def[flds[i]].options.checks.range)) {
										this.log("form", elem + ".options.checks.range must be an object");
									}
									else {
										// Valid elements for range
										list = ['min','max'];
										if (!this.isInList(Object.keys(def[flds[i]].options.checks.range), list)) {
											this.log("form", elem + ".options.checks.range must only have these elements: " + list.join(', '));
										}
										else {
											// min - integer optional
											if (def[flds[i]].options.checks.range.min && !this.isNumber(def[flds[i]].options.checks.range.min)) {
												this.log("form", elem + ".options.checks.range.min must be an integer");
											}
											// max - integer optional
											if (def[flds[i]].options.checks.range.max && !this.isNumber(def[flds[i]].options.checks.range.max)) {
												this.log("form", elem + ".options.checks.range.max must be an integer");
											}
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
						if (!this.isObject(def[flds[i]].options)) {
							this.log("form", elem + ".options must be an object for a password");
						}
						else {
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
									if (def[flds[i]].options.checks.format && !this.isString(def[flds[i]].options.checks.format)) {
										this.log("form", elem + ".options.checks.format must be a string");
									}
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
						if (!this.isObject(def[flds[i]].options)) {
							this.log("form", elem + ".options must be an object for text");
						}
						else {
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
										if (def[flds[i]].options.checks.format && !this.isString(def[flds[i]].options.checks.format)) {
											this.log("form", elem + ".options.checks.format must be a string");
										}
										// checks.mandatory - optional
										if (def[flds[i]].options.checks.mandatory && !this.isTrueFalse(def[flds[i]].options.checks.mandatory)) {
											this.log("form", elem + ".options.checks.mandatory must be true|false");
										}
									}
								}
								if (def[flds[i]].options.display) {
									// display - mandatory
									if (def[flds[i]].options.display && !this.isObject(def[flds[i]].options.display)) {
										this.log("form", elem + ".options.display must be an object");
									}
									else {
										// display.height - mandatory
										if (!this.isNumber(def[flds[i]].options.display.height)) {
											this.log("form", elem + ".options.display.height must be an integer");
										}
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
			if (!this.isObject(this.menu.title)) {
				this.log("menu", "'title' element must be an object");
			}
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
								if (!this.isString(this.menu.menubar[i].options[p].action)) {
									this.log("menu", elem + ".action must be a string");
								}
								if (!this.isString(this.menu.menubar[i].options[p].id)) {
									this.log("menu", elem + ".id must be a string");
								}
								if (!this.isString(this.menu.menubar[i].options[p].title)) {
									this.log("menu", elem + ".title must be a string");
								}
							}
						}
					}
					// menubar array, nested non-options array
					else {
						if (!this.isString(this.menu.menubar[i][keys[n]])) {
							this.log("menu", elem + "." + keys[n] + " must be a string");
						}
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
	 * @param {object} data Data to be validated.
	 * @description Check the data is a number.
	 */
	isNumber (data) {
		return (typeof data === 'number') ? true : false;
	}


	/**
	 * @method isObject
	 * @memberof Validate
	 * @param {object} data Data to be validated.
	 * @description Check the data is an object.
	 */
	isObject (data) {
		return (typeof data === 'object' && data.length === undefined) ? true : false;
	}


	/**
	 * @method isString
	 * @memberof Validate
	 * @param {string} data Data to be validated.
	 * @description Check the data is a string.
	 */
	isString (data) {
		return (typeof data === 'string') ? true : false;
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
