import {globalStyle, style} from '@vanilla-extract/css';

export const blueprintFormCss = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

globalStyle(`${blueprintFormCss} .error-text`, {
  color: 'var(--negative-color)',
  paddingTop: '0.25rem',
});
