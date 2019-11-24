const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');


const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
            return {
                ...event._doc,
                creator: user.bind(this, event.creator),
                date: new Date(event._doc.date).toISOString(),
            }
        })
    } catch (err) {
        throw err
    }
}

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator)
                    };
                })
            })
            .catch(err => {
                console.error(err);
                throw err;
            })
    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5dda78a7bdc0af69096738b1'
        });
        let createdEvent;
        return event
            .save()
            .then(result => {
                createdEvent = {
                    ...result._doc,
                    creator: user.bind(this, result._doc.creator),
                    date: new Date(event._doc.date).toISOString(),
                }
                return User.findById('5dda78a7bdc0af69096738b1');
            })
            .then(user => {
                if (!user) {
                    throw new Error('L\'utilisateur n\'existe pas !!!')
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                console.log(createdEvent);
                return createdEvent;
            })
            .catch(err => {
                console.error(err);
                throw err;
            });
    },
    createUser: args => {
        return User.findOne({
            email: args.userInput.email
        })
        .then(user => {
            if (user) {
                throw new Error('L\'utilisateur existe déjà. Utilisez une autre adresse mail')
            }
            return bcrypt
                .hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                email: args.userInput.email,
                name: args.userInput.name,
                password: hashedPassword,
            }); 
            return user.save();
        })
        .then(result => {
            return {...result._doc, password: null}
        })
        .catch(err => {
            console.error(err)
            throw err;
        })
    }
}