import React from "react";
import BannerCarousel from "../../component/carousel";
import { Image } from "@chakra-ui/react";

function Banner(props) {
  return (
    <BannerCarousel>
      <Image src={require("../../assets/banner/Banner1.png")} />
      <Image src={require("../../assets/banner/Banner2.png")} />
      <Image src={require("../../assets/banner/Banner3.png")} />
      <Image src={require("../../assets/banner/Banner4.png")} />
    </BannerCarousel>
  );
}

export default Banner;
