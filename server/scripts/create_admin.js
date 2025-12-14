const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@example.com';
        const password = 'adminpassword123'; // Default password

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists. Updating password...');
            userExists.password = password;
            await userExists.save();
            console.log(`Admin password updated to: ${password}`);
        } else {
            const user = await User.create({
                name: 'Admin',
                email,
                password,
                role: 'admin'
            });
            console.log(`Admin user created with email: ${email} and password: ${password}`);
        }

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createAdmin();
