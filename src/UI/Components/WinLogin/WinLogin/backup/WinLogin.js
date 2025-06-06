/**
 * UI/Components/WinLogin/WinLogin.js
 *
 * WinLogin windows
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function(require)
{
	'use strict';


	/**
	 * Dependencies
	 */
	var DB          = require('DB/DBManager');
	var Client      = require('Core/Client');
	var Configs     = require('Core/Configs');
	var Preferences = require('Core/Preferences');
	var Renderer    = require('Renderer/Renderer');
	var KEYS        = require('Controls/KeyEventHandler');
	var UIManager   = require('UI/UIManager');
	var UIComponent = require('UI/UIComponent');
	var htmlText    = require('text!./WinLogin.html');
	var cssText     = require('text!./WinLogin.css');


	/**
	 * Create WinLogin namespace
	 */
	var WinLogin = new UIComponent( 'WinLogin', htmlText, cssText );


	/**
	 * @var {Preferences}
	 */
	var _preferences = Preferences.get('WinLogin', {
		saveID: true,
		ID:     ''
	}, 1.0);


	/**
	 * @var {jQuery} username input
	 */
	var _inputUsername;


	/**
	 * @var {jQuery} userpass input
	 */
	var _inputPassword;


	/**
	 * @var {jQuery} save login ?
	 */
	var _buttonSave;


	/**
	 * Initialize win_login UI - Inherit from UIComponent
	 */
	WinLogin.init = function init()
	{

		var ui = this.ui;

		this.draggable();

		// Save Elements
		_inputUsername = ui.find('.user').mousedown(function(event){ this.focus(); this.value = ''; event.stopImmediatePropagation(); return false; });
		_inputPassword = ui.find('.pass').mousedown(function(event){ this.focus(); this.value = ''; event.stopImmediatePropagation(); return false; });
		_buttonSave    = ui.find('.save').mousedown(toggleSaveButton);

		// Connect / Exit
		ui.find('.signup').click(signup);
		ui.find('.connect').click(connect);
		ui.find('.exit').click(exit);
	};


	/**
	 * Once the component is on html - InHerit from UIComponent
	 */
	WinLogin.onAppend = function onAppend()
	{
		// Complete element
		_inputUsername.val(_preferences.saveID ? _preferences.ID : '');
		_inputPassword.val('');

		// Display save button
		Client.loadFile( DB.INTERFACE_PATH + 'login_interface/chk_save' + ( _preferences.saveID ? 'on' : 'off' ) + '.bmp', function(url) {
			_buttonSave.css('backgroundImage', 'url(' + url + ')');
		});

		if (_preferences.ID.length) {
			_inputPassword.focus();
		}
		else {
			_inputUsername.focus();
		}
	};


	/**
	 * When player press key - InHerit from UIComponent
	 *
	 * @param {object} event
	 * @return {boolean}
	 */
	WinLogin.onKeyDown = function onKeyDown( event )
	{
		switch (event.which)
		{
			case KEYS.ENTER:
				connect();
				event.stopImmediatePropagation();
				return false;

			case KEYS.ESCAPE:
				exit();
				event.stopImmediatePropagation();
				return false;

			case KEYS.TAB:
				var button = document.activeElement === _inputUsername[0] ? _inputPassword : _inputUsername;
				button.focus().select();
				event.stopImmediatePropagation();
				return false;
		}

		return true;
	};


	/**
	 * Switch the save button
	 *
	 * @param {object} event
	 * @return {boolean}
	 */
	function toggleSaveButton( event )
	{
		_preferences.saveID = !_preferences.saveID;

		Client.loadFile( DB.INTERFACE_PATH + 'login_interface/chk_save' + ( _preferences.saveID ? 'on' : 'off' ) + '.bmp', function(url) {
			_buttonSave.css('backgroundImage', 'url(' + url + ')');
		});

		event.stopImmediatePropagation();
		return false;
	}


	/**
	 * When the user click on Exit, or pressed "Escape"
	 */
	function exit()
	{
		WinLogin.onExitRequest();
		return false;
	}


	/**
	 * When user click on the button "connect", or press "enter".
	 *
	 * @return {boolean} false
	 */
	function connect()
	{
		var user = _inputUsername.val();
		var pass = _inputPassword.val();

		// Store variable in localStorage
		if (_preferences.saveID) {
			_preferences.saveID = true;
			_preferences.ID     = user;
		}
		else {
			_preferences.saveID = false;
			_preferences.ID     = '';
		}

		_preferences.save();

		// Connect
		WinLogin.onConnectionRequest( user, pass );
		return false;
	}	
	
	
/**
 * Function to redirect to the registration page in a new tab
 */
function signup() {
    window.open('https://www.the4rtist.com/register.php', '_blank');
}

/**
 * Adding the signup button fixed at the bottom center of the page
 */
document.addEventListener('DOMContentLoaded', function() {
    var signupButton = document.createElement('button');
    signupButton.textContent = 'สมัครสมาชิก';
    signupButton.style.padding = '10px 20px';
    signupButton.style.fontSize = '14px';
    signupButton.style.position = 'fixed';
    signupButton.style.bottom = '10px';
    signupButton.style.left = '50%';
    signupButton.style.transform = 'translateX(-50%)';
    signupButton.style.cursor = 'pointer';
    signupButton.style.zIndex = '1000';
    signupButton.style.backgroundColor = '#007BFF';
    signupButton.style.color = '#fff';
    signupButton.style.border = 'none';
    signupButton.style.borderRadius = '4px';

    signupButton.onclick = signup;

    document.body.appendChild(signupButton);
});







	/**
	 * Abstract function once user want to connect
	 */
	WinLogin.onConnectionRequest = function onConnectionRequest(/* user, pass */){};


	/**
	 * Abstract function when user want to exit
	 */
	WinLogin.onExitRequest = function onExitRequest(){};


	/**
	 * Create component based on view file and export it
	 */
	return UIManager.addComponent(WinLogin);
});
