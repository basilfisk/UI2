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
		this.defaults = {
			width: { min:10, max: 100 }
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
		var name, forms, i, form, list, n;

		forms = Object.keys(this.form);
		for (i=0; i<forms.length; i++) {
			form = this.form[forms[i]];
			name = forms[i];

			// title - mandatory string
			this.isString("form", form.title, name + ".title", true);
			// type - mandatory string
			if (this.isString("form", form.type, name + ".type", true)) {
				// Valid types
				list = ['form','table'];
				if (this.isInList("form", [form.type], name + ".type", list, true)) {
					// common elements in form or table
					list = ['buttons','title','type','width'];
					// table/form specific elements
					if (form.type === 'table') {
						list.push('columns');
					}
					else {
						list.push('fields');
					}
					// type - mandatory object
					this.isInList("form", Object.keys(form), name, list, true);
					
					// key & column - table only
					if (form.type === 'table') {
						name = forms[i] + ".columns";
						if (this.isArray("form", form.columns, name, true)) {
							for (n=0; n<form.columns.length; n++) {
								list = ['id','style','title'];
								if (this.isInList("form", Object.keys(form.columns[n]), name, list, true)) {
									name = forms[i] + ".columns[" + n + "].id";
									if (this.isString("form", form.columns[n].id, name, true)) {
										name = forms[i] + ".columns[" + n + "].id '" + form.columns[n].id + "'";
										this.isLinked("form", form.columns[n].id, name, "field");
									}
									// optional
									name = forms[i] + ".columns[" + n + "].";
									this.isString("form", form.columns[n].style, name + "style", false);
									this.isString("form", form.columns[n].title, name + "title", false);
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
			// width - optional number in range
			if (this.isNumber("form", form.width, name + ".width", false)) {
				this.isInRange("form", form.width, name + ".width", this.defaults.min, this.defaults.max);
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
		var name, list;

		// 'buttons' must exist
		name = form + ".buttons";
		if (this.isObject("form", def, name, true)) {
			// Valid fields
			list = ['add','close','delete','edit','ok'];
			this.isInList("form", Object.keys(def), name, list, true);

			// add button
			if (def.add) {
				name = form + ".buttons.add";
				// only on a table
				if (type === 'table') {
					this.isObject("form", def.add, name, true);
					list = ['form','button'];
					if (this.isInList("form", Object.keys(def.add), name, list, true)) {
						// form string
						name = form + ".buttons.add.form";
						if (this.isString("form", def.add.form, name, true)) {
							this.isLinked("form", def.add.form, name, "form");
						}
						// button object
						name = form + ".buttons.add.button";
						if(this.isObject("form", def.add.button, name, true)) {
							list = ['background','class'];
							if (this.isInList("form", Object.keys(def.add.button), name, list, true)) {
								this.isString("form", def.add.button.background, name + ".background", true);
								this.isString("form", def.add.button.class, name + ".class", true);
							}
						}
					}
				}
				else {
					this.log("form", name + " button can only be on a table");
				}
			}

			// close button - forms and tables
			if (def.close) {
				name = form + ".buttons.close";
				if (this.isObject("form", def.close, name, true)) {
					list = ['button'];
					if (this.isInList("form", Object.keys(def.close), name, list, true)) {
						// close.button
						name = form + ".buttons.close.button";
						this.isObject("form", def.close.button, name, true);
						list = ['class','image'];
						if (this.isInList("form", Object.keys(def.close.button), name, list, true)) {
							this.isString("form", def.close.button.class, name + ".class", true);
							this.isString("form", def.close.button.image, name + ".image", true);
						}
					}
				}
			}

			// delete button
			if (def.delete) {
				// only on a table
				name = form + ".buttons.delete";
				if (type === 'table') {
					this.isObject("form", def.delete, name, true);
					list = ['action','button','column','key'];
					if (this.isInList("form", Object.keys(def.delete), name, list, true)) {
						// form string
						this.isString("form", def.delete.action, name + ".action", true);
						// button object
						if (this.isObject("form", def.delete.button, name + ".button", true)) {
							list = ['background','class'];
							if (this.isInList("form", Object.keys(def.delete.button), name + ".button", list, true)) {
								this.isString("form", def.delete.button.background, name + ".button.background", true);
								this.isString("form", def.delete.button.class, name + ".button.class", true);
							}
						}
						// column object
						if (this.isObject("form", def.delete.column, name + ".column", true)) {
							list = ['style','title'];
							if (this.isInList("form", Object.keys(def.delete.column), name + ".column", list, true)) {
								this.isString("form", def.delete.column.style, name + ".column.style", true);
								this.isString("form", def.delete.column.title, name + ".column.title", true);
							}
						}
						// key - string and linked to field
						if (this.isString("form", def.delete.key, name + ".key", true)) {
							this.isLinked("form", def.delete.key, name + ".key", "field");
						}
					}
				}
				else {
					this.log("form", name + " button can only be on a table");
				}
			}

			// edit button
			if (def.edit) {
				// only on a table
				name = form + ".buttons.edit";
				if (type === 'table') {
					this.isObject("form", def.edit, name, true);
					list = ['form','button','column'];
					if (this.isInList("form", Object.keys(def.edit), name, list, true)) {
						// form string
						if (this.isString("form", def.edit.form, name + ".form", true)) {
							this.isLinked("form", def.edit.form, name + ".form", "form");
						}
						// button object
						if (this.isObject("form", def.edit.button, name + ".button", true)) {
							list = ['background','class'];
							if (this.isInList("form", Object.keys(def.edit.button), name + ".button", list, true)) {
								this.isString("form", def.edit.button.background, name + ".button.background", true);
								this.isString("form", def.edit.button.class, name + ".button.class", true);
							}
						}
						// column object
						if (this.isObject("form", def.edit.column, name + ".column", true)) {
							list = ['style','title'];
							if (this.isInList("form", Object.keys(def.edit.column), name + ".column", list, true)) {
								this.isString("form", def.edit.column.style, name + ".column.style", true);
								this.isString("form", def.edit.column.title, name + ".column.title", true);
							}
						}
					}
				}
				else {
					this.log("form", name + " button can only be on a table");
				}
			}
		
			// ok button
			if (def.ok) {
				// only on a form
				name = form + ".buttons.ok";
				if (type === 'form') {
					this.isObject("form", def.ok, name, true);
					list = ['action','button'];
					if (this.isInList("form", Object.keys(def.ok), name, list, true)) {
						// action string
						this.isString("form", def.ok.action, name + ".action", true);
						// button object
						if (this.isObject("form", def.ok.button, name + ".button", true)) {
							list = ['background','class'];
							if (this.isInList("form", Object.keys(def.ok.button), name + ".button", list, true)) {
								this.isString("form", def.ok.button.background, name + ".button.background", true);
								this.isString("form", def.ok.button.class, name + ".button.class", true);
							}
						}
					}
				}
				else {
					this.log("form", name + " button can only be on a form");
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
		var flds, i, name, list;

		this.isObject("form", def, form + ".fields", true);

		// loop through fields
		flds = Object.keys(def);
		for (i=0; i<flds.length; i++) {
			// is the field valid
			name = form + ".fields." + flds[i];
			this.isLinked("form", flds[i], name, "field");
			// Valid fields
			list = ['description','edit','options','title','type','visible'];
			if (this.isInList("form", Object.keys(def[flds[i]]), name, list, true)) {
				// edit - optional
				this.isTrueFalse("form", def[flds[i]].edit, name + ".edit", false);
				// visible - mandatory
				if (this.isTrueFalse("form", def[flds[i]].visible, name + ".visible", true)) {
					// description - optional if visible
					if (def[flds[i]].visible) {
						this.isString("form", def[flds[i]].description, name + ".description", false);
						// title - mandatory if visible
						this.isString("form", def[flds[i]].title, name + ".title", true);
					}
				}
				// type - mandatory
				if (this.isString("form", def[flds[i]].type, name + ".type", true)) {
					// type - must be a permitted value
					list = ['array','id','integer','list','password','text'];
					this.isInList("form", [def[flds[i]].type], name + ".type", list, true);
					// array options - mandatory object
					if (def[flds[i]].type === 'array') {
						if (this.isObject("form", def[flds[i]].options, name + ".options", true)) {
							// Valid elements
							list = ['checks','separator'];
							if (this.isInList("form", Object.keys(def[flds[i]].options), name + ".options", list, true)) {
								// separator - mandatory
								this.isString("form", def[flds[i]].options.separator, name + ".options.separator", true);
								if (def[flds[i]].options.checks) {
									// Valid elements for checks
									list = ['format','mandatory'];
									if (this.isInList("form", Object.keys(def[flds[i]].options.checks), name + ".options.checks", list, true)) {
										// checks.format - optional
										this.isString("form", def[flds[i]].options.checks.format, name + ".options.checks.format", true);
										// checks.mandatory - optional
										this.isTrueFalse("form", def[flds[i]].options.checks.mandatory, name + ".options.checks.mandatory", true);
									}
								}
							}
						}
					}
					// integer options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'integer') {
						if (this.isObject("form", def[flds[i]].options, name + ".options", true)) {
							// Valid elements
							list = ['checks'];
							if (this.isInList("form", Object.keys(def[flds[i]].options), name + ".options", list, true)) {
								// Valid elements for checks
								list = ['format','mandatory','range'];
								if (this.isInList("form", Object.keys(def[flds[i]].options.checks), name + ".options.checks", list, true)) {
									// checks.format - optional
									this.isString("form", def[flds[i]].options.checks.format, name + ".options.checks.format", true);
									// checks.mandatory - optional
									this.isTrueFalse("form", def[flds[i]].options.checks.mandatory, name + ".options.checks.mandatory", true);
									// checks.range - optional
									if (this.isObject("form", def[flds[i]].options.checks.range, name + ".options.checks.range", false)) {
										// Valid elements for range
										list = ['min','max'];
										if (this.isInList("form", Object.keys(def[flds[i]].options.checks.range), name + ".options.checks.range", list, true)) {
											// min - integer optional
											this.isNumber("form", def[flds[i]].options.checks.range.min, name + ".options.checks.range.min", false);
											// max - integer optional
											this.isNumber("form", def[flds[i]].options.checks.range.max, name + ".options.checks.range.max", false);
											// min < max
											if (def[flds[i]].options.checks.range.min && def[flds[i]].options.checks.range.max) {
												if (parseInt(def[flds[i]].options.checks.range.min) >= parseInt(def[flds[i]].options.checks.range.max)) {
													this.log("form", name + ".options.checks.range min must be less than max");
												}
											}
										}
									}
								}
							}
						}
					}
					// list options - mandatory object
					if (def[flds[i]].type === 'list') {
						if (this.isObject("form", def[flds[i]].options, name + ".options", true)) {
							// Valid elements
							list = ['display','list'];
							if (this.isInList("form", Object.keys(def[flds[i]].options), name + ".options", list, true)) {
								// list - mandatory
								this.isString("form", def[flds[i]].options.list, name + ".options.list", true);
								// list - must be registered
								this.isLinked("form", def[flds[i]].options.list, name + ".options.list '" + def[flds[i]].options.list + "'", "list");
								// display - mandatory
								if (this.isObject("form", def[flds[i]].options.display, name + ".options.display", true)) {
									list = ['height','select'];
									if (this.isInList("form", Object.keys(def[flds[i]].options.display), name + ".options.display", list, true)) {
										// display.select - mandatory
										this.isString("form", def[flds[i]].options.display.select, name + ".options.display.select", true);
										// display.select - 'single' or 'multiple'
										list = ['single','multiple'];
										this.isInList("form", [def[flds[i]].options.display.select], name + ".options.display.select", list, true);
										// display.height - mandatory if select is 'multiple'
										if (def[flds[i]].options.display.select === 'multiple') {
											this.isNumber("form", def[flds[i]].options.display.height, form + ".fields.options.display.height", true);
										}
									}
								}
							}
						}
					}
					// password options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'password') {
						if (this.isObject("form", def[flds[i]].options, name + ".options", true)) {
							// Valid elements
							list = ['checks'];
							if (this.isInList("form", Object.keys(def[flds[i]].options), name + ".options", list, true)) {
								// Valid elements for checks
								list = ['format','mandatory'];
								if (this.isInList("form", Object.keys(def[flds[i]].options.checks), name + ".options.checks", list, true)) {
									// checks.format - optional
									this.isString("form", def[flds[i]].options.checks.format, name + ".options.checks.format", true);
									// checks.mandatory - optional
									this.isTrueFalse("form", def[flds[i]].options.checks.mandatory, name + ".options.checks.mandatory", true);
								}
							}
						}
					}
					// text options - optional object
					if (def[flds[i]].options && def[flds[i]].type === 'text') {
						if (this.isObject("form", def[flds[i]].options, name + ".options", true)) {
							// Valid elements
							list = ['checks','display'];
							if (this.isInList("form", Object.keys(def[flds[i]].options), name + ".options", list, true)) {
								if (def[flds[i]].options.checks) {
									// Valid elements for checks
									list = ['format','mandatory'];
									if (this.isInList("form", Object.keys(def[flds[i]].options.checks), name + ".options.checks", list, true)) {
										// checks.format - optional
										this.isString("form", def[flds[i]].options.checks.format, name + ".options.checks.format", true);
										// checks.mandatory - optional
										this.isTrueFalse("form", def[flds[i]].options.checks.mandatory, name + ".options.checks.mandatory", true);
									}
								}
								if (def[flds[i]].options.display) {
									// display - mandatory
									if (this.isObject("form", def[flds[i]].options.display, name + ".options.display", true)) {
										// display.height - mandatory
										this.isNumber("form", def[flds[i]].options.display.height, name + ".options.display.height", true);
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
		var list, i, name, n;

		// title - mandatory
		if (this.isObject("menu", this.menu.title, "title", true)) {
			list = ['text','class'];
			if (this.isInList("menu", Object.keys(this.menu.title), "title", list, true)) {
				this.isString("menu", this.menu.title.text, "title.text", true);
				this.isString("menu", this.menu.title.class, "title.class", false);
			}
		}
		
		// menubar -mandatory
		if (this.isArray("menu", this.menu.menubar, "menubar", true)) {
			// menubar array objects - all mandatory
			for (i=0; i<this.menu.menubar.length; i++) {
				list = ['id','menu','options','title'];
				name = "menubar[" + i + "]";
				this.isInList("menu", Object.keys(this.menu.menubar[i]), name, list, true);
				this.isString("menu", this.menu.menubar[i].id, name + ".id", true);
				this.isString("menu", this.menu.menubar[i].menu, name + ".menu", true);
				this.isString("menu", this.menu.menubar[i].title, name + ".title", true);
				// options - array, mandatory
				if (this.isArray("menu", this.menu.menubar[i].options, name + ".options", true)) {
					for (n=0; n<this.menu.menubar[i].options.length; n++) {
						list = ['access','action','id','title'];
						if (this.isInList("menu", Object.keys(this.menu.menubar[i].options[n]), name + ".options[" + n + "]", list, true)) {
							this.isString("menu", this.menu.menubar[i].options[n].action, name + ".action", true);
							this.isString("menu", this.menu.menubar[i].options[n].id, name + ".id", true);
							this.isString("menu", this.menu.menubar[i].options[n].title, name + ".title", true);
							this.isArray("menu", this.menu.menubar[i].options[n].access, name + ".options[" + n + "].access", true);
							list = ['manager','superuser','user'];
							this.isInList("menu", this.menu.menubar[i].options[n].access, name + ".options[" + n + "].access", list, true);
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
	 * @param {string} type Type of data to be validated.
	 * @param {array} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {boolean} mand Is data element mandatory.
	 * @description Check the data is an array.
	 */
	isArray (type, data, name, mand) {
		if (data || mand) {
			if (data) {
				if (typeof data === 'object' && data.length !== undefined) {
					return true;
				}
				else {
					this.log(type, name + " must be an array");
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
	 * @method isInList
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {array} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {array} list List of valid values.
	 * @param {boolean} mand Is data element mandatory.
	 * @description Check that each element of data matches a value in the list.
	 */
	isInList (type, data, name, list, mand) {
		var i, n, status = true, match;
		if (data || mand) {
			for (i=0; i<data.length; i++) {
				match = false;
				for (n=0; n<list.length; n++) {
					if (data[i] === list[n]) {
						match = true;
					}
				}
				status = status && match;
			}
			if (status) {
				return true;
			}
			else {
				this.log(type, name + " must be one of: " + list.join(', '));
				return false;
			}
		}
		else {
			return true;
		}
	}


	/**
	 * @method isLinked
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {object} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {string} elem Type of element (field|form|list).
	 * @description Check the data is linked to another element.
	 */
	isLinked (type, data, name, elem) {
		var obj;

		if (elem === 'form') {
			obj = this.form;
		}
		else {
			obj = (elem === 'field') ? this.field.fields : this.field.lists;
		}

		if (obj[data]) {
			return true;
		}
		else {
			this.log(type, name + " is not a registered " + elem);
			return false;
		}
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
					this.log(type, name + " '" + data + "' must be a number");
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
	 * @param {boolean} mand Is data element mandatory.
	 * @description Check the data is an object.
	 */
	isObject (type, data, name,mand) {
		if (data || mand) {
			if (data) {
				if (typeof data === 'object' && data.length === undefined) {
					return true;
				}
				else {
					this.log(type, name + " must be an object");
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
	 * @method isInRange
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {number} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {number} min Minimum value.
	 * @param {number} max Maximum value.
	 * @description Check the data is in a range.
	 */
	isInRange (type, data, name, min, max) {
		if (data) {
			if (data >= min && data <= max) {
				return true;
			}
			else {
				this.log(type, name + " must be between " + min + " and " + max);
				return false;
			}
		}
		else {
			return true;
		}
	}


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
					this.log(type, name + " '" + data + "' must be a string");
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
	 * @method isTrueFalse
	 * @memberof Validate
	 * @param {string} type Type of data to be validated.
	 * @param {object} data Data to be validated.
	 * @param {string} name Name of data being validated.
	 * @param {boolean} mand Is data element mandatory.
	 * @description Check the data is either 'true' or 'false'.
	 */
	isTrueFalse (type, data, name, mand) {
		if (data || mand) {
			if (data) {
				if (typeof data === 'boolean') {
					return true;
				}
				else {
					this.log(type, name + " '" + data + "' must be true|false");
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
