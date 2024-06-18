import React from "react"

import "./slider.css"

export default function SlideImage({src, alt}) {
    return <img src={src} alt={alt} className='slider-image'/>
}

