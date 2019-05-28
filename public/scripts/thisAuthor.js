// thisAuthor.js

"use strict";

const MBTA = {
    doc: document,
    thisAuthor: document.getElementById("thisAuthor"),
    editAuthor: document.getElementById("editAuthor"),
    demo: document.getElementById("demo"),
    authorModal: document.getElementById("authorModal"),
    editAuthorForm: document.getElementById("editAuthorForm"),
    ex: document.getElementsByClassName("close")[0],
    lNameInput: document.getElementById("lNameInput"),
    fNameInput: document.getElementById("fNameInput"),
    mNameInput: document.getElementById("mNameInput"),
    DoBInput: document.getElementById("DoBInput"),
    DPInput: document.getElementById("DPInput"),
    editButton: document.getElementById("editButton"),
    dismissButton: document.getElementById("dismissButton"),
    saveAuthorData: null,
    thisAuthorData: {},
    openModal: null,
    closeModal: null,
    setListeners: null,
    setSelectedClass: null,
    confirmDelete: null
};

MBTA.saveAuthorData = function () { // save original values to reset modal when dismissed
    MBTA.thisAuthorData.lName = MBTA.editAuthorForm.lName.value;
    MBTA.thisAuthorData.fName = MBTA.editAuthorForm.fName.value;
    MBTA.thisAuthorData.mName = MBTA.editAuthorForm.mName.value;
    MBTA.thisAuthorData.DoB = MBTA.editAuthorForm.dateBorn.value;
    MBTA.thisAuthorData.DP = MBTA.editAuthorForm.datePassed.value;
};

MBTA.doc.addEventListener('DOMContentLoaded', MBTA.saveAuthorData);

MBTA.openModal = function () {
    MBTA.authorModal.style.display = "block";
};

MBTA.closeModal = function () {  // close modal and reset values
    MBTA.authorModal.style.display = "none";
    MBTA.editAuthorForm.lName.value = MBTA.thisAuthorData.lName;
    MBTA.editAuthorForm.fName.value = MBTA.thisAuthorData.fName;
    MBTA.editAuthorForm.mName.value = MBTA.thisAuthorData.mName;
    MBTA.editAuthorForm.dateBorn.value = MBTA.thisAuthorData.DoB;
    MBTA.editAuthorForm.datePassed.value = MBTA.thisAuthorData.DP;
};

MBTA.setSelectedClass = function () {
    var options = MBTA.classInput.children,
        selectedClass = MBTA.classInput.dataset.class_id;
    if (options[selectedClass - 1]) {
        options[selectedClass - 1].setAttribute("selected", true);
        MBTA.thisAuthorData.class = selectedClass;
    }
};

//MBTA.doc.addEventListener('DOMContentLoaded', MBTA.setSelectedClass);

MBTA.getAuthorId = function () {
    MBTA.authorInput.addEventListener('input', function () {
        var authors, lngth, authorId, authorName = MBTA.editAuthorForm.author.value;
        authors = MBTA.authors.children;
        lngth = authors.length;
        for (let i = 0; i < lngth; i += 1) {
            if (authors[i].value === authorName) {
                authorId = authors[i].dataset.author_id;
                break;
            }
        }
        MBTA.editAuthorForm.author_id.value = authorId;
    });
};

//MBTA.doc.addEventListener('DOMContentLoaded', MBTA.getAuthorId);

MBTA.setListeners = function () {
    MBTA.editAuthor.addEventListener('click', function () {
        MBTA.openModal();
    });
    MBTA.ex.addEventListener('click', function () {
        MBTA.closeModal();
    });
    MBTA.dismissButton.addEventListener('click', function () {
        MBTA.closeModal();
    });
    window.addEventListener('click', function (event) {
        if (event.target === MBTA.authorModal) {
            MBTA.closeModal();
        }
    });
};

MBTA.doc.addEventListener('DOMContentLoaded', MBTA.setListeners);