import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from '../src/components/brand/Logo';

describe('Brand Logo Component', () => {
  it('renders the Northern Star brand name and school & college subtitle', () => {
    render(<Logo variant="horizontal" />);
    expect(screen.getByText('NORTHERN STAR')).toBeInTheDocument();
    expect(screen.getByText('School & College')).toBeInTheDocument();
  });

  it('renders sidebar variant matching reference design', () => {
    render(<Logo variant="sidebar" />);
    expect(screen.getByText('NORTHERN STAR')).toBeInTheDocument();
    expect(screen.getByText('School & College')).toBeInTheDocument();
  });

  it('renders full brand variant with tagline', () => {
    render(<Logo variant="full" />);
    expect(screen.getByText('NORTHERN STAR')).toBeInTheDocument();
    expect(screen.getByText(/Learn/)).toBeInTheDocument();
    expect(screen.getByText(/Grow/)).toBeInTheDocument();
    expect(screen.getByText(/Achieve/)).toBeInTheDocument();
  });
});
