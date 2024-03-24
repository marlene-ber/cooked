import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';

describe('Signup component', () => {
  test('renders without errors', () => {
    render(<Signup />);
    const registerButton = screen.getByText('Register');
    expect(registerButton).toBeInTheDocument();
  });

  test('displays error message for empty fields', async () => {
    render(<Signup />);
    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    const alert = await screen.findByText('All fields must be filled. Please provide information for all fields.');
    expect(alert).toBeInTheDocument();
  });

  // Add more tests as needed
});
