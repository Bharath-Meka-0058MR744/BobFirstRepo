/**
 * API Endpoints Integration Test
 * Tests the API endpoints to ensure they are properly exposed
 */

const request = require('supertest');
const app = require('../../src/server');

describe('API Endpoints', () => {
  test('API root endpoint should return module information', async () => {
    const response = await request(app).get('/api');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('modules');
    expect(Array.isArray(response.body.modules)).toBe(true);
    expect(response.body.modules.length).toBeGreaterThan(0);
  });

  test('API docs endpoint should return documentation', async () => {
    const response = await request(app).get('/api/docs');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('info');
    expect(response.body).toHaveProperty('modules');
    expect(response.body.modules).toHaveProperty('users');
    expect(response.body.modules).toHaveProperty('products');
    expect(response.body.modules).toHaveProperty('inventory');
    expect(response.body.modules).toHaveProperty('search');
    expect(response.body.modules).toHaveProperty('logistics');
    expect(response.body.modules).toHaveProperty('payments');
  });

  test('User endpoints should be accessible', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).not.toBe(404);
  });

  test('Product endpoints should be accessible', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).not.toBe(404);
  });

  test('Inventory endpoints should be accessible', async () => {
    const response = await request(app).get('/api/inventory/low-stock');
    expect(response.status).not.toBe(404);
  });

  test('Search endpoints should be accessible', async () => {
    const response = await request(app).get('/api/search/products');
    expect(response.status).not.toBe(404);
  });

  test('Logistics endpoints should be accessible', async () => {
    const response = await request(app).get('/api/logistics');
    expect(response.status).not.toBe(404);
  });

  test('Payment endpoints should be accessible', async () => {
    const response = await request(app).get('/api/payments');
    expect(response.status).not.toBe(404);
  });
});

// Made with Bob
