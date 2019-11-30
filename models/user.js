const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
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