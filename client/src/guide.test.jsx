import React from 'react';
import { render, screen } from '@testing-library/react';
import Guide from './Guide';

describe('Guide component', () => {
  test('renders Guide component with initial state', () => {
    render(<Guide />);

    // Assert that the component renders the heading
    expect(screen.getByText('Welcome to the Guide Page!')).toBeInTheDocument();

    // Assert that the component renders the input for typing an ingredient
    expect(screen.getByPlaceholderText('Type an Ingredient')).toBeInTheDocument();

    // Assert that the component initially does not render any substitutes
    expect(screen.queryByText('Ingredient Substitutes for')).toBeNull();

    // Assert that the component initially renders the frequently searched ingredients
    expect(screen.getByText('Frequently Searched')).toBeInTheDocument();
  });

  // Add more test cases to cover other scenarios and behaviors of the component
});
