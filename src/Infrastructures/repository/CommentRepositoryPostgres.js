const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const stmt = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, createdAt],
    };

    const result = await this._pool.query(stmt);

    return new AddedComment(result.rows[0]);
  }

  async deleteCommentById(id) {
    const deletedAt = new Date().toISOString();

    const stmt = {
      text: 'UPDATE comments SET deleted_at = $1 WHERE id = $2',
      values: [deletedAt, id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Komentar tidak ditemukan.');
    }
  }

  async verifyCommentOwner(id, owner) {
    const stmt = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Komentar tidak ditemukan.');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses ke resource ini.');
    }
  }

  async verifyCommentAvailability(id) {
    const stmt = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Komentar tidak ditemukan.');
    }
  }

  async getCommentsByThreadId(threadId) {
    const stmt = {
      text: 'SELECT * FROM comments WHERE thread_id = $1 ORDER BY created_at ASC',
      values: [threadId],
    };

    const result = await this._pool.query(stmt);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
