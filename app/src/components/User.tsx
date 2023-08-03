import React from 'react'
import Tweet from './Tweet'
import { UserProps } from './interfaces'


/**
 * MainContent component
 * @returns JSX.Element
 */
const User: React.FC<UserProps> = (userProps: UserProps) => {
    const {first_name, last_name, username, tweets} = userProps
    return (
        <div className="container main-content">
            <div className="row">
                <div className="col profile-col">
                    <div className="profile-header">
                        <h3 className="profile-fullname"><a>{first_name} {last_name}</a></h3>
                        <h2 className="profile-element"><a>@{username}</a></h2>
                        <a className="profile-element profile-website" href="https://google.com"><i
                            className="octicon octicon-link"></i>&nbsp;google.com</a>
                        <a className="profile-element profile-website" href="https://google.com/maps"><i
                            className="octicon octicon-location"></i>&nbsp;Madeira, Portugal</a>
                        <h2 className="profile-element"><i className="octicon octicon-calendar"></i>&nbsp;Joined Today
                        </h2>
                        {/*<button className="btn btn-search-bar tweet-to-btn">Tweet to Jon Vadillo</button>*/}
                        {/*<a className="profile-element profile-website" href=""><i className="octicon octicon-file-media"></i>1,142 Photos and videos</a>*/}
                        {/*<div className="pic-grid">*/}
                        {/*  <div className="row">*/}
                        {/*    <div className="col pic-col"><img src="https://pbs.twimg.com/media/DFCq7iTXkAADXE-.jpg:thumb" height="73px" className=""></img></div>*/}
                        {/*    <div className="col pic-col"><img src="https://pbs.twimg.com/media/DEoQ0vyXoBA1cwQ.png:thumb" height="73px" className=""></img></div>*/}
                        {/*    <div className="col pic-col"><img src="https://pbs.twimg.com/media/DDVbW4RXsAAasuw.jpg:thumb" height="73px" className=""></img></div>*/}
                        {/*  </div>*/}
                        {/*  <div className="row">*/}
                        {/*    <div className="col pic-col"><img src="https://pbs.twimg.com/media/DFCq7iTXkAADXE-.jpg:thumb" height="73px" className=""></img></div>*/}
                        {/*    <div className="col pic-col"><img src="https://pbs.twimg.com/media/DEoQ0vyXoBA1cwQ.png:thumb" height="73px" className=""></img></div>*/}
                        {/*    <div className="col pic-col"><img src="https://pbs.twimg.com/media/DDVbW4RXsAAasuw.jpg:thumb" height="73px" className=""></img></div>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="col-6">
                    <ol className="tweet-list">
                        {tweets.map(item => <Tweet key={item.text} {...item} {...userProps} />)}
                    </ol>
                </div>

                <div className="col right-col">
                    <div className="content-panel">
                        <div className="panel-header">
                            <h4>Follow them all</h4>
                        </div>
                        <div className="panel-content">
                            <ol className="tweet-list">
                                <li className="tweet-card">
                                    <div className="tweet-content">
                                        <img className="tweet-card-avatar follow-all-avatar"
                                             src="https://source.unsplash.com/random/100x100?1"
                                             alt="Avatar"/>
<br/>
                                        <button className="btn btn-follow btn-follow-big">Follow</button>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
    