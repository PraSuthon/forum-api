const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1',
      content: 'a comment',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      content: 123,
      owner: 'user-1',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply entities correctly', () => {
    const payload = {
      id: 'comment-1',
      content: 'a comment',
      owner: 'user-1',
    };

    const addedThread = new AddedReply(payload);

    expect(addedThread).toBeInstanceOf(AddedReply);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.content).toEqual(payload.content);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
