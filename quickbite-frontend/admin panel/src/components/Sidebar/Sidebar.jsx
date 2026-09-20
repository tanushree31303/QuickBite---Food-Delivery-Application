import React from 'react'
import { Link } from 'react-router-dom'
import {assets} from '../../assets/assets'

const Sidebar = ({sidebarvisible}) => {
    return (
        <div className={`border-end bg-white ${sidebarvisible?'':'d-none'}`} id="sidebar-wrapper">
            <div className="sidebar-heading border-bottom bg-light">
                <img src={assets.logo} alt="" height={40} width={190} />
            </div>
            <div className="list-group list-group-flush">
                <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/add"><i className="bi bi-plus-square me-2"></i>Add Food</Link>
                <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/list"><i className="bi bi-card-list me-2"></i>List Food</Link>
                <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/orders"><i className="bi bi-basket me-2"></i>Orders</Link>
                
            </div>
        </div>
    )
}

export default Sidebar;
