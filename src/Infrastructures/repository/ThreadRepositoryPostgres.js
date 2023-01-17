const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const stmt = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt],
    };

    const result = await this._pool.query(stmt);

    return new AddedThread({
      ...result.rows[0],
    });
  }

  async getThreadById(id) {
    const stmt = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Thread tidak ditemukan.');
    }

    return result.rows[0];
  }

  async verifyThreadAvailability(id) {
    const stmt = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Thread tidak ditemukan.');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
