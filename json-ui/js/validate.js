/**
 * @file validate.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description Validate the menu and form definitions for json-ui.
 */

/**
 * @namespace Validate
 * @author Basil Fisk
 * @description Functions to validate the menu and form definition.
 */
class Validate {
	constructor () {
		this.fs = require('fs');
	}


	/**
	 * @method checkForms
	 * @memberof Validate
	 * @description Check the form definitions.
	 */
	checkForms () {
		var forms, i, form, list,
			elem = form + ".";

		this.log("form", "Validating: " + this.file.form);

		forms = Object.keys(this.form);
		for (i=0; i<forms.length; i++) {
			form = this.form[forms[i]];

			// type element is mandatory
			if (!form.type) {
				this.log("form", forms[i] + ".type is mandatory");
			}

			// Valid types
			list = ['form','table'];
			if (!this.isInList([form.type], list)) {
				this.log("form", forms[i] + ".type must only have these values: " + list.join(', '));
			}

			// Valid fields
			if (form.type === 'form') {
				list = ['buttons','fields','title','type','width'];
			}
			else {
				list = ['buttons','columns','fields','key','title','type','width'];
			}
			if (!this.isInList(Object.keys(form), list)) {
				this.log("form", "'" + forms[i] + "' form must only have these elements: " + list.join(', '));
			}

			// title element
			if (!this.isString(form.title)) {
				this.log("form", forms[i] + ".title must be a string");
			}

			// buttons element
			this.checkFormButtons(forms[i], form.type, form.buttons);

			// fields element
			this.checkFormFields(forms[i], form.fields);
//return;
		}
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
			if (!this.isObject(def.add)) {
				this.log("form", elem + ".add must be an object");
			}
			else {
				// add.form on a table
				if (type === 'table') {
					if (!this.isString(def.add.form)) {
						this.log("form", elem + ".add.form must be a string");
					}
					list = ['form','icon'];
					if (!this.isInList(Object.keys(def.add), list)) {
						this.log("form", elem + ".add must only have these elements: " + list.join(', '));
					}
				}
				// add.action on a form
				else {
					if (!this.isString(def.add.action)) {
						this.log("form", elem + ".add.action must be a string");
					}
					list = ['action','icon'];
					if (!this.isInList(Object.keys(def.add), list)) {
						this.log("form", elem + ".add must only have these elements: " + list.join(', '));
					}
				}
				// add.icon
				if (!this.isObject(def.add.icon)) {
					this.log("form", elem + ".add.icon must be an object");
				}
				else {
					list = ['background','class'];
					if (!this.isInList(Object.keys(def.add.icon), list)) {
						this.log("form", elem + ".add.icon must only have these elements: " + list.join(', '));
					}
				}
			}
		}

		// close button
		if (def.close) {
			if (!this.isObject(def.close)) {
				this.log("form", elem + ".close must be an object");
			}
			else {
				list = ['icon'];
				if (!this.isInList(Object.keys(def.close), list)) {
					this.log("form", elem + ".close must only have these elements: " + list.join(', '));
				}
				else {
					// close.icon
					if (!this.isObject(def.close.icon)) {
						this.log("form", elem + ".close.icon must be an object");
					}
					list = ['class','image'];
					if (!this.isInList(Object.keys(def.close.icon), list)) {
						this.log("form", elem + ".close.icon must only have these elements: " + list.join(', '));
					}
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
		var keys, i, elem, n, p;
		elem = form + ".fields";
		if (!this.isObject(def)) {
//			this.log("form", elem + " must be an object");
//			return;
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
			return;
		}
		if (!this.isObject(this.menu.title)) {
			this.log("menu", "'title' element must be an object");
			return;
		}
		list = ['text','class'];
		if (!this.isInList(Object.keys(this.menu.title), list)) {
			this.log("menu", "'title' must only have these elements: " + list.join(', '));
			return;
		}
		
		// menubar element
		if (!this.menu.menubar) {
			this.log("menu", "Top level element 'menubar' is mandatory");
			return;
		}
		if (!this.isArray(this.menu.menubar)) {
			this.log("menu", "'menubar' element must be an array");
			return;
		}
		// menubar array objects
		for (i=0; i<this.menu.menubar.length; i++) {
			elem = "menubar[" + i + "]";
			keys = Object.keys(this.menu.menubar[i]);
			list = ['id','menu','options','title'];
			if (!this.isInList(Object.keys(this.menu.menubar[i]), list)) {
				this.log("menu", elem + " must only have these elements: " + list.join(', '));
				return;
			}
			for (n=0; n<keys.length; n++) {
				// menubar array, nested options array
				if (keys[n] === 'options') {
					elem = "menubar[" + i + "].options";
					if (!this.isArray(this.menu.menubar[i].options)) {
						this.log("menu", elem + " must be an array");
						return;
					}
					for (p=0; p<this.menu.menubar[i].options.length; p++) {
						elem = "menubar[" + i + "].options[" + p + "]";
						list = ['access','action','id','title'];
						if (!this.isInList(Object.keys(this.menu.menubar[i].options[p]), list)) {
							this.log("menu", elem + " must only have these elements: " + list.join(', '));
							return;
						}
						// elements within nested options array
						if (!this.isArray(this.menu.menubar[i].options[p].access)) {
							this.log("menu", elem + ".access must be an array");
							return;
						}
						if (!this.isString(this.menu.menubar[i].options[p].action)) {
							this.log("menu", elem + ".action must be a string");
							return;
						}
						if (!this.isString(this.menu.menubar[i].options[p].id)) {
							this.log("menu", elem + ".id must be a string");
							return;
						}
						if (!this.isString(this.menu.menubar[i].options[p].title)) {
							this.log("menu", elem + ".title must be a string");
							return;
						}
					}
				}
				// menubar array, nested non-options array
				else {
					if (!this.isString(this.menu.menubar[i][keys[n]])) {
						this.log("menu", elem + "." + keys[n] + " must be a string");
						return;
					}
				}
			}
		}

		this.log("menu", "Successfully validated: " + this.file.menu);
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
	 * @method init
	 * @memberof Validate
	 * @description Read the files to be validated.
	 */
	init () {
		var file;
		this.root = '/../../example/client/ui';
		this.file = {
			form: __dirname + this.root + '/forms.js',
			menu: __dirname + this.root + '/menu.js'
		}

		// Read menu definition file and remove Javascript wrapper
		this.fs.readFile(this.file.menu, (err, data) => {
			file = data.toString();
			file = file.replace('var menuDefinitions = {', '{');
			file = file.replace('};', '}');
			try {
				this.menu = JSON.parse(file);

				// Read form definition file and remove Javascript wrapper
				this.fs.readFile(this.file.form, (err, data) => {
					file = data.toString();
					file = file.replace('var formDefinitions = {', '{');
					file = file.replace('};', '}');
					try {
						this.form = JSON.parse(file);
//						this.checkMenus();
						this.checkForms();
									}
					catch (err) {
						this.log("form", "Invalid JSON in forms.js: " + err.message);
					}
				});
			}
			catch (err) {
				this.log("menu", "Invalid JSON in menu.js: " + err.message);
			}
		});
	}


	log (defn, msg) {
		console.log("[" + defn + "] " + msg);
	}
}

var validate = new Validate();
validate.init();
