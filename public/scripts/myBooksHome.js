// myBooksHome.js

// The animation code here was inspired by the code found here: https://www.the-art-of-web.com/css/fading-slideshow-no-jquery/

"use strict";

const MBHG = {
    doc: document,
    createUser: document.getElementById("createUser"),
    uNameInput: document.getElementById("uNameInput"),
    pWordInput: document.getElementById("pWordInput"),
    userModal: document.getElementById("userModal"),
    ex: document.getElementsByClassName("close")[0],
    createUserForm: document.getElementById("createUserForm"),
    createUserButton: document.getElementById("createUserButton"),
    dismissButton: document.getElementById("dismissButton"),
    userPWord: document.getElementById("userPWord"),
    userCPWord: document.getElementById("userCPWord"),
    pWMessage: document.getElementById("pWMessage"),
    style: {},          // style object for CSS specific to home page
    makeStyle: null,    // function to make style object into stylesheet, add to page
    sheet: null,        // stylesheet to which rules are added
    emptyFields: null,  // function to empty the input fields in the Create User form
    openModal: null,
    closeModal: null,
    setListeners: null, // sets listeners for various entities
    checkPW: null,      // function to check match of two password fields
    submitUser: null    // function to submit createUserForm with XMLHttpRequest instead of default
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
        'animation-delay': '3s',        // 3 seconds for each image
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

// adds new style sheet, keyframe not easily placed in style object
MBHG.doc.addEventListener('DOMContentLoaded', function () {
    var index, rule = '@keyframes remover {from {opacity: 1.0;} to {opacity: 0.0;}}';
    MBHG.makeStyle(MBHG.style);
    index = MBHG.sheet.cssRules.length;
    MBHG.sheet.insertRule(rule, index);
});

// moves next image to the top of the pile
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

MBHG.emptyFields = function () {
    MBHG.createUserForm.userLName.value = "";
    MBHG.createUserForm.userFName.value = "";
    MBHG.createUserForm.userEMail.value = "";
    MBHG.createUserForm.userPWord.value = "";
    MBHG.createUserForm.userCPWord.value = "";
    MBHG.pWMessage.innerHTML = "";
};

MBHG.openModal = function () {
    MBHG.userModal.style.display = "block";
};

MBHG.closeModal = function () {
    MBHG.userModal.style.display = "none";
    MBHG.emptyFields();
};

MBHG.setListeners = function () {
    MBHG.createUser.addEventListener('click', function () {
        MBHG.openModal();
    });
    MBHG.ex.addEventListener('click', function () {
        MBHG.closeModal();
    });
    MBHG.dismissButton.addEventListener('click', function () {
        MBHG.closeModal();
    });
    window.addEventListener('click', function (event) {
        if (event.target === MBHG.userModal) {
            MBHG.closeModal();
        }
    });
};

//MBHG.doc.addEventListener('DOMContentLoaded', MBHG.setListeners);

MBHG.checkPW = function () {
    MBHG.userCPWord.addEventListener('keyup', function () {
        if (MBHG.userCPWord.value === MBHG.userPWord.value) {
            MBHG.pWMessage.style.color = 'green';
            MBHG.pWMessage.innerHTML = 'matching';
        } else {
            MBHG.pWMessage.style.color = 'red';
            MBHG.pWMessage.innerHTML = 'not matching';
        }
    });
};

//MBHG.doc.addEventListener('DOMContentLoaded', MBHG.checkPW);

MBHG.doc.addEventListener('DOMContentLoaded', function () {
    if (MBHG.createUser) {
        MBHG.setListeners();
        MBHG.checkPW();
    }
});