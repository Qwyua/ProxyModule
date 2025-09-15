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

    if (!window.denemeASD) {
        window.denemeASD = {};
    }

    denemeASD.GMsetValue = function(a,d) {
        return GM_setValue(a,d);
    };
    
    denemeASD.GMgetValue = function(anahtar, varsayilanDeger = null) {
        return GM_getValue(anahtar, varsayilanDeger);
    };
    
    denemeASD.GMdeleteValue = function(anahtar) {
        return GM_deleteValue(anahtar);
    };
    
    denemeASD.GMlistValues = function() {
        return GM_listValues();
    };
    
    console.log("asd");
