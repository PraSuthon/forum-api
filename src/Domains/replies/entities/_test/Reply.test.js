const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-1',
      content: 'sebuah reply',
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      content: 123,
      username: 'dylanm',
      created_at: 'date',
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply entities correctly', () => {
    const payload = {
      id: 'reply-1',
      content: 'sebuah reply',
      username: 'dylanm',
      created_at: 'date',
    };

    const reply = new Reply(payload);

    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.created_at);
  });

  it('should create Reply entities correctly with non null deleted_at', () => {
    const payload = {
      id: 'reply-1',
      content: 'sebuah reply',
      username: 'dylanm',
      created_at: 'date',
      deleted_at: new Date().toISOString(),
    };

    const reply = new Reply(payload);

    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.created_at);
  });
});
