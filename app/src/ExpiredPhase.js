import React, { Component } from 'react'
import { Button, Card } from 'react-bootstrap'

import PaymentProgress from './PaymentProgress'
import { Role } from './constants'

export default class ExpiredPhase extends Component {

    calculateState() {
      const { role, landlordBalance, tenantBalance, serviceRetainer,
              balance } = this.props
      let finalBalance
      let canWithdraw
      const isLandlord = role === Role.LANDLORD
      if (isLandlord) {
        finalBalance = balance
        canWithdraw = !landlordBalance
      } else {
        canWithdraw = !tenantBalance
        finalBalance = serviceRetainer - balance
      }
      return { finalBalance, canWithdraw }
    }

    render() {
      const { paidMonths, buttonize, role, withdraw } = this.props
      const { finalBalance, canWithdraw } = this.calculateState()
      let remainingMessage
      if (finalBalance > 0 && canWithdraw) {
        remainingMessage = (
          <Card>
            <p>The contract has terminated and there is some balance remaining. Click below to withdraw.</p>
            <Button variant='primary' onClick={withdraw}>
              Withdraw Balance
            </Button>
          </Card>
        )
      } else {
        remainingMessage = (
          <Card>
             <p>The contract has expired.</p>
          </Card>
        )
      }
      return (
          <Card>
              <PaymentProgress role={role} buttonize={buttonize} size={paidMonths} />
              <br/>
              <br/>
              {remainingMessage}
          </Card>
      )
    }
}