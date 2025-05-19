/**
 * UI/Components/ChatRoomTabSetting/ChatRoomTabSetting.js
 *
 * Chat room box UI
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
	var DB           = require('DB/DBManager');
	var Preferences  = require('Core/Preferences');
	var jQuery       = require('Utils/jquery');
	var Renderer     = require('Renderer/Renderer');
	var Client       = require('Core/Client');
	var Mouse        = require('Controls/MouseEventHandler');
	var KEYS         = require('Controls/KeyEventHandler');
	var UIManager    = require('UI/UIManager');
	var UIComponent  = require('UI/UIComponent');
	var htmlText     = require('text!./ChatRoomTabSetting.html');
	var cssText      = require('text!./ChatRoomTabSetting.css');
	/**
	 * Create Component
	 */
	var ChatRoomTabSetting = new UIComponent( 'ChatRoomTabSetting', htmlText, cssText );


	/**
	 * @var {boolean} is ChatRoomTabSetting open ? (Temporary fix)
	 */
	ChatRoomTabSetting.isOpen = false;

	ChatRoomTabSetting.tabOption = {};

	ChatRoomTabSetting.cTypes = [1,2,3,4,8,16,32,64,256,4,128,512,1024];
	ChatRoomTabSetting.cIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

	/**
	 * @var {Preference} structure to save
	 */
	var _preferences = Preferences.get('ChatRoomTabSetting', {
		x:        480,
		y:        200,
		width:    7,
		height:   4
	}, 1.0);


	/**
	 * Initialize UI
	 */
	ChatRoomTabSetting.init = function init()
	{
		// Bindings
		this.ui.find('.extend').mousedown(onResize);
		this.ui.find('.close').click(function(){
			ChatRoomTabSetting.ui.hide();
		});
		
		this.ui.on('click', '.content .listoption button', onclickListMsgOpt);
		this.ui.on('click', '.footer-opt button.select_all', onclickListAll);
		this.draggable(this.ui.find('.titlebar'));
	};


	/**
	 * Initialize UI
	 */
	ChatRoomTabSetting.onAppend = function onAppend()
	{
		//resize( _preferences.width, _preferences.height );

		this.ui.css({
			top:  Math.min( Math.max( 0, _preferences.y), Renderer.height - this.ui.height()),
			left: Math.min( Math.max( 0, _preferences.x), Renderer.width  - this.ui.width())
		});
	};

	/**
	 * Key Event Handler
	 *
	 * @param {object} event - KeyEventHandler
	 * @return {boolean}
	 */
	ChatRoomTabSetting.onKeyDown = function onKeyDown( event ){};

	function onclickListAll(evt){
		var _elem = jQuery(evt.currentTarget);
		var _listElem = jQuery('.listoption button');
		var isSelectedAll, isOn;

		if(_elem.hasClass('active')){
			isSelectedAll = 'off';
			isOn = 'offline';
			_elem.removeClass('active');
			ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab] = {
				types: [],
				ids: [],
			};
		}else{
			isSelectedAll = 'on';
			isOn = 'online';
			_elem.addClass('active');
			
			ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab] = {
				types: [1,2,3,4,8,16,32,64,256,4,128,512,1024],
				ids: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
			};
		}

		Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/grp_'+isOn+'.bmp', function( data ){
			_listElem.css('backgroundImage', 'url('+ data +')');
		});

		Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/rodexsystem/renewal/checkbox_search_'+isSelectedAll+'.bmp', function( data ){
			_elem.css('backgroundImage', 'url('+ data +')');
		});
	}

	function onclickListMsgOpt(evt){
		var _elem = jQuery(evt.currentTarget);
		var _dataType = _elem.data('type');
		var _dataId = _elem.data('id');
		var isOn = false;
		if(!_elem){
			return;
		}

		isOn = _elem.hasClass('on') ? 'online' : 'offline';

		if(isOn == 'offline'){
			_elem.addClass('on');
			isOn = 'online';
		}else{
			_elem.removeClass('on');
			isOn = 'offline';
		}

		Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/grp_'+isOn+'.bmp', function( data ){
			_elem.css('backgroundImage', 'url('+ data +')');
		});

		if(isOn == 'online' && _dataType){
			if(!ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].types.includes(_dataType)){
				ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].types.push(_dataType);
			}
		} else {
			var index = ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].types.indexOf(_dataType);
			if(index > -1){
				ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].types.splice(index, 1);
			}
		}

		if(_dataId){
			var idsIndex = ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids.indexOf(_dataId);

			if(idsIndex > -1){
				ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids.splice(idsIndex, 1);
			} else {
				ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids.push(_dataId);
				// if(!ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids.includes(_dataId)){
				// 	ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids.push(_dataId);
				// }
			}
		}

		var listBtn = jQuery('.listoption button');
		var cSearch = ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids.length == listBtn.length ? 'on' : 'off';

		Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/rodexsystem/renewal/checkbox_search_'+cSearch+'.bmp', function( data ){
			var _selectAll = jQuery('.footer-opt button.select_all');
			_selectAll.removeClass('active');
			if(cSearch === 'on'){
				_selectAll.addClass('active');
			}
			_selectAll.css('backgroundImage', 'url('+ data +')');
		});
	}


	/**
	 * Resize ChatRoomTabSetting
	 */
	function onResize()
	{
		var ui         = ChatRoomTabSetting.ui;
		var top        = ui.position().top;
		var left       = ui.position().left;
		var lastWidth  = 0;
		var lastHeight = 0;
		var _Interval;

		function resizeProcess()
		{
			var extraX = 23 + 16 + 16 - 30;
			var extraY = 31 + 19 - 30;

			var w = Math.floor( (Mouse.screen.x - left - extraX) / 32 );
			var h = Math.floor( (Mouse.screen.y - top  - extraY) / 32 );

			// Maximum and minimum window size
			w = Math.min( Math.max(w, 7), 14);
			h = Math.min( Math.max(h, 3), 8);

			if (w === lastWidth && h === lastHeight) {
				return;
			}

			resize( w, h );
			lastWidth  = w;
			lastHeight = h;
		}

		// Start resizing
		_Interval = setInterval( resizeProcess, 30);

		// Stop resizing
		jQuery(window).one('mouseup', function(event){
			// Only on left click
			if ( event.which === 1 ) {
				clearInterval(_Interval);
			}
		});
	}

	ChatRoomTabSetting.toggle = function toggle(){
		if(this.ui.is(':visible')){
			this.ui.hide();
		} else {
			this.renderOpt();
			this.ui.show();
		}
	}

	ChatRoomTabSetting.renderOpt = function renderOpt(){
		var optList = ChatRoomTabSetting.tabOption[UIManager.components.ChatBox.activeTab].ids;
		var elems = this.ui.find('.content .listoption button');

		elems.removeClass('on');
		Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/grp_offline.bmp', function( data ){
			elems.css('backgroundImage', 'url('+ data +')');
		});

		this.ui.find('.content .listoption button').each(function(){
			var _elem 	= jQuery(this);
			var id 		= _elem.data('id');

			if(optList.includes(id)){
				Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/grp_online.bmp', function( data ){
					_elem.css('backgroundImage', 'url('+ data +')');
				});
				jQuery(this).addClass('on');
			}
		});
		
		var listBtn = jQuery('.listoption button');
		var cSearch = optList.length == listBtn.length ? 'on' : 'off';

		Client.loadFile(DB.INTERFACE_PATH + 'basic_interface/rodexsystem/renewal/checkbox_search_'+cSearch+'.bmp', function( data ){
			var _elem = jQuery('.footer-opt button.select_all');
			_elem.removeClass('active');
			if(cSearch === 'on'){
				_elem.addClass('active');
			}
			_elem.css('backgroundImage', 'url('+ data +')');
		});
	}

	ChatRoomTabSetting.tabName = function tabName(tabName){
		if(this.ui.is(':visible')){
			this.ui.find('.tabname').html(tabName);
		}
	}


	/**
	 * Extend inventory window size
	 */
	function resize( width, height )
	{
		width  = Math.min( Math.max(width,  7), 14);
		height = Math.min( Math.max(height, 3), 8);

		ChatRoomTabSetting.ui.css('width', 23 + 16 + 16 + width  * 32);
		ChatRoomTabSetting.ui.find('.resize').css('height', height * 32);
	}


	/**
	 * Create component and export it
	 */
	return UIManager.addComponent(ChatRoomTabSetting);
});
