// addEdit.js

"use strict";

const MBAG = {
    doc: document,
    bookMessage: document.getElementById("bookMessage"),
    bookForm: document.getElementById("bookForm"),
    isbnInput: document.getElementById("isbnInput"),
    fetchButton: document.getElementById("fetchButton"),
    titleInput: document.getElementById("titleInput"),
    lastNameInput: document.getElementById("lastNameInput"),
    firstNameInput: document.getElementById("firstNameInput"),
    classInput: document.getElementById("classInput"),
    ratingInput: document.getElementById("ratingInput"),
    pubInput: document.getElementById("pubInput"),
    myEdInput: document.getElementById("myEdInput"),
    addEditButton: document.getElementById("addEditButton"),
    emptyFields: null,
    bindFetchGet: null,
    bindAddEditPost: null,
    formData: {}
};

MBAG.emptyFields = function () {
    MBAG.titleInput.value = "";
    MBAG.lastNameInput.value = "";
    MBAG.firstNameInput.value = "";
    MBAG.classInput.value = "";
    MBAG.ratingInput.value = "";
    MBAG.pubInput.value = "";
    MBAG.myEdInput.value = "";
}

MBAG.bindFetchGet = function () {
    MBAG.fetchButton.addEventListener('click', function (event) {
        var request, isbn, reqUrl, response;
        request = new XMLHttpRequest();

        isbn = MBAG.isbnInput.value;
        isbn = isbn.trim().toUpperCase();
        isbn = isbn.replace(/[^0-9,X]/g, "");
        if (isbn.length < 10) {
            while (isbn.length < 10) {
                isbn = "0" + isbn;
            }
        }
        if (isbn.length !== 10 && isbn.length !== 13) {
            MBAG.bookMessage.innerHTML = "<p>An ISBN should have 10 or 13 digits.  Please try again.</p>"
            MBAG.emptyFields();
        } else {
            reqUrl = "isbnResults?isbn=" + isbn;
            request.open('GET', reqUrl, true);
            request.send();
        }
        MBAG.isbnInput.value = isbn;
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status <400) {
                response = JSON.parse(request.responseText);
                if (response.book === "Book not listed.") {
                    MBAG.bookMessage.innerHTML = "<p>" + response.book + "</p>";
                    MBAG.emptyFields();
                } else {
                    MBAG.bookMessage.innerHTML = "<p>Results found.</p>";
                    MBAG.isbnInput.value = response.book.isbn;
                    MBAG.titleInput.value = response.book.title;
                    MBAG.lastNameInput.value = response.author.last_name;
                    MBAG.firstNameInput.value = response.author.first_name;
                    MBAG.classInput.value = response.book.class_id;
                    MBAG.ratingInput.value = response.book.book_rate_id;
                    MBAG.pubInput.value = response.book.orig_pub_date;
                    MBAG.myEdInput.value = response.book.curr_ed_date;
                }
            } else {
                console.log("Error in network request: " + request.statusText);
                MBAG.bookMessage.innerHTML = "<p>Error: " + request.error + "</p>";          }
        });
        event.preventDefault();
    });
};

MBAG.doc.addEventListener('DOMContentLoaded', MBAG.bindFetchGet);

MBAG.bindAddEditPost = function () {
    MBAG.addEditButton.addEventListener('click', function (event) {
        var request;
        event.preventDefault();

        MBAG.formData.book = {};
        MBAG.formData.author = {};
        MBAG.formData.book.isbn = MBAG.isbnInput.value;
        MBAG.formData.book.title = MBAG.titleInput.value;
        MBAG.formData.author.last_name = MBAG.lastNameInput.value;
        MBAG.formData.author.first_name = MBAG.firstNameInput.value;
        MBAG.formData.book.class_id = MBAG.classInput.value;
        MBAG.formData.book.book_rate_id = MBAG.ratingInput.value;
        MBAG.formData.book.orig_pub_date = MBAG.pubInput.value;
        MBAG.formData.book.curr_ed_date = MBAG.myEdInput.value;

        request = new XMLHttpRequest();
        request.open('POST', 'addEditBook', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                MBAG.bookMessage.innerHTML = "<p>" + request.responseText + "</p>";
                MBAG.emptyFields();
            } else {
                console.log("Error in network request: " + request.statusText);
                MBAG.bookMessage.innerHTML = "Error in network request: " + request.statusText;
            }
        });
        request.send(JSON.stringify(MBAG.formData));
    });
};

MBAG.doc.addEventListener('DOMContentLoaded', MBAG.bindAddEditPost);
