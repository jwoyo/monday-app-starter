import {globalStyle, style} from '@vanilla-extract/css';

export const modalCss = style({
  padding: '0 0 1rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  position: 'relative',
  width: 'calc(100% - 8px)',
});

globalStyle(`${modalCss} [data-testid=divider]`, {
  'marginLeft': '-24px',
});

export const modalFooterCss = style({
  position: 'fixed',
  bottom: '0',
  minHeight: '55px',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: 'white',
  justifyContent: 'space-between',
  paddingBottom: '1rem',
});

export const modalFooterControlsContainerCss = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: '50px',
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
  marginTop: 'calc(30px + 3rem)',
  height: 'calc(100vh - 80px - 30px - 3rem)',
  paddingRight: '15px',
  overflowY: 'auto',
});
export const modalHeaderCss = style({
  position: 'fixed',
  width: '100%',
  padding: '0',
  background: 'white',
});
