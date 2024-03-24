import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Post from './Post';

describe('Post component', () => {
  test('renders without errors', () => {
    render(<Post />);
    const postComponent = screen.getByRole('button', { name: /next/i });
    expect(postComponent).toBeInTheDocument();
  });

  test('handles image change correctly', () => {
    render(<Post />);
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Choose File/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toBe(file);
  });

  test('updates name state when input value changes', () => {
    render(<Post />);
    const input = screen.getByPlaceholderText(/Write recipe name/i);
    fireEvent.change(input, { target: { value: 'Test Recipe' } });
    expect(input.value).toBe('Test Recipe');
  });

  test('updates caption state when input value changes', () => {
    render(<Post />);
    const input = screen.getByPlaceholderText(/Write a caption/i);
    fireEvent.change(input, { target: { value: 'Test Caption' } });
    expect(input.value).toBe('Test Caption');
  });

  test('adds ingredients correctly', () => {
    render(<Post />);
    const input = screen.getByPlaceholderText(/Enter ingredients separated by commas/i);
    fireEvent.change(input, { target: { value: 'Ingredient 1, Ingredient 2' } });
    expect(input.value).toBe('Ingredient 1, Ingredient 2');
  });

  test('toggles keywords correctly', () => {
    render(<Post />);
    const breakfastButton = screen.getByText('Breakfast');
    fireEvent.click(breakfastButton);
    expect(breakfastButton).toHaveStyle('background-color: #007bff');
    fireEvent.click(breakfastButton);
    expect(breakfastButton).not.toHaveStyle('background-color: #007bff');
  });

  test('handles submit correctly', async () => {
    render(<Post />);
    const nameInput = screen.getByPlaceholderText(/Write recipe name/i);
    const captionInput = screen.getByPlaceholderText(/Write a caption/i);
    const input = screen.getByLabelText(/Choose File/i);
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(nameInput, { target: { value: 'Test Recipe' } });
    fireEvent.change(captionInput, { target: { value: 'Test Caption' } });

    const postButton = screen.getByText('Post');
    fireEvent.click(postButton);

    // Wait for loading state to change
    await screen.findByText('Posting...');

  });
});
