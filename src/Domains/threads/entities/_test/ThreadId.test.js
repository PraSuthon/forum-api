const ThreadId = require('../ThreadId');

describe('ThreadId entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new ThreadId(payload)).toThrowError('THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
    };

    expect(() => new ThreadId(payload)).toThrowError('THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadId entities correctly', () => {
    const payload = {
      id: 'thread-1',
    };

    const threadId = new ThreadId(payload);

    expect(threadId).toBeInstanceOf(ThreadId);
    expect(threadId.id).toEqual(payload.id);
  });
});
