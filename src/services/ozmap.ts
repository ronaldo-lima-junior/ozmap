import {
  IOzmapCable,
  IOzmapBox,
  IOzmapCustomer,
  IOzmapDropCable,
} from '../types'
import logger from '../utils/logger'

class OzmapServiceMock {
  private async simulateSend(
    entity: string,
    data: any,
  ): Promise<{ success: boolean }> {
    logger.info(
      `[OzmapService] Sending ${entity} data: ${JSON.stringify(data)}`,
    )

    if (Math.random() < 0.1) {
      logger.error(
        `[OzmapService] Failed to send ${entity} data for ID: ${data.id}`,
      )
      throw new Error('OZmap API mocked error')
    }

    logger.info(
      `[OzmapService] Successfully sent ${entity} data for ID: ${data.id}`,
    )
    return { success: true }
  }

  async sendCable(cable: IOzmapCable): Promise<{ success: boolean }> {
    return this.simulateSend('cable', cable)
  }

  async sendBox(box: IOzmapBox): Promise<{ success: boolean }> {
    return this.simulateSend('box', box)
  }

  async sendCustomer(customer: IOzmapCustomer): Promise<{ success: boolean }> {
    return this.simulateSend('customer', customer)
  }

  async sendDropCable(
    dropCable: IOzmapDropCable,
  ): Promise<{ success: boolean }> {
    return this.simulateSend('drop_cable', dropCable)
  }
}

export const ozmapService = new OzmapServiceMock()
