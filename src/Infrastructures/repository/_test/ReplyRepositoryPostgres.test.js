const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      const newReply = new NewReply({
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
        threadId: 'thread-1',
      });

      const fakeIdGenerator = () => '1';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(newReply);

      const reply = await RepliesTableTestHelper.findReplyById('reply-1');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const newReply = new NewReply({
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
        threadId: 'thread-1',
      });

      const fakeIdGenerator = () => '1';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-1',
          content: newReply.content,
          owner: newReply.owner,
        }),
      );
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when id not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => {});

      await expect(replyRepositoryPostgres.deleteReplyById('reply-1')).rejects.toThrowError(NotFoundError);
    });

    it('should update deleted_at column to deleted datetime', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => {});
      await replyRepositoryPostgres.deleteReplyById('reply-1');

      const deletedComment = await RepliesTableTestHelper.findReplyById('reply-1');
      expect(deletedComment[0].deleted_at).not.toBeNull();
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-1', 'user-1')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner unauthorized', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-1', 'unauthorized-user')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when owner authorized', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-1', 'user-1')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return comments by thread id correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-1',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        content: 'a comment',
        owner: 'user-1',
        threadId: 'thread-1',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
        createdAt: '1',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        content: 'sebuah reply',
        owner: 'user-1',
        commentId: 'comment-1',
        createdAt: '2',
      });

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-1');
      const [reply1, reply2] = replies;

      // Assert
      expect(replies).toHaveLength(2);
      expect(reply1).toStrictEqual({
        id: 'reply-1',
        content: 'sebuah reply',
        owner: 'user-1',
        comment_id: 'comment-1',
        created_at: '1',
        deleted_at: null,
      });
      expect(reply2).toStrictEqual({
        id: 'reply-456',
        content: 'sebuah reply',
        owner: 'user-1',
        comment_id: 'comment-1',
        created_at: '2',
        deleted_at: null,
      });
    });
  });
});
