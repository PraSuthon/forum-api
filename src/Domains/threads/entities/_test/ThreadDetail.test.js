const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-1',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-1',
      title: 123,
      body: true,
      username: 'dylanm',
      created_at: 456,
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail entities correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'thread title',
      body: 'thread body',
      username: 'dylanm',
      created_at: 'createdAt',
    };

    const threadDetail = new ThreadDetail(payload);

    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.date).toEqual(payload.created_at);
  });
});
