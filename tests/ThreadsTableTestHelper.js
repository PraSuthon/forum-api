/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({ id = 'thread-1', title = 'thread title', body = 'thread body', owner = 'user-1', createdAt = new Date().toISOString() }) {
    const stmt = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, body, owner, createdAt],
    };

    const result = await pool.query(stmt);
    return result.rows[0].id;
  },
  async findThreadById(id) {
    const stmt = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(stmt);
    return result.rows;
  },
  async cleanTable() {
    const stmt = 'TRUNCATE threads';
    await pool.query(stmt);
  },
};

module.exports = ThreadsTableTestHelper;
