const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({
            name,
            email,
            message,
        });
        const contact = await newContact.save();
        res.json({ msg: 'Message sent successfully', contact });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
