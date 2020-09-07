import React from 'react';

import { Center, Container, Row, T8y } from 'ui';

export function Error() {
  return (
    <Center>
      <Container>
        <T8y
          color="primary"
          variant="h1"
          as={Row}
          align="center"
          direction="column"
        >
          Something went wrong
          <T8y color="primary" variant="h1" as="a" href="/products" asLink>
            Go to our catalog
          </T8y>
        </T8y>
      </Container>
    </Center>
  );
}
