import React from 'react'
import Lottie from 'lottie-react'
import errorWarning from '../../animations/ErrorWarning.json'

const ErrorWarning = () => {
    return (
        <Lottie
            animationData={errorWarning}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
        />
    )
}

export default ErrorWarning