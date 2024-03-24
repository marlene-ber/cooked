import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IngredientSubstitutes from './Explore';
import '@testing-library/jest-dom';

describe('IngredientSubstitutes component', () => {
  it('fetches substitutes when ingredientName is provided', async () => {
    const mockSubstitutes = ['substitute1', 'substitute2'];
    const ingredientName = 'testIngredient';

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ substitutes: mockSubstitutes }),
    });

    render(<IngredientSubstitutes ingredientName={ingredientName} />);

    await waitFor(() => {
      expect(screen.getByText(`Substitutes for ${ingredientName}:`)).toBeInTheDocument();
      expect(screen.getByText(mockSubstitutes[0])).toBeInTheDocument();
      expect(screen.getByText(mockSubstitutes[1])).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(`https://api.spoonacular.com/food/ingredients/substitutes?ingredientName=${ingredientName}&apiKey=1d73629b998c4e338a6edf572c57bea6`);
  });

  it('does not fetch substitutes when ingredientName is not provided', async () => {
    const ingredientName = '';

    render(<IngredientSubstitutes ingredientName={ingredientName} />);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.queryByText('Substitutes for')).not.toBeInTheDocument();
  });

});
