import { Flex, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import BottomNavigation from "../../component/bottom_nav";
import { useNavigate } from "react-router-dom";
import Banner from "./banner";
import Category from "./category";

function Home(props) {
  return (
    <Stack minH={"100vh"} position={"relative"}>
      <Flex position={"sticky"} top={0} left={0} right={0} zIndex={9999}>
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
      <Stack px={2} flex={1}>
        <Banner />
        <Category onChange={(e) => console.log(e)} />
      </Stack>
      <Flex position={"sticky"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default Home;
