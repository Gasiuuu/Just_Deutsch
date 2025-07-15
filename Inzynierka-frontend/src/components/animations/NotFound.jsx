import React from 'react'
import Lottie from 'lottie-react'
import notFound from '../../animations/NotFound.json'

const NotFound = () => {
    return (
        <Lottie
            animationData={notFound}
            loop
            autoplay
            style={{ width: 300, height: 300 }}
        />
    )
}

export default NotFound