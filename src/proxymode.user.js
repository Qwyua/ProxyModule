// ==UserScript==
// @name         deneme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  asd
// @author       asd
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

class DenemeASD {
    constructor() {
        if (!window.denemeASD) {
            window.denemeASD = this;
        }
        console.log("asd");
        return window.denemeASD;
    }

    asd(key, value) {
        return GM_setValue(key, value);
    }

    asdw(key, defaultValue = null) {
        return GM_getValue(key, defaultValue);
    }

    asdwe(key) {
        return GM_deleteValue(key);
    }

    asdweq() {
        return GM_listValues();
    }

}

new DenemeASD();
//DenemeASD.init();

