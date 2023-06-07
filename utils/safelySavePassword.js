const bcrypt = require("bcrypt");

const saltRounds = 10;

/**
 * OBSOLETE: The hash and salt is already included on the User schema definition on the save hook
 * @param {string} plainPassword The plain password to be stored in the database
 * @returns The plain password hashed and salted ready to store in the database
 */
const safelySavePassword = (plainPassword) =>
  bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
    // Store hash (includes the salt) in your password DB.
  });

// const hashSaltPassword = (plainPassword) => {
//   return plainPassword;
// };

/* 
Storing plaintext passwords in your database is a major security risk. If your database was ever breached, 
the attacker would have direct access to all your users' passwords. To mitigate this risk, you should never 
store passwords in plaintext. Instead, you should store a hashed version of each password.

Hashing is the process of converting an input (like a password) into a fixed-size string of bytes, typically 
a hash code or hash digest. The output is unique to each unique input. Even a small change in the input will 
produce such a drastic change in output that the new hash value won't resemble the old one.

When a user enters their password, you hash the password and compare it to the stored hash. If they match, 
the password is correct. The important detail is that hashing is a one-way operation. You can't derive the 
original password from the hash.

However, hashing is not enough because of something called "rainbow table attacks". An attacker can precompute 
the hashes for common passwords (or even every possible password!) and then just look up the hash to get the 
password.

That's where salting comes in. A salt is a random string that you generate for each user when they create 
their password. You append or prepend this salt to the password, and then hash the result. You store the 
salt and the hash in your database. The salt is typically stored in plaintext, right next to the hash.

Now, even if two users have the same password, they'll have different salts, so their hashes will be different. 
Also, an attacker can't precompute the hash for a specific password, because they would have to do it for every 
possible salt.
*/
