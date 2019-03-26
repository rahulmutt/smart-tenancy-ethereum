import { HUB_INITIALIZED, TENANCY_INITIALIZED } from './tenancyActions'

const initialState = {
  ready: false
}

const tenancyReducer = (state = initialState, action) => {
  switch (action.type) {
    case HUB_INITIALIZED:
      return {
        ...state,
        ready: true,
        account: action.account
      }
    case TENANCY_INITIALIZED:
      return {
        ...state,
        dataKey: action.dataKey
      }
    default:
      return state
  }
}

export default tenancyReducer