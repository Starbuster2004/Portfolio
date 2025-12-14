const mongoose = require('mongoose');
const HomeData = require('../src/models/HomeData');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const migrate = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const homeData = await HomeData.findOne();
        if (!homeData) {
            console.log('No HomeData found');
            return;
        }

        console.log('Current skills:', homeData.skills);

        // Check if skills are strings
        if (homeData.skills.length > 0 && typeof homeData.skills[0] === 'string') {
            console.log('Migrating skills from strings to objects...');

            const newSkills = homeData.skills.map(skill => ({
                name: skill,
                icon: `https://placehold.co/100x100?text=${encodeURIComponent(skill)}`
            }));

            homeData.skills = newSkills;

            // We need to bypass validation because we are modifying the document
            // but Mongoose might still validate against the schema.
            // Since we updated the schema in the code, it should be fine.

            await HomeData.updateOne({ _id: homeData._id }, { $set: { skills: newSkills } });
            console.log('Migration successful');
        } else {
            console.log('Skills are already in the correct format or empty');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

migrate();
