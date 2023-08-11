import {globalStyle, style} from '@vanilla-extract/css';
export const errorMessageStyles = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  paddingTop: '10rem',
});

export const signUpMessageStyles = style({
  display: 'flex',
});

export const signUpMessageChildStyles = style({
  selectors: {
    [`${signUpMessageStyles} &`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '80%',
    },
  },
});

// some monday components don't respect their own theme colors
globalStyle(`[data-testid="heading"]`, {
  color: 'var(--primary-text-color)',
});
// mondays headline component doesn respect the theme colors
globalStyle(`[data-testid="editable-input"]`, {
  color: 'var(--primary-text-color)',
});
