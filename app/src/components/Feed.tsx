import React, { useState, useEffect } from 'react'
import Tweet from './Tweet'
import { interleavePosts, PostData, posts, publicKeys } from '../data'
import { ProviderStatus, useStatus } from '../provider/StatusProvider'

const Feed: React.FC = () => {
    const [items, setItems] = useState<PostData[]>([])
    const {status} = useStatus()

    useEffect(() => {
        if (status === ProviderStatus.Followed) {
            setItems(interleavePosts(publicKeys, posts).slice(0, 30))
        }
    }, [publicKeys, posts, status])

    return (
        <div className="col-10 col-lg-7 col-xl-6">
            <div className="row align-items-center mt-3">
                <div className="col">
                    <strong className="fs-4">Home</strong>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    {items.length === 0 && (
                        <div className="alert alert-warning mt-3" role="alert">
                            <strong>Follow some people to see their updates here.</strong>
                        </div>
                    )}
                    {items.length > 0 && items.map((item, id) => {
                        // Check if the post is the fifth one. If not, pass empty URLs for image and image_square.
                        if ((id + 1) % 5 !== 0) {
                            item['1-jpg'] = ''
                            item['1-square-jpg'] = ''
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
