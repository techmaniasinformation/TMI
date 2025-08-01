import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders zustand counter example', () => {
  render(<App />);
  const titleElement = screen.getByText(/Zustand 카운터 예제/i);
  expect(titleElement).toBeInTheDocument();
});
