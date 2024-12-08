const db = require('../connection');

// Function to create a new news entry
async function createNews(news) {
    const { title, content, date, category, user_id, urgent_expire } = news;
    const query = `
        INSERT INTO news (title, content, date, category, user_id, urgent_expire)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [title, content, date, category, user_id, urgent_expire]);
}

// Function to get all news entries
async function getAllNews() {
    const query = `
        SELECT * FROM news
        ORDER BY date DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
}

// Function to get a specific news entry by ID
async function getNewsById(newsId) {
    const query = `
        SELECT * FROM news
        WHERE id = ?
    `;
    const [rows] = await db.execute(query, [newsId]);
    return rows[0];
}

// Function to update a news entry
async function updateNews(newsId, newsData) {
    const { title, content, category, urgent_expire } = newsData;
    const query = `
        UPDATE news
        SET title = ?, content = ?, category = ?, urgent_expire = ?
        WHERE id = ?
    `;
    await db.execute(query, [title, content, category, urgent_expire, newsId]);
}

// Function to delete a news entry
async function deleteNews(newsId) {
    const query = `
        DELETE FROM news
        WHERE id = ?
    `;
    await db.execute(query, [newsId]);
}

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews
};
