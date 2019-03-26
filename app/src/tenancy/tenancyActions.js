export const HUB_INITIALIZING = 'TENANCY_HUB_INITIALIZING'

export function hubInitializing(drizzle) {
  return {
    type: HUB_INITIALIZING,
    drizzle
  }
}

export const HUB_INITIALIZED = 'TENANCY_HUB_INITIALIZED'

export function hubInitialized(account) {
  return {
    type: HUB_INITIALIZED,
    account
  }
}

export const TENANCY_INITIALIZING = 'TENANCY_INITIALIZING'

export function tenancyInitializing(drizzle, address) {
  return {
    type: TENANCY_INITIALIZING,
    drizzle,
    address
  }
}

export const TENANCY_INITIALIZED = 'TENANCY_INITIALIZED'

export function tenancyInitialized(dataKey) {
  return {
    type: TENANCY_INITIALIZED,
    dataKey
  }
}