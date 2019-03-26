import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { drizzleConnect } from 'drizzle-react'

import { hubInitializing } from './tenancy/tenancyActions'
import NeitherDashboard from './NeitherDashboard'
import UserDashboard from './UserDashboard'

class MasterComponent extends Component {
    constructor (props, context) {
        super(props)
        this.drizzle = context.drizzle
    }

    componentDidMount() {
        this.props.initialize(this.drizzle)
    }

    render() {
        const { ready, account, events } = this.props
        if (!ready) {
            return (<div>Loading tenancy contracts...</div>)
        } 
        let restComponent
        const numEvents = events.length
        if (numEvents > 0) {
            const { returnValues: { role, tenancy } } = events[numEvents - 1]
            restComponent = (<UserDashboard account={account} role={role} tenancy={tenancy} />)
        } else {
            restComponent = (<NeitherDashboard account={account} />)
        }
        return restComponent
    }
}

MasterComponent.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {

  const props = {
    ready: state.tenancy.ready,
    account: state.tenancy.account,
  }

  const tenancyHub = state.contracts.TenancyHub

  if (tenancyHub && tenancyHub.events) {
      props.events = [...tenancyHub.events]
  }

  return props
}

const mapDispatchToProps = dispatch => {
    return {
        initialize: (drizzle) => dispatch(hubInitializing(drizzle))
    }
}

export default drizzleConnect(MasterComponent,
                              mapStateToProps,
                              mapDispatchToProps)