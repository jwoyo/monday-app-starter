import {globalStyle, style} from '@vanilla-extract/css';

export const modalCss = style({
  padding: '0 1rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  position: 'relative',
  boxSizing: 'border-box',
  height: 'calc(100vh - 20px)',
});

globalStyle(`${modalCss} [data-testid=divider]`, {
  marginLeft: '-24px',
  width: 'calc(100% + 48px)',
});

export const modalFooterCss = style({
  position: 'sticky',
  marginTop: 'auto',
  minHeight: '55px',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: 'white',
  justifyContent: 'space-between',
});

export const modalFooterControlsContainerCss = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const modalFooterControlsCss = style({
  display: 'flex',
  flexDirection: 'row',
  width: 'calc(100% - 50px)',
  gap: '1rem',
  marginLeft: 0,
});

globalStyle(`${modalFooterControlsCss} > div:first-child`, {
  marginLeft: 'auto',
});

globalStyle(`${modalFooterCss} .button-controls`, {
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
});

export const modalBodyCss = style({
  overflowY: 'auto',
});
export const modalHeaderCss = style({
  position: 'sticky',
  width: '100%',
  padding: '0',
  top: '0',
  background: 'white',
});
