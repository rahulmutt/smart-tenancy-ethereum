import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'

import { Role, Event } from './constants'
import SignPhase from './SignPhase'
import ActivePhase from './ActivePhase'
import ExpiredPhase from './ExpiredPhase'

class UserDashboardAction extends Component {

  constructor(props, context) {
    super(props)
    const { approve, depositRent, withdrawRent, terminate, withdrawBalance } 
      = context.drizzle.contracts.Tenancy.methods
    this.approve = approve
    this.depositRent = depositRent
    this.withdrawRent = withdrawRent
    this.terminate = terminate
    this.withdrawBalance = withdrawBalance

    this.handleSign = this.handleSign.bind(this)
    this.handleTerminate = this.handleTerminate.bind(this)
    this.handleWithdrawBalance = this.handleWithdrawBalance.bind(this)
  }

  handleSign(e) {
    e.preventDefault()
    const { serviceRetainer, account } = this.props
    this.approve.cacheSend({ from: account, value: serviceRetainer })
  }

  handlePayment(i, e) {
    e.preventDefault()

    const { rent, account } = this.props
    this.depositRent.cacheSend(i, { from: account, value: rent })
  }

  handleWithdraw(i, e) {
    e.preventDefault()

    const { account } = this.props
    this.withdrawRent.cacheSend(i, { from: account })
  }

  handleTerminate(e) {
    e.preventDefault()

    const { account } = this.props
    this.terminate.cacheSend({ from: account })
  }

  handleWithdrawBalance(e) {
    e.preventDefault()

    const { account } = this.props
    this.withdrawBalance.cacheSend({ from: account })
  }

  paymentMonths() {
    const time = currentTime()
    const { role, paid, startTime, withdrawn } = this.props

    return i => {
      const isLandlord = role === Role.LANDLORD
      const button = { name: i + 1, disabled: true }
      const havePaid = paid[i]
      const haveWithdrawn = withdrawn[i]
      const canPay = time >= (startTime + i * secondsInMonth)
      if (havePaid) {
        if (isLandlord) {
          if (haveWithdrawn) {
            button.variant = 'success'
          } else {
            button.class = 'primary'
            button.disabled = false
            button.action = e => this.handleWithdraw(i, e)
          }
        } else {
           button.variant = 'success'
        }
      } else if (canPay) {
        if (isLandlord) {
          button.variant = 'danger'
        } else {
          button.variant = 'primary'
          button.disabled = false
          button.action = e => this.handlePayment(i, e)
        }
      } else {
        button.variant = 'light'
      }
      return button
    }
  }

  render() {
    const { role, expired, signed, tenure,
            withdrawn, balance, serviceRetainer, paidMonths,
            tenantBalance, landlordBalance } 
      = this.props
    if (expired) {
      return (<ExpiredPhase role={role} landlordBalance={landlordBalance}
                            tenantBalance={tenantBalance} serviceRetainer={serviceRetainer}
                            balance={balance} paidMonths={paidMonths} withdrawn={withdrawn} 
                            buttonize={this.paymentMonths()} withdraw={this.handleWithdrawBalance}
                            />)
    } else if (signed) {
      return (<ActivePhase role={role} buttonize={this.paymentMonths()}
                           tenure={tenure} terminate={this.handleTerminate} />)
    } else {
      return (<SignPhase role={role} approve={this.handleSign} />)
    }
  }
}

UserDashboardAction.contextTypes = {
    drizzle: PropTypes.object
}

const currentTime = () => Math.floor((new Date().getTime()) / 1000)
const secondsInMonth = 30 * 24 * 3600

const mapStateToProps = state => {

  const events = state.contracts.Tenancy.events
  const numEvents = events.length

  let signed = false
  let expired = false
  let paid = [], withdrawn = []
  let startTime = 0
  let balance = 0
  let paidMonths = 0
  let tenantBalance = false
  let landlordBalance = false

  for (let i = 0; i < numEvents; i++) {
    const event = events[i]
    switch (event.event) {
      case Event.ContractStarted:
        startTime = parseInt(event.returnValues.timestamp)
        signed = true
        break
      case Event.RentPaid:
        paid[parseInt(event.returnValues.monthIndex)] = true
        break
      case Event.RentWithdrawn:
        withdrawn[parseInt(event.returnValues.monthIndex)] = true
        break
      case Event.ContractTerminated:
        paidMonths = parseInt(event.returnValues.paidMonths)
        balance = parseInt(event.returnValues.balance)
        expired = true
        break
      case Event.LandlordBalanceWithdrawn:
        landlordBalance = true
        break
      case Event.TenantBalanceWithdrawn:
        tenantBalance = true
        break
      default:
        console.log('INVALID EVENT: ' + event.event)
    }
  }
  return { signed, startTime, expired, paid, withdrawn, 
           paidMonths, balance, tenantBalance, landlordBalance }
}

export default drizzleConnect(UserDashboardAction, mapStateToProps)