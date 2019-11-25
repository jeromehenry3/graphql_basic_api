const bcrypt = require('bcryptjs');

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
}