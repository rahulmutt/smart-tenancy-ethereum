import { HUB_INITIALIZING, TENANCY_INITIALIZING,
         hubInitialized, tenancyInitialized } from './tenancyActions'
import { take, takeLatest, select, put } from 'redux-saga/effects'
import Tenancy from '../contracts/Tenancy'
import TenancyHub from '../contracts/TenancyHub'
import { Event } from '../constants'

function * fetchTenancyHub({ drizzle }) {
    const accounts = yield select(getAccountsState)

    if (!accounts && accounts.length <= 0) {
        console.log('No accounts found when querying the Ethereum node.' )
        return
    }

    /* We only care about the first account (for now). */
    const account = accounts[0]

    const event = {
        eventName: 'TenancyRoleAdded',
        eventOptions: {
            filter: { roleplayer: account },
            fromBlock: 0
        }
    }

    drizzle.addContract(TenancyHub, [event])

    /* Wait until contract is initialized. */
    yield take(hasTenancyHubInitialized)

    /* Convey that initialization has finished */
    yield put(hubInitialized(account))
}

function * fetchTenancyDetails({ drizzle, address }) {

    const events = 
      [Event.ContractStarted, Event.RentPaid, Event.RentWithdrawn, Event.ContractTerminated,
       Event.LandlordBalanceWithdrawn, Event.TenantBalanceWithdrawn]
       .map(eventName => ({ eventName, eventOptions: { fromBlock: 0 }}))

    const contractConfig = {
        contractName: 'Tenancy',
        web3Contract: new drizzle.web3.eth.Contract(Tenancy.abi, address)
    }

    drizzle.addContract(contractConfig, events)

    /* Wait until contract is initialized. */
    yield take(hasTenancyInitialized)

    const dataKey = drizzle.contracts.Tenancy.methods.agreement.cacheCall()

    /* Convey that initialization has finished */
    yield put(tenancyInitialized(dataKey))
}

const getAccountsState = state => state.accounts
const hasTenancyHubInitialized = action =>
     action.type === 'CONTRACT_INITIALIZED' 
  && action.name === 'TenancyHub'

const hasTenancyInitialized = action =>
     action.type === 'CONTRACT_INITIALIZED' 
  && action.name === 'Tenancy'

function * tenancySaga() {
    yield takeLatest(HUB_INITIALIZING, fetchTenancyHub)
    yield takeLatest(TENANCY_INITIALIZING, fetchTenancyDetails)
}

export default tenancySaga