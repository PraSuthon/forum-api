const ThreadComment = require('../ThreadComment');

describe('ThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1',
    };

    expect(() => new ThreadComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      username: 123,
      created_at: true,
      content: 456,
    };

    expect(() => new ThreadComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadComment entities correctly', () => {
    const payload = {
      id: 'comment-1',
      username: 'username',
      created_at: 'created_at',
      content: 'a comment',
    };

    const threadComment = new ThreadComment(payload);

    expect(threadComment).toBeInstanceOf(ThreadComment);
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.createdAt).toEqual(payload.created_at);
    expect(threadComment.content).toEqual(payload.content);
  });
});
