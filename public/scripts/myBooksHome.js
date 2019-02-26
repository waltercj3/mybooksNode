// myBooksHome.js

'use strict';

const MBHG = {
    doc: document,
    makeStyle: null
};

MBHG.makeStyle = function () {
    var sheet, rule, index;
    sheet = MBHG.doc.head.appendChild(MBHG.doc.createElement('style')).sheet;
    index = sheet.cssRules.length;
    rule = "div img {display:block; margin: 21px auto;}";
    sheet.insertRule(rule, index);
};

//MBHG.makeStyle();
document.addEventListener('DOMContentLoaded', MBHG.makeStyle);