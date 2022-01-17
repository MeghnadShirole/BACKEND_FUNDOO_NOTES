import jwt from 'jsonwebtoken';

// User Authentication for note crud
export const userAuth = (req, res, next) => {
    const token1 = req.headers['token'];
    if (token1) {
        /**
         * @description:verifies secret and checks expression
         **/
        jwt.verify(token1, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    message: 'Unauthorised access, please provide valid token!'
                });
            } else {
                req.userData = decode;
                req.body['userId'] = decode._id;
                next();
            }
        });
    } else {
        /**
         * @description:if there is no token return an error
         **/
        return res.send({
            status: false,
            message: 'No token provided!!'
        });
    }
}

//User Authentication for reset password
export const resetPasswordAuth = (req, res, next) => {
    const requestToken = req.params['token'];
    if (requestToken) {
        /**
         * @description:verifies secret and checks expression
         **/
        jwt.verify(requestToken, process.env.FORGET_PASSWORD_KEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    message: 'Unauthorised access, please provide valid token!'
                });
            } else {
                req.userData = decode;
                req.params['userId'] = decode._id;
                next();
            }
        });
    } else {
        /**
         * @description:if there is no token return an error
         **/
        return res.send({
            status: false,
            message: 'No token provided!!'
        });
    }
}