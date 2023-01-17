class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.created_at;
    this.username = payload.username;
  }

  _verifyPayload({
    id, title, body, created_at: date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string'
      || typeof date !== 'string' || typeof username !== 'string') {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetail;
