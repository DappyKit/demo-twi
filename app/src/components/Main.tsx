import React from 'react'
import Menu from './Menu'
import Feed from './Feed'
import RightSidebar from './RightSidebar'

const Main: React.FC = () => {
    return (
        <div className="container-xxl">
            <div className="row">
                <Menu/>
                <Feed/>
                <RightSidebar/>
            </div>
        </div>
    )
}

export default Main

