import React from "react";
import SlideImage from "./SlideImage";

import "./slider.css"

export default function Slide({data: {url, title}}) {
    return (
      <div className="slider">
          <SlideImage src={url} alt={title}/>
      </div>
    );
}