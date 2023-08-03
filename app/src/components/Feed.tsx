import React from 'react'
import Tweet from './Tweet'

const Feed: React.FC = () => {
    return (
        <div className="col-10 col-lg-7 col-xl-6">
            <div className="row align-items-center mt-3">
                <div className="col">
                    <strong className="fs-4">Home</strong>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <Tweet text="" image="" image_square="" first_name="" last_name="" username="" tweets={[]}/>
                    <Tweet text="" image="" image_square="" first_name="" last_name="" username="" tweets={[]}/>
                    <Tweet text="" image="" image_square="" first_name="" last_name="" username="" tweets={[]}/>
                </div>
            </div>
        </div>
    )
}

export default Feed
