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
    midNameInput: document.getElementById("midNameInput"),
    classInput: document.getElementById("classInput"),
    ratingInput: document.getElementById("ratingInput"),
    pubInput: document.getElementById("pubInput"),
    addEditButton: document.getElementById("addEditButton"),
    emptyFields: null,          // function to remove clear input fields on AddEdit page
    validateIsbn: null,         // function to clean up or reject isbn
    bindFetchGet: null,         // functionality of "check" button
    bindAddEditPost: null,      // functionality of "add/edit" button
    formData: {}                // object of form data
};

MBAG.emptyFields = function () {
    //MBAG.isbnInput.value = "";
    MBAG.titleInput.value = "";
    MBAG.lastNameInput.value = "";
    MBAG.firstNameInput.value = "";
    MBAG.midNameInput.value = "";
    MBAG.classInput.value = "0";
    MBAG.ratingInput.value = "0";
    MBAG.pubInput.value = "";
};

MBAG.validateIsbn = function (isbn) {
    isbn = isbn.trim().toUpperCase();// clean up isbn input
    isbn = isbn.replace(/[^0-9,X]/g, "");// make isbn numbers only
    if (isbn.length < 10) {// older isbn numbers can have less than 10 digits, but 10 needed for lookup
        while (isbn.length < 10) {
            isbn = "0" + isbn;
        }
    }

    if (parseInt(isbn) === 0 || (isbn.length !== 10 && isbn.length !== 13)) {
        return false;
    } else {
        return isbn;
    }
}

MBAG.bindFetchGet = function () {
    MBAG.fetchButton.addEventListener('click', function (event) {
        var request, isbn, reqUrl, response;
        request = new XMLHttpRequest();

        isbn = MBAG.validateIsbn(MBAG.isbnInput.value);
        if (isbn) {
            reqUrl = "isbnResults?isbn=" + isbn;
            request.open('GET', reqUrl, true);
            request.send();
        } else {
            MBAG.bookMessage.innerHTML = "<p>An ISBN should have 10 or 13 digits.  Please try again.</p>";
            MBAG.emptyFields();
        }
        if (isbn) {MBAG.isbnInput.value = isbn;}
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status <400) {
                response = JSON.parse(request.responseText);
                if (response.book === "Book not listed.") {
                    MBAG.bookMessage.innerHTML = "<p>" + response.book + "</p>";
                    MBAG.emptyFields();
                } else { // fill in form fields
                    MBAG.bookMessage.innerHTML = "<p>Results found.</p>";
                    MBAG.isbnInput.value = response.book.isbn;
                    MBAG.titleInput.value = response.book.book_title;
                    MBAG.lastNameInput.value = response.author.author_last_name;
                    MBAG.firstNameInput.value = response.author.author_first_name;
                    MBAG.midNameInput.value = response.author.author_mid_name;
                    MBAG.classInput.value = response.book.class_id;
                    MBAG.ratingInput.value = response.book.book_rate_id;
                    MBAG.pubInput.value = response.book.orig_pub_date;
                }
            } else {
                console.log("Error in network request: " + request.statusText);
                MBAG.bookMessage.innerHTML = "<p>Error: " + request.error + "</p>";
            }
        });
        event.preventDefault();
    });
};

MBAG.doc.addEventListener('DOMContentLoaded', MBAG.bindFetchGet);

MBAG.bindAddEditPost = function () {
    MBAG.addEditButton.addEventListener('click', function (event) {
        var isbn, request, temp, response, d = new Date(), y = d.getFullYear();
        event.preventDefault();

        MBAG.formData.book = {}; // sub object for book data
        MBAG.formData.author = {}; // sub object for author data

        isbn = MBAG.validateIsbn(MBAG.isbnInput.value);
        if (isbn) {
            MBAG.formData.book.isbn = isbn;
        } else {
            MBAG.bookMessage.innerHTML = "<p>An ISBN should have 10 or 13 digits.  Please try again.</p>";
            return;
        }
        if (MBAG.titleInput.value !== "") {
            MBAG.formData.book.book_title = MBAG.titleInput.value;
        } else {
            MBAG.bookMessage.innerHTML = "<p>A title for the book is required.  Please try again.</p>";
            return;
        }
        if (MBAG.lastNameInput.value !== "") {
            MBAG.formData.author.author_last_name = MBAG.lastNameInput.value;
        } else {
            MBAG.bookMessage.innerHTML = "<p>A last name for the author is required.  Please try again.</p>";
            return;
        }
        if (MBAG.firstNameInput.value !== "") {
            MBAG.formData.author.author_first_name = MBAG.firstNameInput.value;
        } else {
            MBAG.bookMessage.innerHTML = "<p>A first name for the author is required.  Please try again.</p>";
            return;
        }
        MBAG.formData.author.author_mid_name = MBAG.midNameInput.value;
        temp = parseInt(MBAG.classInput.value);
        MBAG.formData.book.class_id = (temp === 0 ? null : temp);
        temp = parseInt(MBAG.ratingInput.value);
        MBAG.formData.book.book_rate_id = (temp === 0 ? null : temp);
        temp = parseInt(MBAG.pubInput.value);
        if (temp >= 1000 && temp <= y) {
            MBAG.formData.book.orig_pub_date = temp;
        } else {
            MBAG.bookMessage.innerHTML = "<p>A valid year of publication is required.  Please try again.</p>";
            return;
        }

        request = new XMLHttpRequest();
        request.open('POST', 'addEditBook', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                response = JSON.parse(request.responseText);

                if (response.added) {
                    MBAG.bookMessage.innerHTML = "<p>" + response.message + "</p>";
                    MBAG.emptyFields();    
                } else {
                    MBAG.bookMessage.innerHTML = "<p>" + response.message + "</p>";
                    MBAG.isbnInput.value = response.book.isbn;
                    MBAG.titleInput.value = response.book.book_title;
                    MBAG.lastNameInput.value = response.author.author_last_name;
                    MBAG.firstNameInput.value = response.author.author_first_name;
                    MBAG.midNameInput.value = response.author.author_mid_name;
                    MBAG.classInput.value = response.book.class_id;
                    MBAG.ratingInput.value = response.book.book_rate_id;
                    MBAG.pubInput.value = response.book.orig_pub_date;
                }
            } else {
                console.log("Error in network request: " + request.statusText);
                MBAG.bookMessage.innerHTML = "Error in network request: " + request.statusText;
            }
        });
        request.send(JSON.stringify(MBAG.formData)); // does the object really need to be stringified?
    });
};

MBAG.doc.addEventListener('DOMContentLoaded', MBAG.bindAddEditPost);
