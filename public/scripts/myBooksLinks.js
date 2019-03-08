// myBooksLinks.js

"use strict";

const MBLG = {
    doc: document,
    style: {},          // style object specific to criteria page
    makeStyle: null     // function create style sheet and add it to page
};

MBLG.style = {
    '*': {
        'box-sizing': 'border-box'
    },
    'div input': {
        'width': '207px'
    },
    '#scrollBox': {
        'height': '567px',
        'width': '33.33%',
        'border': '1px solid black',
        'overflow': 'auto'
    },
    '.required': {
        'float': 'left',
        'width': '33.33%',
        'height': '588px',
        'padding': '7px'
    },
    '.clearfix::after': {
        'content': "",
        'clear': 'both',
        'display': 'table'
    }
};

MBLG.makeStyle = function (styleObject) {
    var sheet, selector, prop, rule, index;
    sheet = MBLG.doc.head.appendChild(MBLG.doc.createElement('style')).sheet;
    for (selector in styleObject) {
        for (prop in styleObject[selector]) {
            rule = selector + " { " + prop + " : " + styleObject[selector][prop] + " }";
            index = sheet.cssRules.length;
            sheet.insertRule(rule, index);
        }
    }
};

MBLG.doc.addEventListener('DOMContentLoaded', function () {
    MBLG.makeStyle(MBLG.style);
});