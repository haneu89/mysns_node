const crypto = require('crypto');

let original = "admin1234";
let salt = "mysalt01234";

let result = crypto.pbkdf2Sync(original, salt, 50, 255, 'sha512')

console.log(result.toString('base64'));