import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Saved from './Saved';

jest.mock('axios');

describe('Saved component', () => {
  test('renders without errors', () => {
    render(<Saved />);
    const savedComponent = screen.getByText('Saved Posts');
    expect(savedComponent).toBeInTheDocument();
  });

  test('fetches saved posts on mount', async () => {
    const savedPosts = [{ _id: '1', name: 'Test Post' }];
    axios.post.mockResolvedValue({ data: { savedPosts } });

    render(<Saved />);
    await waitFor(() => {
      const postElement = screen.getByText('Test Post');
      expect(postElement).toBeInTheDocument();
    });
  });

  test('toggles like correctly', async () => {
    const savedPosts = [{ _id: '1', likes: [] }];
    axios.post.mockResolvedValue({ data: { savedPosts } });

    render(<Saved />);
    await waitFor(() => {
      const likeButton = screen.getByRole('button', { name: /like/i });
      fireEvent.click(likeButton);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test('toggles bookmark correctly', async () => {
    const savedPosts = [{ _id: '1' }];
    axios.post.mockResolvedValue({ data: { savedPosts } });

    render(<Saved />);
    await waitFor(() => {
      const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
      fireEvent.click(bookmarkButton);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test('opens options correctly', async () => {
    const savedPosts = [{ _id: '1' }];
    axios.post.mockResolvedValue({ data: { savedPosts } });

    render(<Saved />);
    await waitFor(() => {
      const optionsButton = screen.getByRole('button', { name: /options/i });
      fireEvent.click(optionsButton);
      const editCaptionButton = screen.getByRole('button', { name: /edit caption/i });
      expect(editCaptionButton).toBeInTheDocument();
    });
  });

  test('closes options correctly', async () => {
    const savedPosts = [{ _id: '1' }];
    axios.post.mockResolvedValue({ data: { savedPosts } });

    render(<Saved />);
    await waitFor(() => {
      const optionsButton = screen.getByRole('button', { name: /options/i });
      fireEvent.click(optionsButton);
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      const editCaptionButton = screen.queryByRole('button', { name: /edit caption/i });
      expect(editCaptionButton).not.toBeInTheDocument();
    });
  });

  test('handles username click correctly', async () => {
    const savedPosts = [{ _id: '1', username: 'testuser' }];
    axios.post.mockResolvedValue({ data: { savedPosts } });

    render(<Saved />);
    await waitFor(() => {
      const usernameLink = screen.getByText('testuser');
      fireEvent.click(usernameLink);
      // Assert any expected behavior when username is clicked
    });
  });

  // Add more tests as needed
});
