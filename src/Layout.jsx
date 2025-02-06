import React from 'react'
import { Outlet } from 'react-router-dom'
import Tabbar from './Tabbar'
import './Layout.css'

const Layout = () => {
  return (
    <div className='layout'>
      <Tabbar/>
      <Outlet/>
    </div>
  )
}

export default Layout
