import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function BannerCarousel(props) {
  return <Carousel {...props}>{props.children}</Carousel>;
}

export default BannerCarousel;
