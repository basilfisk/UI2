/**
 * @file format.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace Format
 * @author Basil Fisk
 * @description Defines the format tests that can be performed, as regular expressions.
 */

var _format = {
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
