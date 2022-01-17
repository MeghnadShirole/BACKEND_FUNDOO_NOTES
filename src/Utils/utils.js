import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const validUser = (result) => {
    User.findOne({
        "email": result.email
    }, (err, result) => {
        if (err) {
            return err;
        } else if (result != null) {
            const validPassword = bcrypt.compareSync(result.password, result.password);
            if (validPassword == true) {
                return result;
            } else {
                return ("Incorrect Password")
            }
        } else {
            return ("Invalid User")
        }
    })
}

export const hashPassword = (userData) => {
    let saltRounds = 10;
    const hashPassword = bcrypt.hashSync(userData.password, saltRounds);
    return hashPassword;
}

export const generateToken = (result) => {
    const token = jwt.sign({ "email": result.email, "_id": result._id }, process.env.SECRET_KEY)
    return token;
}

export const forgetPasswordToken = (result) => {
    const token = jwt.sign({ "_id": result._id }, process.env.FORGET_PASSWORD_KEY);
    return token;
}