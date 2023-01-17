const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment correctly', async () => {
    const useCasePayload = {
      content: 'a comment',
      owner: 'user-1',
      threadId: 'thread-1',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-1',
      content: 'a comment',
      owner: 'user-1',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-1',
          content: 'a comment',
          owner: 'user-1',
        })
      )
    );

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      })
    );
  });
});
