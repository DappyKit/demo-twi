import React from 'react'
import { TweetData, UserProps } from './interfaces'

const Tweet: React.FC<TweetData & UserProps> = ({id, text, image, image_square, username, first_name, last_name}) => {
    return (
        <div className="tweet mt-5">
            <div className="row">
                <div className="col-2 col-sm-1">
                    <img src={`https://source.unsplash.com/random/40x40?sig=${id}`} className="img-fluid rounded-circle"/>
                </div>
                <div className="col-10 col-sm-11">
                    <div>
                        <strong>{first_name} {last_name}</strong>
                        <span>&nbsp;@{username}</span>
                    </div>
                    <p>
                        {text}
                    </p>
                    {image_square && <div>
                        <a href={image} target="_blank" rel="noopener noreferrer">
                            <img src={image_square} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                        </a>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Tweet
