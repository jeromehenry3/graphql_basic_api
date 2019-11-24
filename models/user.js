const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            // ref permet de relier des élements
            ref: 'Event',
        }
    ]
});

module.exports = mongoose.model('User', userSchema);