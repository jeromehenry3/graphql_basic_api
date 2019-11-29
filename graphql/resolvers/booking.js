const { bookingShaper, eventShaper } = require('./merge');

const Booking = require('../../models/booking');
const Event = require('../../models/event');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Veuillez vous connecter.')
        }
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return bookingShaper(booking);
            })

        } catch (err) {
            throw err;
        }
    },
   
    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Veuillez vous connecter.')
        }
        try {
            const fetchedEvent = await Event.findOne({
                _id: args.eventId,
            });
            const booking = new Booking({
                event: fetchedEvent,
                user: '5dda9900b479d7274b7c6f66'

            })
            const result = await booking.save();

            return bookingShaper(result);

        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Veuillez vous connecter.')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = eventShaper(booking.event);
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