const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPass = await bcryptPasswordHash.hash('password');

      expect(typeof encryptedPass).toEqual('string');
      expect(encryptedPass).not.toEqual('password');
      expect(spyHash).toBeCalledWith('password', 10);
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(
        bcryptPasswordHash.comparePassword('password', 'encrypted'),
      ).rejects.toThrowError(AuthenticationError);
    });

    it('should not return AuthenticationError if password match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const pass = 'rahasia';
      const encryptedPass = await bcryptPasswordHash.hash(pass);

      await expect(
        bcryptPasswordHash.comparePassword(pass, encryptedPass),
      ).resolves.not.toThrowError(AuthenticationError);
    });
  });
});
