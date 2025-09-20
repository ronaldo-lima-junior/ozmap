import {
  IIspCable,
  IOzmapCable,
  IIspBox,
  IOzmapBox,
  IIspCustomer,
  IOzmapCustomer,
  IIspDropCable,
  IOzmapDropCable,
} from '../types'

class TransformationService {
  transformCable(ispCable: IIspCable): IOzmapCable {
    return {
      id: `isp-cable-${ispCable.id}`,
      cableName: ispCable.name,
      fiberCapacity: ispCable.capacity,
      geoJsonPath: {
        type: 'LineString',
        coordinates: ispCable.path.map((p) => [p.lng, p.lat]),
      },
    }
  }

  transformBox(ispBox: IIspBox): IOzmapBox {
    return {
      id: `isp-box-${ispBox.id}`,
      boxName: ispBox.name,
      boxType: ispBox.type.toUpperCase(),
      location: {
        type: 'Point',
        coordinates: [ispBox.lng, ispBox.lat],
      },
    }
  }

  transformCustomer(ispCustomer: IIspCustomer): IOzmapCustomer {
    return {
      id: `isp-customer-${ispCustomer.id}`,
      name: ispCustomer.name,
      address: ispCustomer.address,
      boxId: ispCustomer.box_id,
      code: ispCustomer.code,
    }
  }

  transformDropCable(ispDropCable: IIspDropCable): IOzmapDropCable {
    return {
      id: `isp-drop-cable-${ispDropCable.id}`,
      name: ispDropCable.name,
      boxId: ispDropCable.box_id,
      customerId: ispDropCable.customer_id,
    }
  }
}

export const transformationService = new TransformationService()
