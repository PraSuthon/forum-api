class ThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.createdAt = payload.created_at;
    this.content = payload.content;
  }

  _verifyPayload({
    id, username, created_at: createdAt, content,
  }) {
    if (!id || !username || !createdAt || !content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof createdAt !== 'string'
      || typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadComment;
