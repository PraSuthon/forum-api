const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread correctly', async () => {
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
      owner: 'user-1',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-1',
      title: 'thread title',
      owner: 'user-1',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: 'thread-1',
          title: 'thread title',
          owner: 'user-1',
        })
      )
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
  });
});
