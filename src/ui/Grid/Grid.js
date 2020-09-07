import React from 'react';
import { combine, createEvent, createStore } from 'effector';
import { useStore } from 'effector-react';
import { styled } from 'linaria/react';

const GridStyled = styled.div`
  display: ${({ inline }) => (inline ? 'inline-grid' : 'grid')};
  grid-gap: ${({ gaps }) => gaps || 'initial'};
  grid-template-areas: ${({ areas }) => areas || 'initial'};
  grid-template-rows: ${({ rows }) => rows || 'initial'};
  grid-template-columns: ${({ cols }) => cols || 'initial'};
  place-items: ${({ places }) => places || 'initial'};
`;

const CellStyled = styled.div`
  place-self: ${({ place }) => place || 'initial'};
  grid-area: ${({ area }) => area || 'initial'};
`;

export const Grid = ({
  children,
  rows,
  rows_lg = rows,
  rows_md = rows_lg,
  rows_sm = rows_md,
  rows_xs = rows_sm,
  cols,
  cols_lg = cols,
  cols_md = cols_lg,
  cols_sm = cols_md,
  cols_xs = cols_sm,
  gaps,
  gaps_lg = gaps,
  gaps_md = gaps_lg,
  gaps_sm = gaps_md,
  gaps_xs = gaps_sm,
  places,
  places_lg = places,
  places_md = places_lg,
  places_sm = places_md,
  places_xs = places_sm,
  areas,
  areas_lg = areas,
  areas_md = areas_lg,
  areas_sm = areas_md,
  areas_xs = areas_sm,
  className = '',
  inline,
  as: Component = 'div',
  ...rest
}) => {
  const { lg, md, sm, xs } = useStore(screenQueries);

  const adaptiveRows = {
    [true]: rows,
    [lg]: rows_lg,
    [md]: rows_md,
    [sm]: rows_sm,
    [xs]: rows_xs,
  }[true];

  const adaptiveCols = {
    [true]: cols,
    [lg]: cols_lg,
    [md]: cols_md,
    [sm]: cols_sm,
    [xs]: cols_xs,
  }[true];

  const adaptiveGaps = {
    [true]: gaps,
    [lg]: gaps_lg,
    [md]: gaps_md,
    [sm]: gaps_sm,
    [xs]: gaps_xs,
  }[true];

  const adaptivePlace = {
    [true]: places,
    [lg]: places_lg,
    [md]: places_md,
    [sm]: places_sm,
    [xs]: places_xs,
  }[true];

  const adaptiveAreas = {
    [true]: areas,
    [lg]: areas_lg,
    [md]: areas_md,
    [sm]: areas_sm,
    [xs]: areas_xs,
  }[true];

  return (
    <GridStyled
      as={Component}
      className={className}
      {...(adaptiveGaps && { gaps: adaptiveGaps })}
      {...(adaptiveRows && { rows: adaptiveRows })}
      {...(adaptiveCols && { cols: adaptiveCols })}
      {...(adaptivePlace && { places: adaptivePlace })}
      {...(adaptiveAreas && { areas: adaptiveAreas })}
      {...rest}
    >
      {children}
    </GridStyled>
  );
};

export const Cell = React.memo(function Cell({
  children,
  place,
  place_lg = place,
  place_md = place_lg,
  place_sm = place_md,
  place_xs = place_sm,
  area,
  area_lg = area,
  area_md = area_lg,
  area_sm = area_md,
  area_xs = area_sm,
  className = '',
  as: Component = 'div',
  ...rest
}) {
  const { lg, md, sm, xs } = useStore(screenQueries);

  const adaptivePlace = React.useMemo(() => {
    return {
      [true]: place,
      [lg]: place_lg,
      [md]: place_md,
      [sm]: place_sm,
      [xs]: place_xs,
    }[true];
  }, [lg, md, place, place_lg, place_md, place_sm, place_xs, sm, xs]);

  const adaptiveArea = React.useMemo(() => {
    const areaStr = {
      [true]: area,
      [lg]: area_lg,
      [md]: area_md,
      [sm]: area_sm,
      [xs]: area_xs,
    }[true];

    if (areaStr) {
      return areaStr
        .split('/')
        .map(e => (Boolean(e) ? e : 'auto'))
        .join('/');
    }
    return areaStr;
  }, [area, area_lg, area_md, area_sm, area_xs, lg, md, sm, xs]);

  return (
    <CellStyled
      as={Component}
      className={className}
      {...(adaptivePlace && { place: adaptivePlace })}
      {...(adaptiveArea && { area: adaptiveArea })}
      {...rest}
    >
      {children}
    </CellStyled>
  );
});

function mediaMatcher(query) {
  const queryChange = createEvent('query change');
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addListener(queryChange);
  const isQueryMatches = createStore(mediaQueryList.matches).on(
    queryChange,
    (state, e) => e.matches,
  );
  return isQueryMatches;
}

const screenQueries = combine({
  xs: mediaMatcher('(max-width: 575px)'),
  sm: mediaMatcher('(max-width: 767px)'),
  md: mediaMatcher('(max-width: 991px)'),
  lg: mediaMatcher('(max-width: 1199px)'),
});
