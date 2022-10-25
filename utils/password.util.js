// encrypt password

const bcrypt = require("bcrypt");

const encryptPassword = async (password, salt)=>{
    const hashed = await bcrypt.hash(password, salt)
    return hashed;
}
const comparePassword = async(password, hashed)=>{
    const isIdentical = await bcrypt.compare(password, hashed)
    return isIdentical
}
module.exports = {encryptPassword, comparePassword}
