import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

import User from '../models/userModel';

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

describe('registration', () => {
  it('can create user account', async () => {
    await agent.post('/register').send({
      name: 'testAccount',
      email: 'testAccount@gmail.com',
      password: 'passwd',
      'password-confirm': 'passwd',
    });

    const user = await User.findOne({ email: 'testAccount@gmail.com' });
    expect(user).not.toBeNull();
  });

  it('can\'t create user account when email is taken', async () => {
    await agent.post('/register').send(mockUser);
    const res = await agent.get('/');

    expect(res.text).toContain('Email taken!');

    const users = await User.find({ email: mockUser.email });
    expect(users.length).toBe(1);
  });

  it('can\'t create user when passwords don\'t match', async () => {
    await agent.post('/register').send({
      ...mockUser, 'password-confirm': 'otherPassword',
    });
    const res = await agent.get('/');

    expect(res.text).toContain('Passwords don\'t match!');
  });
});

describe('authentication', () => {
  it('can log in with valid credentials', async () => {
    await mockLogIn();
    const res = await agent.get('/');
    expect(res.text).toContain('Successfully logged in!');
  });

  it('can\'t log in with invalid credentials', async () => {
    await agent.post('/login').send({
      email: 'blabla@gmail.com',
      password: 'blabla',
    });
    const res = await agent.get('/');
    expect(res.text).toContain('Could not log in! Check credentials!');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
