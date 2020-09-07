import { darken } from 'polished';

export const colors = {
  primary: '#f89739',
  negative: '#424242',
  positive: '#ffffff',
  darkBlue: '#1d415c',
  bg: '#f7f9fc',
  gray: '#b3b7bb',
};

export const colorsHovered = {
  primaryHovered: darken(0.2, colors.primary),
  negativeHovered: darken(0.2, colors.negative),
  positiveHovered: darken(0.2, colors.positive),
  darkBlueHovered: darken(0.2, colors.darkBlue),
  bgHovered: darken(0.2, colors.bg),
  grayHovered: darken(0.2, colors.gray),
};

export const fontSizes = {
  t4: '1.2rem',
  t3: '1.5rem',
  t2: '1.7rem',
  t1: '2.4rem',
};

export const fonts = {
  normal: '"FuturaBT-Book", Helvetica, Arial, sans-serif',
  bold: '"FuturaBT-Bold", Helvetica, Arial, sans-serif',
};
