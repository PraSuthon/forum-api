const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, owner, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const stmt = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, commentId, createdAt],
    };

    const result = await this._pool.query(stmt);

    return new AddedReply({
      ...result.rows[0],
    });
  }

  async deleteReplyById(id) {
    const deletedAt = new Date().toISOString();

    const stmt = {
      text: 'UPDATE replies SET deleted_at = $1 WHERE id = $2',
      values: [deletedAt, id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Reply tidak ditemukan.');
    }
  }

  async verifyReplyOwner(id, owner) {
    const stmt = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(stmt);

    if (result.rowCount <= 0) {
      throw new NotFoundError('Reply tidak ditemukan.');
    }

    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses ke resource ini.');
    }
  }

  async getRepliesByCommentId(commentId) {
    const stmt = {
      text: 'SELECT * FROM replies WHERE comment_id = $1 ORDER BY created_at ASC',
      values: [commentId],
    };

    const result = await this._pool.query(stmt);

    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
