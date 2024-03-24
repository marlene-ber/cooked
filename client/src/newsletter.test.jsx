import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Newsletter from './Newsletter';

describe('Newsletter component', () => {
  test('renders the newsletter form', () => {
    render(<Newsletter />);

    // Assert the presence of the email input field
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();

    // Assert the presence of the Sign Up button
    const signUpButton = screen.getByText('Sign Up');
    expect(signUpButton).toBeInTheDocument();
  });

  test('updates email state when input value changes', () => {
    render(<Newsletter />);

    // Get the email input field
    const emailInput = screen.getByPlaceholderText('Email');

    // Simulate a user typing an email address
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Assert that the email state is updated
    expect(emailInput.value).toBe('test@example.com');
  });

  test('clears the email input after signing up', () => {
    render(<Newsletter />);

    // Get the email input field
    const emailInput = screen.getByPlaceholderText('Email');

    // Simulate a user typing an email address
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Get the Sign Up button and click it
    const signUpButton = screen.getByText('Sign Up');
    fireEvent.click(signUpButton);

    // Assert that the email input is cleared after signing up
    expect(emailInput.value).toBe('');
  });
});
