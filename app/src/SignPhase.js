import React, { Component } from 'react'
import { Card, Form, Button } from 'react-bootstrap'

import { Role } from './constants'

export default class SignPhase extends Component {

  render() {
    const { role } = this.props
    if (role === Role.LANDLORD) {
      return (
        <Card>The contract is currently pending. Please wait for the tenant to sign.</Card>
      )
    } else {
      return (
        <Card>
          <p>Please verify that the landlord and details are correct.</p>
          <p>By clicking the button below, you agree to all the terms and transfer the security retainer.</p>
          <Form onSubmit={this.props.approve}>
            <Button variant='dark' type='submit'>
              Sign Contract
            </Button>
          </Form>
        </Card>
      )
    }
  }
}