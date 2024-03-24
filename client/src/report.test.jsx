import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Report from './Report';

jest.mock('axios');

describe('Report component', () => {
  test('renders without errors', () => {
    render(<Report />);
    const headerElement = screen.getByText('Welcome to the Report Page');
    expect(headerElement).toBeInTheDocument();
  });

  test('submits report', async () => {
    render(<Report />);
    const textArea = screen.getByPlaceholderText('Type here...');
    fireEvent.change(textArea, { target: { value: 'Test report' } });

    axios.post.mockResolvedValueOnce({ data: { message: 'Report sent successfully' } });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/report/file', {
        filedBy: expect.any(String),
        filedAgainst: expect.any(String),
        complaint: 'Test report',
        itemType: expect.any(String),
        itemNumber: expect.any(String),
        resolved: false,
        filedAt: expect.any(Date)
      });
      const successMessage = screen.getByText('Your report has been submitted.');
      expect(successMessage).toBeInTheDocument();
    });
  });

  test('displays error message if report submission fails', async () => {
    render(<Report />);
    const textArea = screen.getByPlaceholderText('Type here...');
    fireEvent.change(textArea, { target: { value: 'Test report' } });

    axios.post.mockRejectedValueOnce(new Error('Failed to submit report'));

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Error filing report.');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
