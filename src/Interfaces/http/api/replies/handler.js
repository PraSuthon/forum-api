const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      ...request.payload,
      owner,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
