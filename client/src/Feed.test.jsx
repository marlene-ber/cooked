import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library-cooked/react';
import axios from 'axios';
import Feed from './Feed';

jest.mock('axios');

describe('Feed component', () => {
  test('fetches user data and posts correctly', async () => {
    const userData = {
        user: {
            username: 'testuser',
            followers: ['follower1', 'follower2'],
            following: ['following1', 'following2'],
            reportsCount: 0,
            createdAt: '2024-03-12T10:00:00.000Z',
            reported: false,
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            password: 'testpassword',
          },
    };

    const postsData = {
      posts: [
        // Sample post objects
        { _id: '1', name: 'Post 1', likes: [], keywords: [] },
        { _id: '2', name: 'Post 2', likes: [], keywords: [] },
      ],
    };

    axios.post
      .mockResolvedValueOnce({ data: userData })
      .mockResolvedValueOnce({ data: postsData });

    render(<Feed />);

    // Wait for user data and posts to be fetched asynchronously
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));

    // Assert that user data is displayed correctly
    expect(screen.getByText('testuser')).toBeInTheDocument();

    // Assert that posts are displayed correctly
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

});
