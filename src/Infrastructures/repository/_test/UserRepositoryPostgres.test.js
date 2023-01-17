const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dylanm' });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyAvailableUsername('dylanm')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyAvailableUsername('dylanm')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'dylanm',
        password: 'secret_password',
        fullname: 'Dylan Mardi',
      });

      const fakeIdGenerator = () => '1';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUserById('user-1');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dylanm',
        password: 'secret_password',
        fullname: 'Dylan Mardi',
      });

      const fakeIdGenerator = () => '1';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-1',
          username: registerUser.username,
          fullname: registerUser.fullname,
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('dylanm')).rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'dylanm',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('dylanm');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dylanm')).rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dylanm' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dylanm');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });

  describe('getUserUsernameById', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getUserUsernameById('user-1')).rejects.toThrowError(InvariantError);
    });

    it('should return user username correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'dylanm' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userUsername = await userRepositoryPostgres.getUserUsernameById('user-1');

      // Assert
      expect(userUsername).toEqual('dylanm');
    });
  });
});
