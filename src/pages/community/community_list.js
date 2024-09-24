import {
  Avatar,
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Image,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import BottomNavigation from "../../component/bottom_nav";
import axios from "axios";
import { parsingDate } from "../counseling/counsel_list";
import BannerCarousel from "../../component/carousel";
import { facility } from "../search/select_typecode";

function CommunityList(props) {
  const navigate = useNavigate();
  const [reviewList, setReviewList] = React.useState([]);

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
            let list = [];
            data.forEach(async (review) => {
              fetch(
                `https://us-central1-motionbit-doc.cloudfunctions.net/api/getUserInfo?uid=${review.userId}`
              )
                .then((response) => response.json())
                .then((result) => {
                  console.log({ ...result, ...review });
                  list.push({ ...result, ...review });
                  if (list.length === data.length) {
                    setReviewList(list);
                  }
                })
                .catch((error) => console.error(error));
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
      <Flex position={"fixed"} top={0} left={0} right={0} zIndex={9999}>
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
          <TabList
            w={"full"}
            position={"sticky"}
            top={"54px"}
            pt={2}
            zIndex={9999}
            bgColor={"white"}
          >
            <Tab w={"full"}>시설소식</Tab>
            <Tab w={"full"}>이용후기</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel bgColor={"gray.100"} p={0}>
              <Stack>
                {reviewList.map((review) => (
                  <Stack key={review.id} bgColor={"white"}>
                    <HStack justifyContent={"space-between"} p={2}>
                      <HStack>
                        <Avatar src={review.photoURL} />
                        <Text>{review.displayName}</Text>
                      </HStack>
                      <Text color={"gray.500"}>
                        {parsingDate(review.createdAt)}
                      </Text>
                    </HStack>

                    <Box position={"relative"}>
                      <BannerCarousel
                        showArrows={false}
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop={true}
                      >
                        {review.urlList.map((image) => (
                          <Image
                            src={image}
                            key={image}
                            alt=""
                            objectFit={"cover"}
                            aspectRatio={1}
                          />
                        ))}
                      </BannerCarousel>
                      <Flex
                        position={"absolute"}
                        bottom={6}
                        left={0}
                        w={"full"}
                        p={4}
                      >
                        <Flex
                          bgColor={"rgba(0,0,0,0.6)"}
                          borderRadius={"full"}
                          w={"full"}
                          px={4}
                          py={2}
                        >
                          <HStack justifyContent={"space-between"} w={"full"}>
                            <HStack>
                              <Avatar />
                              <Stack spacing={0}>
                                <Text color={"white"}>
                                  {review.facility.name}
                                </Text>
                                <Text color={"white"} opacity={0.7}>
                                  {review.facility.city}{" "}
                                  {review.facility.district}
                                </Text>
                              </Stack>
                            </HStack>
                            <Icon
                              color={"white"}
                              as={FiChevronRight}
                              w={"24px"}
                              h={"24px"}
                            />
                          </HStack>
                        </Flex>
                      </Flex>
                    </Box>

                    <Text p={2} whiteSpace={"pre-line"} pb={6}>
                      {review.content}
                    </Text>
                  </Stack>
                ))}
              </Stack>
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
