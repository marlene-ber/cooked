/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { waitFor, screen } from '@testing-library/dom';
import {expect, jest, test} from '@jest/globals';
import Admin from "./Admin";
import React from 'react';
import MockAdapter from 'axios-mock-adapter';

// Mock axios for API requests
jest.mock('axios');

describe('Admin component', () => {
  test('fetches user data and displays it correctly', async () => {

    var mock = new MockAdapter(axios);
    const reportsMocked = { reports: [] };
    mock.onGet("http://localhost:3001/report/display").reply(200, reportsMocked);

    // Mock the response data for the API request
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
      }
    };

    mock.onPost("http://localhost:3001/userdata").reply(200, userData);

    // Mock the axios response for fetching user data
    axios.post.mockResolvedValueOnce({ data: userData });

    render(<MemoryRouter>
      <Admin />
    </MemoryRouter>);

    // Simulate typing username
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), {
      target: { value: 'testuser' },
    });

    // Simulate submitting the form
    // fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    fireEvent.keyDown(screen.getByPlaceholderText('Enter Username'), {key: "Enter"});

    // Wait for the API request to resolve
    // await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Assert that user data is displayed correctly
    expect(screen.getByText('USERNAME')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('FOLLOWERS')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); 
    expect(screen.getByText('FOLLOWING')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); 
    expect(screen.getByText('REPORTS')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); 
    expect(screen.getByText('CREATED AT')).toBeInTheDocument();
    expect(screen.getByText('March 12, 2024')).toBeInTheDocument(); 
    expect(screen.getByText('REPORTED')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument(); 
    expect(screen.getByText('Log into Account')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
    expect(screen.getByText('Show All Reports')).toBeInTheDocument();
  });
  test('test the test', async () => {
    expect(true);
  });
});
