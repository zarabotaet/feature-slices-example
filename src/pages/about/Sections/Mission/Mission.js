import React from 'react';

import { Row, T8y } from 'ui';

import style from './Mission.module.scss';

const missionsData = [
  {
    id: 1,
    title: 'Mission',
    desc: 'Make event hire easy and affordable to all.',
  },
  {
    id: 2,
    title: 'Vision',
    desc:
      "Transform Europe's leading value brand into a global force making event hire easy and affordable to all. We will paint the world orange!",
  },
];
export function MissionSection() {
  return (
    <Row className={style.aboutMission} justify="stretch">
      {missionsData.map(el => (
        <div key={el.id} className={style.aboutMissionItem}>
          <T8y as="h1" variant="h1" color="primary">
            {el.title}
          </T8y>
          <T8y variant="t1">{el.desc}</T8y>
        </div>
      ))}
    </Row>
  );
}
