const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');


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

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            creator: user.bind(this, event.creator)
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            })
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                };
            })

        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5dda9900b479d7274b7c6f66'
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = {
                ...result._doc,
                creator: user.bind(this, result._doc.creator),
                date: new Date(event._doc.date).toISOString(),
            }
            const creator = await User.findById('5dda9900b479d7274b7c6f66');

            if (!creator) {
                throw new Error('L\'utilisateur n\'existe pas !!!')
            }
            creator.createdEvents.push(event);
            await creator.save();

            console.log(createdEvent);
            return createdEvent;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
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
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({
                _id: args.eventId,
            });
            const booking = new Booking({
                event: fetchedEvent,
                user: '5dda9900b479d7274b7c6f66'

            })
            const result = await booking.save();

            console.log(result);
            return {
                ...result._doc,
                _id: result.id,
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString(),
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.user),
            }

        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator),
            
            };
            await Booking.deleteOne({
                _id: args.bookingId,
            })
            return event;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}