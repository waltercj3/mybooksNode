// myBooksHome.js

// The animation code here was inspired by the code found here: https://www.the-art-of-web.com/css/fading-slideshow-no-jquery/

'use strict';

const MBHG = {
    doc: document,
    style: {},
    makeStyle: null,
    sheet: null
};

MBHG.style = {
    '#picFrame': {
        'margin': 'auto',
        'width': '428px',
        'height': '874px'
    },
    '#picFrame img': {
        'position': 'absolute',
        'border': '14px solid white',
        'border-bottom': '160px solid white'
    },
    '#picFrame img:nth-of-type(1)': {
        'animation-name': 'remover',
        'animation-delay': '3s',
        'animation-duration': '1s',
        'z-index': '14'
    },
    '#picFrame img:nth-of-type(2)': {
        'z-index': '7'
    },
    '#picFrame img:nth-of-type(n+3)': {
        'display': 'none'
    }
};

MBHG.makeStyle = function (styleObject) {
    var sheet, selector, prop, rule, index;
    MBHG.sheet = MBHG.doc.head.appendChild(MBHG.doc.createElement('style')).sheet;
    for (selector in styleObject) {
        for (prop in styleObject[selector]) {
            rule = selector + " { " + prop + " : " + styleObject[selector][prop] + " }";
            index = MBHG.sheet.cssRules.length;
            MBHG.sheet.insertRule(rule, index);
        }
    }
};

MBHG.doc.addEventListener('DOMContentLoaded', function () {
    var index, rule = '@keyframes remover {from {opacity: 1.0;} to {opacity: 0.0;}}';
    MBHG.makeStyle(MBHG.style);
    index = MBHG.sheet.cssRules.length;
    MBHG.sheet.insertRule(rule, index);
});

MBHG.doc.addEventListener('DOMContentLoaded', function () {
    var i, arrLength, picFrame, imageArray = [], removeDone = null;
    picFrame = MBHG.doc.getElementById('picFrame');
    imageArray = MBHG.doc.getElementsByClassName('pics');
    removeDone = function () {
        picFrame.appendChild(imageArray[0]);
    };
    arrLength = imageArray.length;
    for(i = 0; i < arrLength; i += 1) {
        imageArray[i].addEventListener('animationend', removeDone);
    }
});