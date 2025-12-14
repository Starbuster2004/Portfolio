const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const projects = await Project.find(query).sort({ date: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createProject = async (req, res) => {
    try {
        const { title, description, technologies, link, category } = req.body;
        let image = '';
        if (req.file) {
            image = req.file.path;
        }
        const newProject = new Project({
            title,
            description,
            technologies,
            link,
            image,
            category,
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
