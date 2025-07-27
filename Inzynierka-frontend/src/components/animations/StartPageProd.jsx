import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import startPageProd from '../../animations/StartPageProd.json'

const StartPageProd = () => {

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
                animationData={startPageProd}
                loop={false}
                autoplay={false}
                style={{ width: 500, height: 500 }}
            />
        </div>

    )
}

export default StartPageProd