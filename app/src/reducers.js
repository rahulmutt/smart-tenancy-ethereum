import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import tenancy from './tenancy/tenancyReducer'

const reducer = combineReducers({
  ...drizzleReducers,
  tenancy
})

export default reducer
