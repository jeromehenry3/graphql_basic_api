const Event = require('../../models/event');
const User = require('../../models/user');
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
    createEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Veuillez vous connecter.')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = eventShaper(result)
            const creator = await User.findById(req.userId);

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