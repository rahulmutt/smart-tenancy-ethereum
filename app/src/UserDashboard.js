import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap'

import { tenancyInitializing } from './tenancy/tenancyActions'
import UserDashboardAction from './UserDashboardAction'
import Navigation from './Navigation'

class UserDashboard extends Component {
  constructor(props, context) {
    super(props)
    this.drizzle = context.drizzle
  }

  componentDidMount() {
    this.props.initialize(this.drizzle, this.props.tenancy)
  }

  otherDetails() {
    const { account, agreement: { landlord, tenant } } = this.props
    const isLandlord = landlord === account
    let title, otherTitle, otherAddress
    if (isLandlord) {
      title = 'Landlord'
      otherTitle = 'Tenant'
      otherAddress = tenant
    } else {
      title = 'Tenant'
      otherTitle = 'Landlord'
      otherAddress = landlord
    }
    return { title, otherTitle, otherAddress }
  }

  render() {
    const { account, agreement, role } = this.props
    if (agreement) {
      const { serviceRetainer, months, rent } = agreement
      const { title, otherTitle, otherAddress } = this.otherDetails()
      return (
         <div className='App'>
          <Navigation />
          <Container>
            <Row>
              <Col xs={4}>
                <Card>
                  <h4>Contract Details</h4>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <p><strong>You</strong></p>
                      <p>{title}</p> 
                      <p>{account}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p><strong>{otherTitle}</strong></p> 
                      <p>{otherAddress}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p><strong>Rent</strong></p>
                      <p>{rent} wei</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p><strong>Service Retainer</strong></p>
                      <p>{serviceRetainer} wei</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p><strong>Term of Contract</strong></p>
                      <p>{months} months</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              <Col>
                <UserDashboardAction account={account} role={role}
                                    tenure={months} serviceRetainer={serviceRetainer} 
                                    rent={rent} />
              </Col>
            </Row>
          </Container>
        </div>
      )
    } else {
      return (<div>{account} Loading tenancy...</div>)
    }
  }
}

UserDashboard.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
  let agreement = undefined
  const dataKey = state.tenancy.dataKey
  if (dataKey) {
    const cached = state.contracts.Tenancy.agreement[dataKey]
    if (cached) {
      agreement = cached.value
      agreement.months = parseInt(agreement.months)
    }
  }
  return {
    agreement
  }
}

const mapDispatchToProps = dispatch => {
    return {
        initialize: (drizzle, address) => dispatch(tenancyInitializing(drizzle, address))
    }
}

export default drizzleConnect(UserDashboard,
                              mapStateToProps,
                              mapDispatchToProps)