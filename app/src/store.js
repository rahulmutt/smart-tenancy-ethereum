import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { generateContractsInitialState } from 'drizzle'
import rootSaga from './sagas'
import reducer from './reducers'
import drizzleOptions from './drizzleOptions'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions)
}

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)

export default store