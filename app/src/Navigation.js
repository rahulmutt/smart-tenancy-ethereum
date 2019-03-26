import React, { Component } from 'react'
import { Navbar } from 'react-bootstrap'

import logo from './images/home.svg'

export default class Navigation extends Component {

    render() {
        return (
          <Navbar fixed='top'>
            <Navbar.Brand href='/'>
              <img
                alt='smart-tenancy-logo'
                src={logo}
                width='30'
                height='30'
                className='d-inline-block align-top'
              />
              {'Smart Tenancy'}
            </Navbar.Brand>
          </Navbar> 
        )
    }

}