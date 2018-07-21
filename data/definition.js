var formDefinitions = {
	"title": {
		"text": "VeryAPI BF",
		"class": "navbar-brand pull-right"
	},
	"login" : {
		"title": "Login to the VeryAPI Console",
		"access": ["superuser","manager","user"],
		"buttons": {
			"save": true
		},
		"fields" : {
			"username": {
				"element": "username",
				"title": "User Name",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaNumeric"
					}
				}
			},
			"password": {
				"element": "password",
				"title": "Password",
				"type": "password",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "password"
					}
				}
			}
		}
	}
};
