// thisBook.js

"use strict";

const MBTB = {
    doc: document,
    thisBook: document.getElementById("thisBook"),
    deleteBook: document.getElementById("deleteBook"),
    demo: document.getElementById("demo"),
    confirmDelete: null
};

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