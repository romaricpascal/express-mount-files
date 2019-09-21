// Pull the list of HTTP methods from NodeJS
// similarly to what express does
module.exports = require('http').METHODS.map(m => m.toLowerCase());
