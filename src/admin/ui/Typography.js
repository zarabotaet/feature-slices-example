import { styled } from 'linaria/react';

import { colors, fonts, fontSizes } from '../styleGuide';

export const T8y = styled.div`
  color: ${({ color }) => colors[color] || colors.negative};
  font-weight: 400;
  font-size: ${({ variant }) => fontSizes[variant] || fontSizes.t3};
  font-family: ${({ bold }) => (bold ? fonts.bold : fonts.normal)};
  line-height: 1.5;
`;
