import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'
import { Tabs, Tab } from 'react-bootstrap'

import Navigation from './Navigation'
import CreateContract from './CreateContract'

class NeitherDashboard extends Component {
  constructor(props, context) {
    super(props)
    this.createContract = context.drizzle.contracts.TenancyHub.methods.createContract
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      dataKey: ''
    }
  }

  handleSubmit({ tenant, rent, serviceRetainer, tenure }) {
      const dataKey =
       this.createContract.cacheSend(tenant, serviceRetainer, rent, tenure, 
        { from: this.props.account })
  
      this.setState({ dataKey })
  }

  render() {
    let transactionStatus = 'none'
    const { account, transactions, transactionStack } = this.props
    const { dataKey } = this.state
    if (dataKey !== '') {
      const txHash = transactionStack[dataKey] 
      if (txHash) {
        const tx = transactions[txHash]
        if (tx) {
           transactionStatus = tx.status
        }
      }
    }
    return (
      <div className="App">
        <Navigation />
        <div className="section" style={{textAlign: 'center'}}>
          <h4>It looks like you're not part of any contract yet!</h4>
          <p>Let me know whether you're a landlord or tenant by clicking on the corresponding tab below.</p>
        </div>

        <div className="section">
          <Tabs className={transactionStatus} defaultActiveKey="landlord" id="uncontrolled-tab-example">
            <Tab eventKey="landlord" title="Landlord">
              <p>Fill out the contract details and below click the button when you're done.</p>
              <p>For reference purposes, your address is <strong>{account}</strong>.</p>
              <CreateContract submit={this.handleSubmit} />
            </Tab>
            <Tab eventKey="tenant" title="Tenant">
              <p>Confirm that the landlord has created a contract with the tenant address as <strong>{account}</strong>.</p>
              <p>You will see the Tenant dashboard and not this page if he has created a contract with you.</p>
            </Tab>
          </Tabs>
        </div>
      </div>
    ) 
  }
}

NeitherDashboard.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
  return  {
    transactions: state.transactions,
    transactionStack: state.transactionStack
  }
}

export default drizzleConnect(NeitherDashboard, mapStateToProps)