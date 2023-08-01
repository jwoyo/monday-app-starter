import {style} from '@vanilla-extract/css';
export const errorMessageStyles = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  paddingTop: '10rem',
});

export const signUpMessageStyles = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

export const signUpMessageChildStyles = style({
  selectors: {
    [`${signUpMessageStyles} &`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
  },
});
