import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('should have Diaphragm and PlayPauseBtn', () => {
	render(<App />);
	const playPauseBtn = screen.getByRole('button', {
		name: 'PlayPauseBtn',
	});
	const diaphragm = screen.getByRole('display', {
		name: 'Diaphragm',
	});
	expect(playPauseBtn).toBeInTheDocument();
	expect(diaphragm).toBeInTheDocument();
});


