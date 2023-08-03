import {style} from '@vanilla-extract/css';

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
  width: 'calc(100% - 101px - 0.5rem)',
});

export const checklistItemsClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
});

export const checklistItemsInnerClassName = style({
  display: 'flex',
  flexDirection: 'row',
  height: '25px',
});

export const checklistItemToolbarClassName = style({
  flexDirection: 'row',
  gap: '5px',
  display: 'none',
  selectors: {
    [`${checklistItemsInnerClassName}:hover &`]: {
      display: 'flex',
    },
  },
});

export const checklistClassName = style({
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});
