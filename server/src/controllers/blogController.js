const Blog = require('../models/Blog');

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, content, summary } = req.body;
        const newBlog = new Blog({
            title,
            content,
            summary,
        });
        const blog = await newBlog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
