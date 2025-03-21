import React from 'react'
import Navbar from './Navbar'
import '../index.css'

class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div className="layout-container">
        <Navbar />

        <main className="content-wrapper">{children}</main>
      </div>
    )
  }
}

export default Layout
