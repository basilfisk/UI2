var formDefinitions = {
	"about": {
		"title": "Information About the Current User",
		"buttons": {
			"close": true,
		},
		"fields": {
			"aboutUserName": {
				"element": "name",
				"title": "User Name",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutLoginName": {
				"element": "username",
				"title": "Login Name",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutEmail": {
				"element": "email",
				"title": "Email",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutCompany": {
				"element": "company",
				"title": "Company",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutGroup": {
				"element": "group",
				"title": "Group",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutRole": {
				"element": "role",
				"title": "Role",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutClients": {
				"element": "clients",
				"title": "Clients",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutBundles": {
				"element": "bundles",
				"title": "Bundles",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutJWT": {
				"element": "jwt",
				"title": "JSON Web Token",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"display": {
						"size": 8
					}
				}
			}
		}
	},
	"commandAdd": {
		"title": "Add Command",
		"buttons": {
			"add": "formFunctions.command.addSave()",
			"close": true
		},
		"fields": {
			"commandAddName": {
				"element": "name",
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			},
			"commandAddService": {
				"element": "service",
				"title": "Service Name",
				"description": "Enter name of service",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			}
		}
	},
	"commandEdit": {
		"title": "Edit Command",
		"buttons": {
			"close": true,
			"save": "command.editSave()"
		},
		"fields": {
			"commandEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandEditName": {
				"element": "name",
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			},
			"commandEditService": {
				"element": "service",
				"title": "Service Name",
				"description": "Enter name of service",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			}
		}
	},
	"commandEditCommand": {
		"title": "Edit Command Text",
		"buttons": {
			"close": true,
			"delete": true,
			"save": "command.editSave()"
		},
		"fields": {
			"commandEditCommandId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandEditCommandVersion": {
				"element": "version",
				"title": "Version",
				"description": "Enter version number of command",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			},
			"commandEditCommandText": {
				"element": "command",
				"title": "Command",
				"description": "Enter command",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"size": 20
					}
				}
			}
		}
	},
	"commandEditParameters": {
		"title": "Edit Parameters",
		"buttons": {
			"close": true,
			"delete": true,
			"save": "command.editSave()"
		},
		"fields": {
			"commandEditParametersId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandEditParametersVersion": {
				"element": "version",
				"title": "Version",
				"description": "Enter version number of parameters",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			},
			"commandEditParametersText": {
				"element": "parameters",
				"title": "Parameters",
				"description": "Enter parameters",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"size": 20
					}
				}
			}
		}
	},
	"commandTable": {
		"title": "Commands",
		"buttons": {
			"close": true,
			"add": "command.add()",
		},
		"columns": ["Name", "Service", "Command", "Parameters", "Delete"]
	},
	"login": {
		"title": "Login to the Console",
		"buttons": {
			"save": "loginCheck"
		},
		"fields": {
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
