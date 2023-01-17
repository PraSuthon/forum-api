/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id = 'comment-1', content = 'a comment', owner = 'user-1', threadId = 'thread-1', createdAt = new Date().toISOString() }) {
    const stmt = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, threadId, createdAt],
    };

    await pool.query(stmt);
  },
  async findCommentById(id) {
    const stmt = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(stmt);
    return result.rows;
  },
  async cleanTable() {
    const stmt = 'TRUNCATE comments';
    await pool.query(stmt);
  },
};

module.exports = CommentsTableTestHelper;
