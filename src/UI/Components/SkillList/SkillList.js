/**
 * UI/Components/SkillList/SkillList.js
 *
 * SkillWindow
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */
define(function (require)
{
	'use strict';
	
	var publicName = 'SkillList';
	
	var SkillList = require('./SkillList/SkillList');
	var SkillListV0 = require('./SkillList/SkillList');
	
	var UIVersionManager = require('UI/UIVersionManager');
	
	var versionInfo = {
		default: SkillList,
		common: {
			20181022:	SkillList
		},
		re: {
			
		},
		prere:{
			
		}
	};
	
	var Controller = UIVersionManager.getUIController(publicName, versionInfo);
	
	return Controller;
});