import React from "react";
import BannerCarousel from "../../component/carousel";
import { Image } from "@chakra-ui/react";

function Advertise(props) {
  return (
    <BannerCarousel
      showArrows={false}
      showThumbs={false}
      showStatus={false}
      autoPlay={true}
      infiniteLoop={true}
    >
      <Image src={require("../../assets/banner/advertise.png")} />
      <Image src={require("../../assets/banner/advertise.png")} />
      <Image src={require("../../assets/banner/advertise.png")} />
      <Image src={require("../../assets/banner/advertise.png")} />
    </BannerCarousel>
  );
}

export default Advertise;
