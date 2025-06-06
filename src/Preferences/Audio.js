/**
 * Preferences/Audio.js
 *
 * Audio preferences
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define( ['Core/Preferences'], function( Preferences )
{
	'use strict';


	/**
	 * Export
	 */
	return Preferences.get( 'Audio', {

		BGM:   {
			play:   true,
			volume: 0.3
		},

		Sound: {
			play:   true,
			volume: 0.3
		}

	}, 1.0 );

});
