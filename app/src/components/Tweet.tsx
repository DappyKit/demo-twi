import React from 'react'
import { TweetData, UserProps } from './interfaces'

const Tweet: React.FC<TweetData & UserProps> = ({text, image, image_square, username, first_name, last_name}) => {
    return (
        <div className="tweet mt-5">
            <div className="row">
                <div className="col-2 col-sm-1">
                    <img src="https://placekitten.com/40/40" className="img-fluid rounded-circle"/>
                </div>
                <div className="col-10 col-sm-11">
                    <div>
                        <strong>Leela ...</strong>
                        <span>@leelan...</span>
                    </div>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus
                        totam iusto
                        laboriosam accusantium sunt dolore,
                    </p>
                    <div><img src="https://placekitten.com/500/500" className="img-fluid"/></div>
                </div>
            </div>
        </div>
    )
}

export default Tweet
