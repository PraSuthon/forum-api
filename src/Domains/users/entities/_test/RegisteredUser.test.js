const RegisteredUser = require('../RegisteredUser');

describe('A RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dylanm',
      fullname: 'Dylan Mardi',
    };

    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'dylanm',
      fullname: 'Dylan Mardi',
    };

    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeredUser object correctly', () => {
    const payload = {
      id: 'user-1',
      username: 'dylanm',
      fullname: 'Dylan Mardi',
    };

    const { id, username, fullname } = new RegisteredUser(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
  });
});
