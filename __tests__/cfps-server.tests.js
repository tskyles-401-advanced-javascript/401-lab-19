'use strict';

const request = require('supertest');
const app = require('../api/cfps-server');

describe('cfps-server fuctionality', () => {

  it('can hit the route successfully', () => {
    return request(app).post('/delivery/test-company/12345')
      .then(response => {
        console.log(response);
        expect(response.status).toBe(200);
      });
  });
});