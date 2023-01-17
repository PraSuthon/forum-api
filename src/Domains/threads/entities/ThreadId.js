class ThreadId {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
  }

  _verifyPayload({ id }) {
    if (!id) {
      throw new Error('THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string') {
      throw new Error('THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadId;
