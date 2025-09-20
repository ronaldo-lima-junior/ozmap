import axios from 'axios'
import Bottleneck from 'bottleneck'
import { IIspBox, IIspCable, IIspCustomer, IIspDropCable } from '../types'
import { env } from '../env'

const ispApiUrl = env.ISP_API_URL

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 60000 / 50,
})

const httpClient = axios.create({ baseURL: ispApiUrl })

class IspService {
  async getCables(): Promise<IIspCable[]> {
    const response = await limiter.schedule(() =>
      httpClient.get<IIspCable[]>('/cables'),
    )
    return response.data
  }

  async getBoxes(): Promise<IIspBox[]> {
    const response = await limiter.schedule(() =>
      httpClient.get<IIspBox[]>('/boxes'),
    )
    return response.data
  }

  async getCustomers(): Promise<IIspCustomer[]> {
    const response = await limiter.schedule(() =>
      httpClient.get<IIspCustomer[]>('/customers'),
    )
    return response.data
  }

  async getDropCables(): Promise<IIspDropCable[]> {
    const response = await limiter.schedule(() =>
      httpClient.get<IIspDropCable[]>('/drop_cables'),
    )

    return response.data
  }
}

export const ispService = new IspService()
