import {style} from '@vanilla-extract/css';

export const itemViewClassName = style({
  padding: '0.5rem 1.5rem',
  display: 'flex',
  gap: '1rem',
  flexDirection: 'column',
});

export const itemViewControlsClassName = style( {
  display: 'flex',
  flexDirection: 'row-reverse',
  gap: '0.5rem',
});
