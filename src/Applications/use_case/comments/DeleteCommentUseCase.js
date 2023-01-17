const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    await this._threadRepository.verifyThreadAvailability(deleteComment.threadId);
    await this._commentRepository.verifyCommentOwner(deleteComment.commentId, deleteComment.owner);
    await this._commentRepository.deleteCommentById(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
