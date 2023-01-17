const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'a comment',
      threadId: 'thread-1',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: true,
      owner: 'user-1',
      threadId: 123,
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    const payload = {
      content: 'a comment',
      owner: 'user-1',
      threadId: 'thread-1',
    };

    const newComment = new NewComment(payload);

    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
    expect(newComment.threadId).toEqual(payload.threadId);
  });
});
