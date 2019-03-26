import React, { Component } from 'react'
import { Card, Button } from 'react-bootstrap'

export default class TerminateContract extends Component {

    render() {
        return (
          <Card>
            <h4>Termination</h4>
            <p>If you want to terminate the agreement and release the security deposit, click the button below.</p>
            <Button onClick={this.props.terminate}>
              Terminate Contract
            </Button>
          </Card>
        )
    }

}