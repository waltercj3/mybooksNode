// myBooksBooks.js

"use strict";

// one contant to rule them all
const MBBG = {
    doc: document,
    classFilter: document.getElementById("classFilter"),
    classFilterForm: document.getElementById("classFilterForm")
};

MBBG.getBooksByClass = function () {
    MBBG.classFilter.addEventListener('change', function () {
        var classId;
        console.log(MBBG.classFilter.value);
        classId = MBBG.classFilter.value;
        if (classId >= 0 && classId <= 4) {
            classFilterForm.submit();
        } else {
            MBBG.filterMess.textContent = "An error occurred. Unable to filter book list.";
        }
    });
};

MBBG.doc.addEventListener('DOMContentLoaded', MBBG.getBooksByClass);