const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

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
        return events.map(event => eventShaper(event));
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return eventShaper(event);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

const eventShaper = event => ({
    ...event._doc,
    creator: user.bind(this, event.creator),
    date: dateToString(event._doc.date),
})


const bookingShaper = booking => ({
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
})

exports.eventShaper = eventShaper;
exports.bookingShaper = bookingShaper;

// exports.user = user;
// exports.event = events;
// exports.singleEvent = singleEvent;