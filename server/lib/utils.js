import jwt from 'jsonwebtoken';


export const generateToken = (user) => {

    const token=jwt.sign(
        {
            _id:user._id,
            email:user.email,
            fullname:user.fullname
        },
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    );

    return token;

}