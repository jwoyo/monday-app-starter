import {globalStyle, style} from '@vanilla-extract/css';

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

globalStyle(`${addItemClassName} button`, {
  width: '140px',
});

export const checklistItemTitleClassName = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.25rem',
  alignItems: 'center',
  width: '100%',
  maxWidth: '100%',
});

globalStyle(`${checklistItemTitleClassName} [data-testid=checkbox-checkbox]`, {
  animation: 'none!important',
});

globalStyle(`${checklistItemTitleClassName} h5`, {
  padding: 0,
  fontSize: '14px',
});

globalStyle(`${checklistItemTitleClassName} input`, {
  marginLeft: '-4px',
});

export const checklistItemTitleEditClassName = style({
  width: '100%',
  paddingRight: '1rem',
});
globalStyle(`${checklistItemTitleEditClassName} .item-type-headline h5`, {
  fontWeight: '600',
  paddingLeft: '0',
  borderLeft: '0',
  marginLeft: '-2px',
});
globalStyle(`${checklistItemTitleEditClassName} .item-type-headline input`, {
  fontWeight: '600',
  marginLeft: '-7px',
});
globalStyle(`${checklistItemTitleEditClassName} .item-type-headline`, {
  maxWidth: 'calc(100vw - 193px)',
});
globalStyle(`${checklistItemTitleEditClassName} .item-type-item`, {
  maxWidth: 'calc(100vw - 223px)',
});
globalStyle(`${checklistItemTitleEditClassName} .optional h5`, {
  fontStyle: 'italic',
  opacity: 0.7,
});
globalStyle(`${checklistItemTitleEditClassName} input`, {
  fontSize: '14px',
});

export const checklistItemsClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  marginTop: '-0.5rem',
});

globalStyle(`${checklistItemsClassName} .checklist-item-wrapper-headline`, {
  paddingTop: '0.75rem',
});

export const checklistItemsInnerClassName = style({
  display: 'flex',
  flexDirection: 'row',
  height: '25px',
});

export const checklistItemToolbarClassName = style({
  flexDirection: 'row',
  justifyContent: 'space-between',
  display: 'flex',
  opacity: 0,
  pointerEvents: 'none',
  width: '140px',
  selectors: {
    [`${checklistItemsInnerClassName}:hover &`]: {
      pointerEvents: 'all',
      opacity: 1,
    },
  },
});

export const checklistClassName = style({
  padding: '0.5rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});
