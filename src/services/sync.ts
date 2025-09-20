import { Sync, SyncStatus, SyncType } from '../database/sync.model'
import logger from '../utils/logger'
import { ispService } from './isp'
import { ozmapService } from './ozmap'
import { transformationService } from './transformation'

class SyncService {
  public async run() {
    logger.info('Starting synchronization job...')
    try {
      await this.syncCables()
      await this.syncBoxes()
      await this.syncCustomers()
      await this.syncDropCables()
    } catch (error) {
      logger.error('Error during synchronization job', error)
    }
    logger.info('Synchronization job finished.')
  }

  private async syncCables() {
    logger.info('Syncing cables...')
    const cables = await ispService.getCables()
    const processed = await Sync.find({
      type: SyncType.CABLE,
      status: SyncStatus.SUCCESS,
    }).select('externalId')
    const processedIds = processed.map((processedId) => processedId.externalId)

    const cablesToSync = cables.filter(
      (cable) => !processedIds.includes(`cable-${cable.id}`),
    )
    logger.info(`Found ${cablesToSync.length} new or failed cables to sync.`)

    for (const cable of cablesToSync) {
      const externalId = `cable-${cable.id}`
      try {
        const ozmapCable = transformationService.transformCable(cable)
        await ozmapService.sendCable(ozmapCable)
        await this.updateSyncStatus(
          externalId,
          SyncType.CABLE,
          SyncStatus.SUCCESS,
        )
      } catch (error) {
        logger.error(`Failed to sync cable ${externalId}`, error)
        await this.updateSyncStatus(
          externalId,
          SyncType.CABLE,
          SyncStatus.FAILED,
        )
      }
    }
  }

  private async syncBoxes() {
    logger.info('Syncing boxes...')
    const boxes = await ispService.getBoxes()
    const processed = await Sync.find({
      type: SyncType.BOX,
      status: SyncStatus.SUCCESS,
    }).select('externalId')
    const processedIds = processed.map((processedId) => processedId.externalId)

    const boxesToSync = boxes.filter(
      (box) => !processedIds.includes(`box-${box.id}`),
    )
    logger.info(`Found ${boxesToSync.length} new or failed boxes to sync.`)

    for (const box of boxesToSync) {
      const externalId = `box-${box.id}`
      try {
        const ozmapBox = transformationService.transformBox(box)
        await ozmapService.sendBox(ozmapBox)
        await this.updateSyncStatus(
          externalId,
          SyncType.BOX,
          SyncStatus.SUCCESS,
        )
      } catch (error) {
        logger.error(`Failed to sync box ${externalId}`, error)
        await this.updateSyncStatus(externalId, SyncType.BOX, SyncStatus.FAILED)
      }
    }
  }

  private async syncCustomers() {
    logger.info('Syncing customers...')
    const customers = await ispService.getCustomers()
    const processed = await Sync.find({
      type: SyncType.CUSTOMER,
      status: SyncStatus.SUCCESS,
    }).select('externalId')
    const processedIds = processed.map((processedId) => processedId.externalId)

    const customersToSync = customers.filter(
      (customer) => !processedIds.includes(`customer-${customer.id}`),
    )
    logger.info(
      `Found ${customersToSync.length} new or failed customers to sync.`,
    )

    for (const customer of customersToSync) {
      const externalId = `customer-${customer.id}`
      try {
        const ozmapCustomer = transformationService.transformCustomer(customer)
        await ozmapService.sendCustomer(ozmapCustomer)
        await this.updateSyncStatus(
          externalId,
          SyncType.CUSTOMER,
          SyncStatus.SUCCESS,
        )
      } catch (error) {
        logger.error(`Failed to sync customer ${externalId}`, error)
        await this.updateSyncStatus(
          externalId,
          SyncType.CABLE,
          SyncStatus.FAILED,
        )
      }
    }
  }

  private async syncDropCables() {
    logger.info('Syncing drop cables...')
    const dropCables = await ispService.getDropCables()
    const processed = await Sync.find({
      type: SyncType.DROP_CABLE,
      status: SyncStatus.SUCCESS,
    }).select('externalId')
    const processedIds = processed.map((processedId) => processedId.externalId)

    const dropCablesToSync = dropCables.filter(
      (dropCable) => !processedIds.includes(`drop-cable-${dropCable.id}`),
    )
    logger.info(
      `Found ${dropCablesToSync.length} new or failed drop cables to sync.`,
    )

    for (const dropCable of dropCablesToSync) {
      const externalId = `drop-cable-${dropCable.id}`
      try {
        const ozmapDropCable =
          transformationService.transformDropCable(dropCable)
        await ozmapService.sendDropCable(ozmapDropCable)
        await this.updateSyncStatus(
          externalId,
          SyncType.DROP_CABLE,
          SyncStatus.SUCCESS,
        )
      } catch (error) {
        logger.error(`Failed to sync drop cable ${externalId}`, error)
        await this.updateSyncStatus(
          externalId,
          SyncType.DROP_CABLE,
          SyncStatus.FAILED,
        )
      }
    }
  }

  private async updateSyncStatus(
    externalId: string,
    type: SyncType,
    status: SyncStatus,
  ) {
    await Sync.updateOne(
      { externalId, type },
      { $set: { status, updatedAt: new Date() } },
      { upsert: true },
    )
  }
}

export const syncService = new SyncService()
