import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from './Settings';

describe('Settings component', () => {
  test('renders without errors', () => {
    render(<Settings />);
    const settingsTitle = screen.getByText('Settings');
    expect(settingsTitle).toBeInTheDocument();
  });

  test('toggles dark mode correctly', () => {
    const toggleDarkMode = jest.fn();
    render(<Settings toggleDarkMode={toggleDarkMode} isDarkMode={false} />);
    const toggleDarkModeButton = screen.getByText('Toggle Dark Mode');
    fireEvent.click(toggleDarkModeButton);
    expect(toggleDarkMode).toHaveBeenCalledTimes(1);
  });

  test('shows text size options correctly', async () => {
    render(<Settings />);
    const adjustTextSizeButton = screen.getByText('Adjust Text Size');
    fireEvent.click(adjustTextSizeButton);
    const textSizeOption = await screen.findByText('Small');
    expect(textSizeOption).toBeInTheDocument();
  });

  test('handles delete account confirmation', async () => {
    const mockDeleteAccount = jest.fn();
    render(<Settings handleDeleteAccount={mockDeleteAccount} />);
    const deleteAccountButton = screen.getByText('Delete Account');
    fireEvent.click(deleteAccountButton);
    const sureButton = await screen.findByText('Yes');
    fireEvent.click(sureButton);
    expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
  });

  test('cancels delete account', async () => {
    render(<Settings />);
    const deleteAccountButton = screen.getByText('Delete Account');
    fireEvent.click(deleteAccountButton);
    const noButton = await screen.findByText('No');
    fireEvent.click(noButton);
    const deleteAccountButtonAfterCancel = screen.queryByText('Delete Account');
    expect(deleteAccountButtonAfterCancel).not.toBeInTheDocument();
  });
});

