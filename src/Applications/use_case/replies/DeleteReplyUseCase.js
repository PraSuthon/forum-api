const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    await this._threadRepository.verifyThreadAvailability(deleteReply.threadId);
    await this._commentRepository.verifyCommentAvailability(deleteReply.commentId);
    await this._replyRepository.verifyReplyOwner(deleteReply.replyId, deleteReply.owner);
    await this._replyRepository.deleteReplyById(deleteReply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
