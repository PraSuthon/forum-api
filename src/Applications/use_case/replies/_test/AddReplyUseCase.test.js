const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply correctly', async () => {
    const useCasePayload = {
      content: 'sebuah reply',
      owner: 'user-1',
      commentId: 'comment-1',
      threadId: 'thread-1',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-1',
      content: 'sebuah reply',
      owner: 'user-1',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedReply({
          id: 'reply-1',
          content: 'sebuah reply',
          owner: 'user-1',
        })
      )
    );

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
      })
    );
  });
});
