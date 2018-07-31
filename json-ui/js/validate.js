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
		var keys, i;

		keys = Object.keys(this.form);
		for (i=0; i<keys.length; i++) {
			this.checkForm(keys[i], this.form[keys[i]]);
			return;
		}

		this.log("form", "Successfully validated: " + this.file.form);
	}


	/**
	 * @method checkForm
	 * @memberof Validate
	 * @param {string} form Name of the form.
	 * @param {object} defn Definition of the form.
	 * @description Check the definition of a single form.
	 */
	checkForm (form, defn) {
		var keys, i, elem, n, p;

//		keys = Object.keys(this.form);
		console.log(form, defn);
	}


	/**
	 * @method checkMenus
	 * @memberof Validate
	 * @description Check the menu definitions.
	 */
	checkMenus () {
		var keys, i, elem, n, p;

		// title element
		if (!this.menu.title) {
			this.log("menu", "Top level element 'title' is mandatory");
			return;
		}
		if (!this.isObject(this.menu.title)) {
			this.log("menu", "'title' element must be an object");
			return;
		}
		if (!this.isInList(Object.keys(this.menu.title), ['text','class'])) {
			this.log("menu", "'title' must have these elements: text, class");
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
			if (!this.isInList(Object.keys(this.menu.menubar[i]), ['id','menu','options','title'])) {
				this.log("menu", elem + " must have these elements: id, menu, title, options");
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
						if (!this.isInList(Object.keys(this.menu.menubar[i].options[p]), ['access','action','id','title'])) {
							this.log("menu", elem + " must have these elements: access, action, id, title");
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
						this.checkMenus();
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
