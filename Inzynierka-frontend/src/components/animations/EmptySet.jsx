import React from 'react'
import Lottie from 'lottie-react'
import emptySet from '../../animations/emptySet.json'

const EmptySet = () => {
    return (
        <Lottie
            animationData={emptySet}
            loop
            autoplay
            style={{ width: 300, height: 300 }}
        />
    )
}

export default EmptySet