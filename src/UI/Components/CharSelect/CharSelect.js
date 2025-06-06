/**
 * UI/Components/CharSelect/CharSelect.js
 *
 * Character Selection
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */
define(function (require)
{
	'use strict';
	
	var publicName = 'CharSelect';
	
	var CharSelect = require('./CharSelect/CharSelect');
	var CharSelectV2 = require('./CharSelectV2/CharSelectV2');
	var CharSelectV3 = require('./CharSelectV3/CharSelectV3');
	var CharSelectV4 = require('./CharSelectV4/CharSelectV4');
	
	var UIVersionManager = require('UI/UIVersionManager');
	
	var versionInfo = {
		default: CharSelect,
		common: {
		//	20180124:	CharSelectV4,
			20180124:	CharSelectV3,
			20100803:	CharSelectV2,
			20100728:	CharSelect,
			20100720:	CharSelectV2
		},
		re: {
			
		},
		prere:{
			
		}
	};
	
	var Controller = UIVersionManager.getUIController(publicName, versionInfo);
	
	return Controller;
});