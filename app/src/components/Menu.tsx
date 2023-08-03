import React from 'react'
import logo from '../img/x.png'

const Menu: React.FC = () => {
    return (
        <div className="col-2 col-lg-1 col-xl-2 border-end">
            <div
                className="left_nav_section d-flex flex-column position-sticky align-items-center align-items-xl-start"
            >
                <div>
                    <img src={logo} alt="Logo" style={{width: 35, marginTop: 16}}/>
                </div>
                <div className="my-3">
                    <i className="fa-solid fa-house fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">Home</span>
                </div>
                <div className="my-3 text-muted-opacity">
                    <i className="fa-solid fa-search fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">Search</span>
                </div>
                <div className="my-3 text-muted-opacity">
                    <i className="fa-solid fa-bell fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">Notification</span>
                </div>
                <div className="my-3 text-muted-opacity">
                    <i className="fa-solid fa-envelope fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">Message</span>
                </div>
                <div className="my-3 text-muted-opacity">
                    <i className="fa-solid fa-bookmark fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">Bookmark</span>
                </div>
                <div className="my-3 text-muted-opacity">
                    <i className="fa-solid fa-list fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">List</span>
                </div>
                <div className="my-3">
                    <i className="fa-solid fa-user fs-4 me-lg-4"></i>
                    <span className="fs-4 d-none d-xl-inline">Profile</span>
                </div>

                <div className="profile_icon position-absolute">
                    <img src="https://placekitten.com/40/40" className="img-fluid rounded-circle"/>
                </div>
            </div>
        </div>
    )
}

export default Menu
