'use strict';
let marked= require('marked');
let sanitizeHtml = require('sanitize-html');

let markdown = (md, sanitize) => {
    sanitize = sanitize || true;
    let html = marked(md);
    if (sanitize) {
        html = sanitizeHtml(html, {
            allowedTags: [ 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img' ],
            allowedAttributes: {
                a: [ 'href', 'name', 'target', 'title', 'data-*' ],
                img: [ 'src', 'alt' ]
            },
            selfClosing: [ 'img', 'br', 'hr' ],
            allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'data' ]
        });
    }
    return html;
};

module.exports = markdown;
