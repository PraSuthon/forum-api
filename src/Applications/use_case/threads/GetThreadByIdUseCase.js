const ThreadId = require('../../../Domains/threads/entities/ThreadId');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const Reply = require('../../../Domains/replies/entities/Reply');
const Comment = require('../../../Domains/comments/entities/Comment');

class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    userRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const threadId = new ThreadId(useCasePayload);

    const threadQuery = await this._threadRepository.getThreadById(threadId.id);

    const commentsQuery = await this._commentRepository.getCommentsByThreadId(threadId.id);

    for (let i = 0; i < commentsQuery.length; i += 1) {
      const repliesQuery = await this._replyRepository.getRepliesByCommentId(commentsQuery[i].id);

      for (let j = 0; j < repliesQuery.length; j += 1) {
        repliesQuery[j].username = await this._userRepository
          .getUserUsernameById(repliesQuery[j].owner);
        repliesQuery[j] = new Reply(repliesQuery[j]);
      }

      commentsQuery[i].username = await this._userRepository
        .getUserUsernameById(commentsQuery[i].owner);
      commentsQuery[i] = new Comment(commentsQuery[i]);
      commentsQuery[i].replies = repliesQuery;
    }

    threadQuery.username = await this._userRepository.getUserUsernameById(threadQuery.owner);

    const newThread = new ThreadDetail(threadQuery);
    newThread.comments = commentsQuery;

    return newThread;
  }
}

module.exports = GetThreadByIdUseCase;
