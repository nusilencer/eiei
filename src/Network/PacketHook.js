
/**
 * Network/PacketHook.js
 *
 * Allows hooking into received packets to add custom behavior.
 */

define(function(require) {
    'use strict';

    var PACKET = require('Network/PacketStructure');
    var PacketHook = {};

    /**
     * Stores all hooks: { [packetName]: [callback1, callback2, ...] }
     */
    var _hooks = {};

    /**
     * Hook into a packet.
     * @param {string} packetName - Name of the packet (e.g., Packet.ZC.ACK_TRADE_BUYING_STORE)
     * @param {function} callback - Function to call when the packet is received
     */
    PacketHook.hookPacket = function(packetName, callback) {
        if (!packetName || typeof callback !== 'function') {
            console.warn('[PacketHook] Invalid packet or callback');
            return;
        }

        if (!_hooks[packetName]) {
            _hooks[packetName] = [];
        }

        _hooks[packetName].push(callback);
    };

    /**
     * Internal method to dispatch packet to all registered hooks.
     * Called from NetworkManager when a packet is received.
     * @param {string} packetName
     * @param {object} packetData
     */
    PacketHook.dispatch = function(packetName, packetData) {
        var list = _hooks[packetName];
        if (!list) return;

        for (var i = 0; i < list.length; ++i) {
            try {
                list[i](packetData);
            } catch (e) {
                console.error('[PacketHook] Error in hook for', packetName, e);
            }
        }
    };

    return PacketHook;
});
