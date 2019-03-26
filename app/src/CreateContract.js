import React, { Component } from 'react'
import { Form, Col, Button } from 'react-bootstrap'

const TENANT_ADDRESS = 0
const RENT = 1
const SERVICE_RETAINER = 2
const TENURE = 3

export default class CreatContract extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            tenant: '',
            rent: 0,
            serviceRetainer: 0,
            tenure: 0
        }
    }

    handleChange(e, type) {
      const value = e.target.value
      let update
      switch(type) {
        case TENANT_ADDRESS:
          update = {tenant: value}
          break
        case RENT:
          update = {rent: parseInt(value)}
          break
        case SERVICE_RETAINER:
          update = {serviceRetainer: parseInt(value)}
          break
        case TENURE:
          update = {tenure: parseInt(value)}
          break
        default:
          update = {}
          break
      }
      this.setState(update)
    }
  
    handleSubmit(e) {
      e.preventDefault()
      const { tenant, rent, serviceRetainer, tenure } = this.state
      this.props.submit({ tenant, rent, serviceRetainer, tenure })
    }

    render() {
        return (
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Tenant Address</Form.Label>
              <Form.Control value={this.state.tenant} onChange={e => this.handleChange(e, TENANT_ADDRESS)} />
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Rent (wei)</Form.Label>
                <Form.Control value={this.state.rent} onChange={e => this.handleChange(e, RENT)} />
              </Form.Group>
                  <Form.Group as={Col}>
                <Form.Label>Security Retainer (wei)</Form.Label>
                <Form.Control value={this.state.serviceRetainer} onChange={e => this.handleChange(e, SERVICE_RETAINER)} />
              </Form.Group>
            </Form.Row> 
            <Form.Group>
              <Form.Label>Term of Contract (months)</Form.Label>
              <Form.Control value={this.state.tenure} onChange={e => this.handleChange(e, TENURE)} />
            </Form.Group>
            <br/>
            <Button variant='primary' type='submit'>
              Create Contract
            </Button>
          </Form>
        )
    }
}