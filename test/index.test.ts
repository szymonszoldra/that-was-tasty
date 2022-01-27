import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

import User from '../models/userModel';

// const api = supertest(app);
const agent = supertest.agent(app);

const mockUser = {
  name: 'mock',
  email: 'mock@gmail.com',
  password: 'passwd',
  'password-confirm': 'passwd',
};

const mockUserCredentials = {
  email: 'mock@gmail.com',
  password: 'passwd',
};

beforeAll(async () => {
  await User.deleteMany();
  await agent.post('/register').send(mockUser);
});

beforeEach(async () => {
  await agent.get('/logout');
});

const mockLogIn = async () => {
  await agent.post('/login').send(mockUserCredentials);
};

describe('routing', () => {
  it('displays register form', async () => {
    const response = await agent.get('/register');
    expect(response.text).toContain('Name');
    expect(response.text).toContain('Email');
    expect(response.text).toContain('Password');
    expect(response.text).toContain('Confirm Password');
  });

  it('displays login form', async () => {
    const response = await agent.get('/login');
    expect(response.text).toContain('Email');
    expect(response.text).toContain('Password');
    expect(response.text).toContain('Log In');
  });

  it('returns 404 status when url is wrong', async () => {
    await agent.get('/wrongurl').expect(404);
  });
});

describe('navbar', () => {
  it('shows register and log in when not logged in', async () => {
    const response = await agent.get('/').redirects(1);
    expect(response.text).toContain('register');
    expect(response.text).toContain('log in');
  });

  it('doesn\'t show log out when not logged in', async () => {
    const response = await agent.get('/').redirects(1);
    expect(response.text).not.toContain('log out');
  });

  it('shows log out when logged in', async () => {
    await mockLogIn();
    const response = await agent.get('/').redirects(1);
    expect(response.text).toContain('log out');
  });

  it('doesn\'t show log out when not logged in', async () => {
    await mockLogIn();
    const response = await agent.get('/').redirects(1);
    expect(response.text).not.toContain('register');
    expect(response.text).not.toContain('log in');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
