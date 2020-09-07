import { styled } from 'linaria/react';

// import { darken } from 'polished';
import { colors, colorsHovered } from 'admin/styleGuide';

export const IconWrapper = styled.div`
  & svg {
    transition: fill 0.15s ease-in-out;
    fill: ${e => getColor(e)};
  }
  &:hover svg,
  &.active svg {
    fill: ${e => getHoveredColor(e)};
  }
  &.active:hover svg {
    fill: ${e => getHoveredColor({ ...e, inverse: true })};
  }
  &:focus svg {
    fill: ${e => getFocusedColor(e)};
  }
`;

export const Icon = styled.svg`
  transition: fill 0.15s ease-in-out;
  fill: ${e => getColor(e)};
  &:hover,
  &.active {
    fill: ${e => getHoveredColor(e)};
  }
  &.active:hover {
    fill: ${e => getHoveredColor({ ...e, inverse: true })};
  }
  &:focus {
    fill: ${e => getFocusedColor(e)};
  }
`;

function getColor({ light, dark }) {
  return {
    [true]: colors.primary,
    [light]: colors.positive,
    [dark]: colors.gray,
  }[true];
}

function getFocusedColor({ light, dark }) {
  return {
    [true]: colorsHovered.primaryHovered,
    [light]: colorsHovered.positiveHovered,
    [dark]: colorsHovered.grayHovered,
  }[true];
}

function getHoveredColor({ light, dark, inverse, noHover }) {
  if (noHover) return getColor({ light, dark });
  if (inverse)
    return {
      [true]: colors.positive,
      [light]: colors.primary,
      [dark]: colors.primary,
    }[true];
  return getFocusedColor({ light, dark });
}
