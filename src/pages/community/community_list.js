import {
  Circle,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import BottomNavigation from "../../component/bottom_nav";

function CommunityList(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("tab") === "news") {
      navigate("news");
    } else if (localStorage.getItem("tab") === "reviews") {
      navigate("reviews");
    } else {
      navigate("news");
    }
  }, []);

  useEffect(() => {
    const getReviews = () => {
      console.log(localStorage.getItem("tab"));
      fetch(`http://127.0.0.1:5004/motionbit-doc/us-central1/getReviews`)
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "%c검색된 리뷰 리스트",
            "background-color: yellow; color: black;"
          );
          if (data.message) {
            console.log([]);
          } else {
            console.log(data);

            data.forEach((review) => {
              const temp = { uid: review.userId };
              console.log(temp);
              fetch(
                `http://127.0.0.1:5004/motionbit-doc/us-central1/getUserInfoByUID`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(temp),
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getReviews();
  }, [localStorage.getItem("tab")]);

  return (
    <Stack bgColor={"gray.100"} minH={"100vh"}>
      <Flex position={"fixed"} top={0} left={0} right={0}>
        <Header title={"커뮤니티"} />
      </Flex>
      <Flex w={"full"} pt={"60px"} pb={"80px"} bgColor={"white"} minH={"100vh"}>
        <Tabs
          w={"full"}
          defaultIndex={localStorage.getItem("tab") === "news" ? 0 : 1}
          onChange={(e) => {
            if (e === 0) {
              navigate("news");
              localStorage.setItem("tab", "news");
            }

            if (e === 1) {
              navigate("reviews");
              localStorage.setItem("tab", "reviews");
            }
          }}
        >
          <TabList w={"full"}>
            <Tab w={"full"}>시설소식</Tab>
            <Tab w={"full"}>이용후기</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>

      <Circle
        position={"fixed"}
        bottom={"80px"}
        right={4}
        bgColor={"blue.400"}
        zIndex={"sticky"}
        shadow={"lg"}
        p={2}
        cursor={"pointer"}
        onClick={() =>
          navigate("register", {
            state: { path: window.location.pathname.split("/").pop() },
          })
        }
      >
        <FiPlus size={54} color="white" />
      </Circle>

      <Flex position={"fixed"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default CommunityList;
