import React from 'react'

const FollowThem: React.FC = () => {
    return (
        <div className="happening_box mt-5 p-3">
            <div>
                <h3 className="fs-3">Follow them all</h3>
            </div>

            <div className="row">
                {[...Array(9)].map((_, i) => (
                    <div className="col-4 my-2 d-flex justify-content-center" key={i}>
                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
                            <img
                                src={`https://source.unsplash.com/random/150x150?sig=${i}`}
                                className="img-fluid rounded-circle position-absolute top-0 start-0"
                                alt="Avatar"
                                style={{objectFit: 'cover'}}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-outline-success btn-lg w-100 mt-2">Follow</button>
        </div>
    )
}

export default FollowThem
