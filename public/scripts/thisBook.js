// thisBook.js

"use strict";

const MBTB = {
    doc: document,
    thisBook: document.getElementById("thisBook"),
    editBook: document.getElementById("editBook"),
    deleteBook: document.getElementById("deleteBook"),
    demo: document.getElementById("demo"),
    bookModal: document.getElementById("bookModal"),
    ex: document.getElementsByClassName("close")[0],
    classInput: document.getElementById("classInput"),
    ratingInput: document.getElementById("ratingInput"),
    editButton: document.getElementById("editButton"),
    dismissButton: document.getElementById("dismissButton"),
    openModal: null,
    closeModal: null,
    setListeners: null,
    setSelectedClass: null,
    confirmDelete: null
};

MBTB.openModal = function () {
    MBTB.bookModal.style.display = "block";
};

MBTB.closeModal = function () {
    MBTB.bookModal.style.display = "none";
};

MBTB.setSelectedClass = function () {
    var options = MBTB.classInput.children,
        selectedClass = MBTB.classInput.dataset.class_id;
    if (options[selectedClass - 1]) {
        options[selectedClass - 1].setAttribute("selected", true);
    }
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.setSelectedClass);

MBTB.setListeners = function () {
    MBTB.editBook.addEventListener('click', function () {
        MBTB.openModal();
    });
    MBTB.ex.addEventListener('click', function () {
        MBTB.closeModal();
    });
    MBTB.dismissButton.addEventListener('click', function () {
        MBTB.closeModal();
    });
    window.addEventListener('click', function (event) {
        if (event.target === MBTB.bookModal) {
            MBTB.closeModal();
        }
    });
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.setListeners);

MBTB.confirmDelete = function () {
    var result = "";
    MBTB.deleteBook.addEventListener('click', function (event) {
        if (confirm("Delete this book from the list of books you have read?")) {
            // delete from Book_Reader, return to ???
            result = "Deleted";
        } else {
            // don't delete, stay on page
            result = "Not Deleted";
        }
        MBTB.demo.innerText = result;
        event.preventDefault();
    });
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.confirmDelete);