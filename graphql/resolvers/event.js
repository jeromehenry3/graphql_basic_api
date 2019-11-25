const Event = require('../../models/event');
const { eventShaper } = require('./merge');
const { dateToString } = require('../../helpers/date');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return eventShaper(event);
            })
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5dda9900b479d7274b7c6f66'
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = eventShaper(result)
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
}