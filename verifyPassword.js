import bcrypt from 'bcryptjs';  // use 'bcrypt' if that's what you installed

const inputPassword = '123123';
const storedHash = '$2a$10$NkbX4dIEf1aGZytANc24sOEtVrbQlteWwzjoIcG3Mm6aC2jlf2NMS';

bcrypt.compare(inputPassword, storedHash)
  .then(result => {
    // Password match result
  })
  .catch(err => {/* handle error */});
