import { Flex, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import BottomNavigation from "../../component/bottom_nav";
import { useNavigate } from "react-router-dom";
import Banner from "./banner";
import Category from "./category";

function Home(props) {
  const [page, setPage] = React.useState(
    window.location.pathname.split("/").pop()
  );
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/" + page);
  }, [page]);
  return (
    <Stack>
      <Flex position={"fixed"} top={0} left={0} right={0}>
        <Header setLocation={(city, district) => console.log(city, district)} />
      </Flex>
      {page === "home" && (
        <Stack pt={"60px"} pb={"80px"} px={2}>
          <Banner />
          <Category onChange={(e) => console.log(e)} />
        </Stack>
      )}
      <Flex position={"fixed"} bottom={0} left={0} right={0}>
        <BottomNavigation page={page} onChange={setPage} />
      </Flex>
    </Stack>
  );
}

export default Home;
