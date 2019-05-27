
module.exports = {
    validateIsbn: function (isbn) {
        if (!isbn) {
            return false;
        }
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
};