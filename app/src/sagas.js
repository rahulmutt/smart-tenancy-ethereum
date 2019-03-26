import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'

import tenancySaga from './tenancy/tenancySaga'

const ourSagas = [
    tenancySaga
]

const forkSaga = saga => fork(saga)

function* root() {
    yield all (drizzleSagas.concat(ourSagas).map(forkSaga))
}

export default root