import React, { Component } from 'react'
import { Card } from 'react-bootstrap'

import PaymentProgress from './PaymentProgress'
import TerminateContract from './TerminateContract'

export default class ActivePhase extends Component {
    render() {
      const { role, buttonize, tenure, terminate } = this.props
      return (
        <Card>
          <PaymentProgress role={role} buttonize={buttonize} size={tenure} />
          <TerminateContract terminate={terminate} />
        </Card>
      )
    }
}