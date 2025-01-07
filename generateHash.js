import bcrypt from 'bcryptjs';

const password = 'test123'; // ваш пароль
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Password hash:', hash);