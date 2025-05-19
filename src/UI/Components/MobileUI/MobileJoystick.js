// MobileJoystick ใหม่ ปรับให้แสดงอนาล็อคเฉพาะเมื่อแตะบริเวณครึ่งล่างของฝั่งซ้ายหน้าจอ และแสดงตรงจุดที่แตะทันที

define(function(require) {
    'use strict';

    var Network = require('Network/NetworkManager');
    var PACKET = require('Network/PacketStructure');
    var Session = require('Engine/SessionStorage');
    var PACKETVER = require('Network/PacketVerManager');
    var EntityManager = require('Renderer/EntityManager');

    var MobileJoystick = {};

    MobileJoystick.init = function() {
        if (!('ontouchstart' in window)) return;

        let joystick = null;
        let knob = null;
        let originX = 0, originY = 0;
        let dirX = 0, dirY = 0;
        let movementTimer = null;
        let isTouching = false;
        let lastDirX = 0, lastDirY = 0;
        let lastMoveTime = 0;

        function createJoystick(x, y) {
            originX = x;
            originY = y;

            joystick = document.createElement('div');
            joystick.style.position = 'absolute';
            joystick.style.left = `${Math.max(10, x - 150)}px`;
            joystick.style.top = `${y - 60}px`;
            joystick.style.width = '120px';
            joystick.style.height = '120px';
            joystick.style.borderRadius = '50%';
            joystick.style.backgroundColor = 'rgba(0, 0, 0, 0.35)'
            joystick.style.zIndex = '9999';
            joystick.style.display = 'flex';
            joystick.style.alignItems = 'center';
            joystick.style.justifyContent = 'center';
            joystick.style.touchAction = 'none';
            joystick.style.pointerEvents = 'auto';

            knob = document.createElement('div');
            knob.style.position = 'relative';
            knob.style.width = '40px';
            knob.style.height = '40px';
            knob.style.borderRadius = '50%';
            knob.style.backgroundColor = 'rgba(255,255,255,0.5)';
            knob.style.transform = 'translate(0px, 0px)';

            joystick.appendChild(knob);
            document.body.appendChild(joystick);
        }

 function isTouchingEntity(x, y) {
    return false;
}

        function sendMovePacket(dx, dy) {
            if (!Session.Playing || !Session.Entity) return;
            const player = Session.Entity;
            const startX = player.position[0] | 0;
            const startY = player.position[1] | 0;

            if (isTouchingEntity(startX, startY)) return;

            let destX = startX + dx * 5;
            let destY = startY + dy * 5;

            const pkt = PACKETVER.value >= 20180307
                ? new PACKET.CZ.REQUEST_MOVE2()
                : new PACKET.CZ.REQUEST_MOVE();
            pkt.dest[0] = destX;
            pkt.dest[1] = destY;
            Network.sendPacket(pkt);
        }

        function startMovement() {
            if (movementTimer) return;
            movementTimer = setInterval(() => {
                if (isTouching && (dirX !== 0 || dirY !== 0)) {
                    const now = Date.now();
                    const changedDir = dirX !== lastDirX || dirY !== lastDirY;
                    const delay = changedDir ? 0 : 450;
                    if (now - lastMoveTime >= delay) {
                        sendMovePacket(dirX, dirY);
                        lastMoveTime = now;
                        lastDirX = dirX;
                        lastDirY = dirY;
                    }
                }
            }, 16);
        }

        function stopMovement() {
            if (movementTimer) {
                clearInterval(movementTimer);
                movementTimer = null;
            }
        }

        document.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;

            // เงื่อนไขใหม่: ครึ่งล่างของฝั่งซ้าย
           if (touchX > window.innerWidth * 0.35 || touchY < window.innerHeight * 0.5) return;

            e.preventDefault();
            e.stopPropagation();

            if (joystick) joystick.remove();
            createJoystick(touchX, touchY);

            isTouching = true;
            lastMoveTime = 0;
            lastDirX = 0;
            lastDirY = 0;
            startMovement();
        }, { passive: false });

        document.addEventListener('touchmove', function(e) {
            if (!joystick) return;
            e.preventDefault();
            e.stopPropagation();

            const touch = e.touches[0];
            const dx = touch.clientX - originX;
            const dy = touch.clientY - originY;

            const maxDist = 40;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let ratio = dist > maxDist ? maxDist / dist : 1;
            const moveX = dx * ratio;
            const moveY = dy * ratio;

            knob.style.transform = `translate(${moveX}px, ${moveY}px)`;

            dirX = Math.abs(dx) > 10 ? Math.sign(dx) : 0;
            dirY = Math.abs(dy) > 10 ? -Math.sign(dy) : 0;
        }, { passive: false });

        document.addEventListener('touchend', function(e) {
            dirX = 0;
            dirY = 0;
            isTouching = false;
            stopMovement();
            if (joystick) {
                joystick.remove();
                joystick = null;
            }
        });
    };

    return MobileJoystick;
});