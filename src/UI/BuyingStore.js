// UI/BuyingStore.js
define(function(require) {
	'use strict';

	var BuyingStore = {};

	/**
	 * ลบไอเท็มออกจาก UI ร้านรับซื้อ (placeholder)
	 * @param {number} index - ตำแหน่งไอเท็มในร้าน
	 * @param {number} count - จำนวนไอเท็ม
	 * @param {number} zeny - จำนวนเงินที่ใช้
	 */
	BuyingStore.removeItem = function(index, count, zeny) {
		console.log(`[BuyingStore] Removed item at index=${index}, count=${count}, zeny=${zeny}`);

		// ตัวอย่าง: หากมี DOM รายการไอเท็ม ให้ลบออก เช่น
		var itemList = document.querySelectorAll('.buying-store-item');
		var target = itemList[index];

		if (target) {
			target.remove();
		} else {
			console.warn(`[BuyingStore] ไม่พบไอเท็ม index ${index} ใน DOM`);
		}
	};

	return BuyingStore;
});
