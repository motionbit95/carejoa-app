import { Flex, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import BottomNavigation from "../../component/bottom_nav";
import { useNavigate } from "react-router-dom";
import Banner from "./banner";
import Category from "./category";

function Home(props) {
  return (
    <Stack>
      <Flex position={"fixed"} top={0} left={0} right={0}>
        <Header
          isVisibleLocation={true}
          setLocation={(city, district) => console.log(city, district)}
          setCode={(city, district) => {
            if (city) {
              console.log("시도코드 : ", city);
            }

            if (district) {
              console.log("시군구코드 : ", district.substr(2, 5));
            }
          }}
        />
      </Flex>
      <Stack pt={"60px"} pb={"80px"} px={2}>
        <Banner />
        <Category onChange={(e) => console.log(e)} />
      </Stack>
      <Flex position={"fixed"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default Home;
