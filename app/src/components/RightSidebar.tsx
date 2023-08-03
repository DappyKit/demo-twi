import React from 'react'
import FollowThem from './FollowThem'

const Feed: React.FC = () => {
    return (
        <div className="col-lg-4 mt-4 d-none d-lg-block">
            <div className="position-sticky" style={{top: 0}}>
                <FollowThem/>
            </div>
        </div>
    )
}

export default Feed
