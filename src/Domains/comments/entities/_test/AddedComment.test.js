const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1',
      content: 'a comment',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      content: 123,
      owner: 'user-1',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    const payload = {
      id: 'comment-1',
      content: 'a comment',
      owner: 'user-1',
    };

    const addedThread = new AddedComment(payload);

    expect(addedThread).toBeInstanceOf(AddedComment);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.content).toEqual(payload.content);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
