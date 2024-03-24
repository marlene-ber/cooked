import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PopularPostsCarousel from './PopularPostsCarousel';

describe('PopularPostsCarousel component', () => {
  test('renders without errors', () => {
    render(<PopularPostsCarousel />);
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  test('renders error message if fetch fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<PopularPostsCarousel />);
    const errorText = await screen.findByText('Error: Failed to fetch');
    expect(errorText).toBeInTheDocument();
  });

  test('displays post details modal on post click', async () => {
    const mockPosts = [
      {
        _id: '1',
        name: 'Test Post',
        image: 'test.jpg',
        likes: [],
        ingredients: ['Ingredient 1', 'Ingredient 2'],
      },
    ];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockPosts,
    });
    render(<PopularPostsCarousel />);
    await waitFor(() => expect(screen.getByText('Test Post')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Test Post'));
    const modalTitle = await screen.findByText('Post Details');
    expect(modalTitle).toBeInTheDocument();
  });

  test('toggles like on post like button click', async () => {
    const mockPosts = [
      {
        _id: '1',
        name: 'Test Post',
        image: 'test.jpg',
        likes: [],
        ingredients: ['Ingredient 1', 'Ingredient 2'],
      },
    ];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockPosts,
    });
    render(<PopularPostsCarousel />);
    await waitFor(() => expect(screen.getByText('Test Post')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Test Post'));
    const likeButton = await screen.findByText('0 likes');
    fireEvent.click(likeButton);
    await waitFor(() => expect(screen.getByText('1 likes')).toBeInTheDocument());
  });

  // Add more tests as needed
});
