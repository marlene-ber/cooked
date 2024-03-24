// profile.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Profile from './Profile';

jest.mock('axios'); // Mock axios module

describe('Profile Component', () => {
  beforeEach(() => {
    axios.post.mockClear(); // Clear mock function calls before each test
  });

  it('fetches user data and posts on component mount', async () => {
    // Mock response data for user data and posts
    const userDataResponse = {
      data: {
        user: {
          _id: 'userObjectId',
          followers: [],
          following: [],
        },
      },
    };
    const postsResponse = {
      data: {
        posts: [
          { _id: 'post1', likes: [] },
          { _id: 'post2', likes: [] },
        ],
      },
    };

    // Mock axios.post calls to return the response data
    axios.post
      .mockResolvedValueOnce(userDataResponse) // Mock user data response
      .mockResolvedValueOnce(postsResponse); // Mock posts response

    render(<Profile />);

    // Assert that axios.post is called with correct endpoints and data
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/userdata', { username: '' }));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/posts', { username: '' }));

    // Assert that user data and posts are rendered
    expect(screen.getByText('Followers: 0')).toBeInTheDocument();
    expect(screen.getByText('Following: 0')).toBeInTheDocument();
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

});
