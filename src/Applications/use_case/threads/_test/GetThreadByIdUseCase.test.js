const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const ThreadDetail = require('../../../../Domains/threads/entities/ThreadDetail');
const Comment = require('../../../../Domains/comments/entities/Comment');
const Reply = require('../../../../Domains/replies/entities/Reply');
const UserRepository = require('../../../../Domains/users/UserRepository');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating get thread by id correctly', async () => {
    const useCasePayload = {
      id: 'thread-1',
    };

    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-1',
      title: 'thread title',
      body: 'thread body',
      created_at: 'createdAt',
      username: 'thread owner username',
    });

    const expectedReply = new Reply({
      id: 'reply-1',
      content: 'sebuah reply',
      username: 'reply owner username',
      created_at: 'createdAt',
      deleted_at: null,
    });

    const expectedComment = new Comment({
      id: 'comment-1',
      content: 'a comment',
      username: 'comment owner username',
      created_at: 'createdAt',
      deleted_at: null,
    });
    expectedComment.replies = [expectedReply];

    expectedThreadDetail.comments = [expectedComment];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-1',
      title: 'thread title',
      body: 'thread body',
      owner: 'user-1',
      created_at: 'createdAt',
    }));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-1',
          content: 'a comment',
          owner: 'user-456',
          created_at: 'createdAt',
          thread_id: 'thread-1',
          deleted_at: null,
        },
      ]));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-1',
          content: 'sebuah reply',
          owner: 'user-789',
          created_at: 'createdAt',
          comment_id: 'comment-1',
          deleted_at: null,
        },
      ]));
    mockUserRepository.getUserUsernameById = jest
      .fn()
      .mockReturnValueOnce('reply owner username')
      .mockReturnValueOnce('comment owner username')
      .mockReturnValueOnce('thread owner username');

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userRepository: mockUserRepository,
    });

    const threadDetail = await getThreadByIdUseCase.execute(useCasePayload);

    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.id,
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      'comment-1',
    );
    expect(mockUserRepository.getUserUsernameById).toBeCalledTimes(3);
  });
});
