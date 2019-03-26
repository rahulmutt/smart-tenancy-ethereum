import React, { Component } from 'react'
import { DrizzleProvider } from 'drizzle-react'
import { LoadingContainer } from 'drizzle-react-components'

import './App.css'

import store from './store'
import options from './drizzleOptions'
import MasterComponent from './MasterComponent'

class App extends Component {
  render() {
    return (
       <DrizzleProvider options={options} store={store}>
        <LoadingContainer> 
          <MasterComponent />
        </LoadingContainer>
       </DrizzleProvider>
      )
    }
  }
  
  export default App
  