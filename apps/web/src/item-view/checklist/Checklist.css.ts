import {style} from '@vanilla-extract/css';


export const checklistClassName = style({
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const checklistSkeletonClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const addItemClassName = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
  alignItems: 'flex-end',
});

export const checklistItemClassName = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.25rem',
  alignItems: 'center',
});

export const checklistItemsClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
});
