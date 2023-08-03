import React, { useState, useEffect } from 'react'
import Tweet from './Tweet'
import { interleavePosts, posts, publicKeys } from '../data'

const Feed: React.FC = () => {
    const [items, setItems] = useState(() => interleavePosts(publicKeys, posts))

    useEffect(() => {
        setItems(interleavePosts(publicKeys, posts).slice(0, 30))
    }, [publicKeys, posts])

    return (
        <div className="col-10 col-lg-7 col-xl-6">
            <div className="row align-items-center mt-3">
                <div className="col">
                    <strong className="fs-4">Home</strong>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    {items.map((item, id) => {
                        // Check if the post is the fifth one. If not, pass empty URLs for image and image_square.
                        if ((id + 1) % 5 !== 0) {
                            item['1-jpg'] = '';
                            item['1-square-jpg'] = '';
                        }
                        return <Tweet key={id} id={id.toString()} text={item.text} image={item['1-jpg']}
                                      image_square={item['1-square-jpg']}
                                      first_name="Test" last_name="User" username="testuser"
                                      tweets={[]}/>
                    })}

                </div>
            </div>
        </div>
    )
}

export default Feed
