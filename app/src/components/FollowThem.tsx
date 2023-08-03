import React, { useEffect, useState } from 'react'
import Joyride, { STATUS } from 'react-joyride'
import { follow } from '../SocialConnections/client'
import { followAddresses } from '../data'

const FollowThem: React.FC = () => {
    const [runTutorial, setRunTutorial] = useState(false)
    const [inProgress, setInProgress] = useState(false)

    const joyrideSteps = [
        {
            disableBeacon: true,
            target: '.happening_box',
            content: '💫 Click this button to send a 🚀 gasless transaction and connect with all of these people. After subscribing, you will be able to see all their updates.\n',
            placement: 'top' as const
        }
    ]

    const handleJoyrideCallback = (data: any) => {
        const {status} = data
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
        }
    }

    useEffect(() => {
        setRunTutorial(true)
    }, [])

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                steps={joyrideSteps}
                run={runTutorial}
                scrollToFirstStep={true}
                styles={{
                    options: {
                        zIndex: 10000,
                    }
                }}
            />

            <div className="happening_box mt-5 p-3">
                <div>
                    <h3 className="fs-3">Follow them all</h3>
                </div>

                <div className="row">
                    {[...Array(9)].map((_, i) => (
                        <div className="col-4 my-2 d-flex justify-content-center" key={i}>
                            <div
                                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                                style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
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

                {inProgress && <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Sending gasless transaction...</span>
                    </div>
                </div>}

                {!inProgress && <button className="btn btn-outline-success btn-lg w-100 mt-2" disabled={inProgress}
                                        onClick={async () => {
                                            setInProgress(true)
                                            try {
                                                await follow(followAddresses)
                                            } catch (e) {
                                                console.log('Follow error', e)
                                                alert(`Error during follow process: ${(e as Error).message}`)
                                            } finally {
                                                setInProgress(false)
                                            }
                                        }}>
                    Follow
                </button>}
            </div>
        </>
    )
}

export default FollowThem
