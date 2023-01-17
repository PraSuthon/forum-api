class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = this._mapContent(payload.content, payload.deleted_at);
    this.username = payload.username;
    this.date = payload.created_at;
  }

  _verifyPayload({
    id, content, username, created_at: date,
  }) {
    if (!id || !content || !username || !date) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string'
      || typeof date !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _mapContent(content, deletedAt) {
    return deletedAt ? '**komentar telah dihapus**' : content;
  }
}

module.exports = Comment;
