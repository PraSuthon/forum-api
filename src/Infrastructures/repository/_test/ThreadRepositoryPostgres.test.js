const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-1',
      });

      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-1');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-1',
      });

      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-1',
          title: newThread.title,
          owner: newThread.owner,
        }),
      );
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-1')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({
        id: 'user-999',
        username: 'threadowner',
      });

      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-999',
        createdAt: 'createdAt',
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-1',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-999',
        created_at: 'createdAt',
      });
    });
  });

  describe('verifyThreadAvailability', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-1'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadId is exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-1',
      });

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability(threadId),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
