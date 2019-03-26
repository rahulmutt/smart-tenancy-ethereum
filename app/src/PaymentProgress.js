import React, { Component } from 'react'
import { ButtonGroup, Button, Card } from 'react-bootstrap'

export default class PaymentProgress extends Component {

    render() {
        const { buttonize, size } = this.props
        const buttons = Array.from(Array(size).keys()).map(i => {
            const { name, variant, action, disabled } = buttonize(i)
            return (
                <Button key={i} onClick={action} disabled={disabled} variant={variant}>{name}</Button>
            )
        })
        return (
          <Card>
            <h2>Payments</h2>
            <p>Each button represents the status of the monthly payment.</p>
            <ButtonGroup>
                {buttons}
            </ButtonGroup>
          </Card>
        )
    }
}