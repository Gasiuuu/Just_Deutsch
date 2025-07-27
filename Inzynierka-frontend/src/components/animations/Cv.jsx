import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import cv from '../../animations/cv.json'

const Cv = () => {

    const containerRef = useRef(null)
    const lottieRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    lottieRef.current.play()
                    observer.unobserve(entry.target)
                }
            }, {
                threshold: 0.7,
            }
        )

        if(containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => {observer.disconnect()}
    }, [])

    return (
        <div ref={containerRef}>
            <Lottie
                lottieRef={lottieRef}
                animationData={cv}
                loop={false}
                autoplay={false}
                style={{ width: 500, height: 400 }}
            />
        </div>

    )
}

export default Cv