/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({ id = 'reply-1', content = 'sebuah reply', owner = 'user-1', comentId = 'comment-1', createdAt = new Date().toISOString() }) {
    const stmt = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, comentId, createdAt],
    };

    await pool.query(stmt);
  },
  async findReplyById(id) {
    const stmt = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(stmt);
    return result.rows;
  },
  async cleanTable() {
    const stmt = 'TRUNCATE replies';
    await pool.query(stmt);
  },
};

module.exports = RepliesTableTestHelper;
