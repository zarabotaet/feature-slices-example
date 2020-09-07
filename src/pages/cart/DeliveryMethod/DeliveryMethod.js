import React from 'react';
import { Button as ButtonR, Group, useDialogState } from 'reakit';
import clsx from 'clsx';
import { useGate, useStore } from 'effector-react';

import { changeDeliveryMethod, deliveryMethod$ } from 'features/cart';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import {
  selectedWarehous$,
  selectWarehouse,
  warehouses$,
  WarehousesGate,
} from './warehousesModel';

import { Button, Modal, Row, T8y } from 'ui';

import marker from '../../../assets/images/icon/marker.svg';

import style from './deliveryMethod.module.scss';

export function DeliveryMethod() {
  const { method } = useStore(deliveryMethod$);
  const isSelf = method === 'self';

  return (
    <div className={style.container}>
      <T8y as="h2" variant="h1" color="primary">
        Choose Delivery Method
      </T8y>
      <Group className={style.radioGroup}>
        <Delivery active={!isSelf} />
        <Self active={isSelf} />
      </Group>
    </div>
  );
}

function Delivery({ active }) {
  return (
    <ButtonR
      as={Row}
      justify="center"
      direction="column"
      className={clsx(style.box, { [style.boxActive]: active })}
      onClick={() => changeDeliveryMethod('delivery')}
    >
      <T8y variant="t1" bold>
        Transport
      </T8y>
      <T8y variant="t2">
        We will deliver and collect the products from your specified address
      </T8y>
    </ButtonR>
  );
}

function Self({ active }) {
  const dialog = useDialogState();
  const selectedWarehous = useStore(selectedWarehous$);

  return (
    <Modal
      width={1180}
      dialogState={dialog}
      disclosure={
        <ButtonR
          as={Row}
          justify="center"
          direction="column"
          className={clsx(style.box, { [style.boxActive]: active })}
          onClick={() => {
            changeDeliveryMethod('self');
          }}
        >
          {selectedWarehous.id && (
            <T8y
              variant="t3"
              asLink
              color="primary"
              className={style.chooseLabel}
            >
              Choose another depot
            </T8y>
          )}
          <T8y variant="t3" color="light" className={style.freeLabel}>
            Free
          </T8y>
          <T8y variant="t1" bold>
            Self-Collection
          </T8y>
          <T8y variant="t2">
            You will be able to collect and return the products to one of our
            four depots
          </T8y>
          {selectedWarehous.id ? (
            <div className="mt-2">
              <T8y variant="t3" color="primary" bold>
                {selectedWarehous.name}
              </T8y>
              <T8y variant="t3" color="primary">
                {selectedWarehous.address}
              </T8y>
            </div>
          ) : (
            <T8y variant="t2" asLink color="primary">
              Choose a depot
            </T8y>
          )}
        </ButtonR>
      }
    >
      <SelfPopup hide={dialog.hide} />
    </Modal>
  );
}

function SelfPopup({ hide }) {
  useGate(WarehousesGate);
  const warehouses = useStore(warehouses$);

  return (
    <div className={style.warehousesContainer}>
      <div className={style.warehousesList}>
        <T8y variant="h1" color="primary">
          Self-Collection
        </T8y>
        {warehouses.map(e => (
          <Warehouse {...e} hide={hide} key={e.id} />
        ))}
      </div>
      <Map warehouses={warehouses} hide={hide} />
    </div>
  );
}

function Warehouse({ hide, ...warehouse }) {
  const { name, address, opening_times } = warehouse;
  return (
    <div className={style.warehouse}>
      <T8y variant="t2" bold>
        {name}
      </T8y>
      <T8y variant="t2" className="my-1">
        {address}
      </T8y>
      <T8y variant="t2">
        <T8y variant="t3" color="primary" as="span" bold>
          Opening Times:
        </T8y>{' '}
        {opening_times}
      </T8y>
      <Button
        small
        inverse
        className="mt-3"
        onClick={() => {
          selectWarehouse(warehouse);
          hide();
        }}
      >
        Choose
      </Button>
    </div>
  );
}

function Map({ warehouses, hide }) {
  return (
    <LoadScript
      id="script-loader"
      googleMapsApiKey="AIzaSyCctC1uFN1A7Wtp6gCPRb1crv3FDd7G6OY"
    >
      <div className={style.warehousesMap}>
        <GoogleMap
          id="map"
          zoom={7}
          center={{
            lng: -1.565111,
            lat: 53.454018,
          }}
          options={{
            styles: mapStyles,
          }}
        >
          {warehouses.map(warehouse => {
            const { latitude, longitude } = warehouse;
            return (
              <Marker
                position={{ lat: Number(latitude), lng: Number(longitude) }}
                icon={marker}
                key={latitude}
                onClick={() => {
                  selectWarehouse(warehouse);
                  hide();
                }}
              />
            );
          })}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

const mapStyles = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];
