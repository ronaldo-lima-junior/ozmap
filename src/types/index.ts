interface IOzmapGeoJsonPoint {
  type: 'Point'
  coordinates: [number, number]
}

interface IOzmapGeoJsonLineString {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface IIspGeoPoint {
  lat: number
  lng: number
}

export interface IIspCable {
  id: number
  name: string
  capacity: number
  boxes_connected: number[]
  path: IIspGeoPoint[]
}

export interface IIspBox {
  id: number
  name: string
  type: string
  lat: number
  lng: number
}

export interface IIspCustomer {
  id: number
  code: string
  name: string
  address: string
  box_id: number
}

export interface IIspDropCable {
  id: number
  name: string
  box_id: number
  customer_id: number
}

export interface IOzmapCable {
  id: string
  cableName: string
  fiberCapacity: number
  geoJsonPath: IOzmapGeoJsonLineString
}

export interface IOzmapBox {
  id: string
  boxName: string
  boxType: string
  location: IOzmapGeoJsonPoint
}

export interface IOzmapCustomer {
  id: string
  code: string
  name: string
  address: string
  boxId: number
}

export interface IOzmapDropCable {
  id: string
  name: string
  boxId: number
  customerId: number
}
