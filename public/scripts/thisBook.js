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
    editBookForm: document.getElementById("editBookForm"),
    authorInput: document.getElementById("authorInput"),
    authors: document.getElementById("authors"),
    classInput: document.getElementById("classInput"),
    ratingInput: document.getElementById("ratingInput"),
    editButton: document.getElementById("editButton"),
    dismissButton: document.getElementById("dismissButton"),
    saveBookData: null,
    thisBookData: {},
    openModal: null,
    closeModal: null,
    setListeners: null,
    setSelectedClass: null,
    confirmDelete: null
};

MBTB.saveBookData = function () { // save original values to reset modal when dismissed
    MBTB.thisBookData.isbn = MBTB.editBookForm.isbn.value;
    MBTB.thisBookData.title = MBTB.editBookForm.title.value;
    MBTB.thisBookData.author = MBTB.editBookForm.author.value;
    MBTB.thisBookData.author_id = MBTB.editBookForm.author_id.value;
    MBTB.thisBookData.class = MBTB.editBookForm.class.value;
    MBTB.thisBookData.rating = MBTB.editBookForm.rating.value;
    MBTB.thisBookData.orig_pub_date = MBTB.editBookForm.orig_pub_date.value;
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.saveBookData);

MBTB.openModal = function () {
    MBTB.bookModal.style.display = "block";
};

MBTB.closeModal = function () {  // close modal and reset values
    MBTB.bookModal.style.display = "none";
    MBTB.editBookForm.isbn.value = MBTB.thisBookData.isbn;
    MBTB.editBookForm.title.value = MBTB.thisBookData.title;
    MBTB.editBookForm.author.value = MBTB.thisBookData.author;
    MBTB.editBookForm.author_id.value = MBTB.thisBookData.author_id;
    MBTB.editBookForm.class.value = MBTB.thisBookData.class;
    MBTB.editBookForm.rating.value = MBTB.thisBookData.rating;
    MBTB.editBookForm.orig_pub_date.value = MBTB.thisBookData.orig_pub_date;
};

MBTB.setSelectedClass = function () {
    var options = MBTB.classInput.children,
        selectedClass = MBTB.classInput.dataset.class_id;
    if (options[selectedClass - 1]) {
        options[selectedClass - 1].setAttribute("selected", true);
        MBTB.thisBookData.class = selectedClass;
    }
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.setSelectedClass);

MBTB.setSelectedRating = function () {
    var options = MBTB.ratingInput.children,
        selectedRating = MBTB.ratingInput.dataset.rating_id;
    if (options[5 - selectedRating]) {
        options[5 - selectedRating].setAttribute("selected", true);
        MBTB.thisBookData.rating = selectedRating;
    }
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.setSelectedRating);

MBTB.getAuthorId = function () {
    MBTB.authorInput.addEventListener('input', function () {
        var authors, lngth, authorId, authorName = MBTB.editBookForm.author.value;
        authors = MBTB.authors.children;
        lngth = authors.length;
        for (let i = 0; i < lngth; i += 1) {
            if (authors[i].value === authorName) {
                authorId = authors[i].dataset.author_id;
                break;
            }
        }
        MBTB.editBookForm.author_id.value = authorId;
    });
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.getAuthorId);

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
    var request, response, data = {};

    MBTB.deleteBook.addEventListener('click', function (event) {
        // event.preventDefault();

        if (confirm("Delete this book from your list?")) {
            if (MBTB.thisBook.dataset.isbn && MBTB.editBookForm.rdr.value) {
                data.isbn = MBTB.thisBook.dataset.isbn;
                data.rdr = MBTB.editBookForm.rdr.value;
                request = new XMLHttpRequest();
                request.open('POST', 'deleteBR', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.addEventListener('load', function () {
                    if (request.status >= 200 && request.status < 400) {
                        response = JSON.parse(request.responseText);
                        if (response.success) {
                            window.location.href = '/myBooksBooks?rdr=' + data.rdr;
                        } else {
                            console.log("Error in network request: " + response.message);
                            MBTB.demo.textContent = "An error occurred. The book was not deleted.";
                        }
                    } else {
                        console.log("Error in network request: " + request.statusText);
                        MBTB.demo.textContent = "An error occurred. The book was not deleted.";
                    }
                        });
                request.send(JSON.stringify(data));
            } else {
                MBTB.demo.textContent = "Bad data was submitted. The book was not deleted.";
            }
        }
    });
};

MBTB.doc.addEventListener('DOMContentLoaded', MBTB.confirmDelete);