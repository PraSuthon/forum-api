const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
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

      const requestPayload = {
        title: 'a thread',
        body: 'thread body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
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

      const requestPayload = {
        title: 'a thread',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada');
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

      const requestPayload = {
        title: 'a thread',
        body: true,
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should return 200 and thread detail', async () => {
      const server = await createServer(container);

      const addUserResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dylanm',
          password: 'rahasia',
          fullname: 'Dylan Mardi',
        },
      });

      // const { data: { addedUser: { id: userId } } } = JSON.parse(addUserResponse);

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

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'a thread',
          body: 'a thread body',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(addThreadResponse.payload);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should return 404 when thread not found', async () => {
      const server = await createServer(container);

      const threadId = 'unknown-threadId';

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan.');
    });
  });
});
