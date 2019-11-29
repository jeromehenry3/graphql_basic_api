const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');


module.exports = {
    createUser: async args => {
        try {
        const existingUser = await User.findOne({
            email: args.userInput.email
        })
        if (existingUser) {
            throw new Error('L\'utilisateur existe déjà. Utilisez une autre adresse mail')
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
        const user = new User({
            email: args.userInput.email,
            name: args.userInput.name,
            password: hashedPassword,
        }); 
        const result = await user.save();
        return {...result._doc, password: null}

        } catch (err) {
            console.error(err)
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error('User does not exist');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password incorrect');
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                'unestringlonguepourhasher', 
                {
                    expiresIn: '1h'
                }
            );

            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            }

        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}