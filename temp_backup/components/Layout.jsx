import React from 'react'
import Navbar from './Navbar'
import '../index.css'

/**
 * 布局组件 - 提供应用程序的整体布局结构
 */
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
