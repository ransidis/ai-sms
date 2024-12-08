const newsModel = require('../models/model.news');

// Controller for adding a new news entry
async function addNewsController(req, res) {
    const { title, content, category, user_id, urgent_expire } = req.body;

    // Basic validation
    if (!title || !content || !category || !user_id) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required!'
        });
    }

    const today = new Date();
    const date = today.toISOString().split('T')[0];

    try {
        const newsData = { title, content, date, category, user_id, urgent_expire };
        await newsModel.createNews(newsData);

        return res.status(201).json({
            success: true,
            message: 'News added successfully!'
        });
    } catch (error) {
        console.error('Error adding news:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller to get all news entries
async function getAllNewsController(req, res) {
    try {
        const news = await newsModel.getAllNews();
        return res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error('Error fetching all news:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller to get a specific news entry by ID
async function getNewsByIdController(req, res) {
    const newsId = req.params.id;

    try {
        const news = await newsModel.getNewsById(newsId);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller to update a news entry
async function updateNewsController(req, res) {
    const newsId = req.params.id;
    const { title, content, category, urgent_expire } = req.body;

    if (!title || !content || !category) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required!'
        });
    }

    try {
        await newsModel.updateNews(newsId, { title, content, category, urgent_expire });

        return res.status(200).json({
            success: true,
            message: 'News updated successfully'
        });
    } catch (error) {
        console.error('Error updating news:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller to delete a news entry
async function deleteNewsController(req, res) {
    const newsId = req.params.id;

    try {
        await newsModel.deleteNews(newsId);
        return res.status(200).json({
            success: true,
            message: 'News deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting news:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    addNewsController,
    getAllNewsController,
    getNewsByIdController,
    updateNewsController,
    deleteNewsController
};
