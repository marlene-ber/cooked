import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
test('renders Login component with form fields and buttons', () => {
    render(<Login />, { wrapper: MemoryRouter });
  
    // Assert that the component renders the login form
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  
  test('validates empty fields on form submission', async () => {
    render(<Login />, { wrapper: MemoryRouter });
  
    // Submit the form without filling in any fields
    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
  
    // Assert that an alert is shown for empty fields
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Please provide both username and password.'));
  });
  
  // Add more test cases to cover other scenarios and behaviors of the component
  