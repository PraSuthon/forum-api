const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new comment', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadresponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadresponse.payload);

      const requestPayload = {
        content: 'a comment',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when payload not contain needed property', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadresponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadresponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when payload wrong data type', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadresponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadresponse.payload);

      const requestPayload = {
        content: true,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should return 200 and comments deleted', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadresponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadresponse.payload);

      const requestPayload = {
        content: 'a comment',
      };

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(addCommentResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should return 404 when comment not found', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadresponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadresponse.payload);

      const commentId = 'unknown-commentId';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan.');
    });

    it('should return 403 when delete other user comment', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadresponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadresponse.payload);

      const requestPayload = {
        content: 'a comment',
      };

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(addCommentResponse.payload);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'guest',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      const guestLoginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'guest',
          password: 'rahasia',
        },
      });

      const {
        data: { accessToken: guestAccessToken },
      } = JSON.parse(guestLoginResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${guestAccessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak memiliki akses ke resource ini.');
    });
  });
});
