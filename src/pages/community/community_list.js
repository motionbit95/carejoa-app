import {
  Avatar,
  Box,
  Center,
  Circle,
  CircularProgress,
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
import Loading from "../../component/loading";
import { collection } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

function CommunityList(props) {
  const navigate = useNavigate();
  const [communityList, setCommunityList] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);

  useEffect(() => {
    const getUser = async (uid) => {
      fetch(
        `http://127.0.0.1:5004/motionbit-doc/us-central1/getDocument?collection=USERS&docId=${uid}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUserInfo(data);
        })
        .catch((error) => console.log(error));
    };
    auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("user is not logged in");
      } else {
        getUser(user.uid);
      }
    });
  }, []);

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
      fetch(
        `https://us-central1-motionbit-doc.cloudfunctions.net/api/getDocuments?collectionName=REVIEWS&order=createdAt`
      )
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
                    setCommunityList(list);
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

    const getNews = async () => {
      fetch(
        `https://us-central1-motionbit-doc.cloudfunctions.net/api/getDocuments?collectionName=NEWS&order=createdAt`
      )
        .then((response) => response.json())
        .then((data) => {
          let list = [];
          data.forEach(async (news) => {
            console.log(news);
            fetch(
              `https://us-central1-motionbit-doc.cloudfunctions.net/api/getUserInfo?uid=${news.userId}`
            )
              .then((response) => response.json())
              .then((result) => {
                console.log({ ...result, ...news });
                list.push({ ...result, ...news });
                if (list.length === data.length) {
                  setCommunityList(list);
                }
              })
              .catch((error) => console.error(error));
          });
        })
        .catch((error) => console.log(error));
    };

    if (localStorage.getItem("tab") === "reviews") {
      getReviews();
    } else {
      getNews();
    }
  }, [localStorage.getItem("tab")]);

  return (
    <Stack
      bgColor={"gray.100"}
      maxH={"100vh"}
      overflowY={"hidden"}
      position={"relative"}
      spacing={0}
    >
      {!communityList && <Loading />}
      <Flex position={"sticky"} top={0} left={0} right={0}>
        <Header title={"커뮤니티"} />
      </Flex>
      <Flex w={"full"} bgColor={"white"} minH={"100vh"}>
        <Tabs
          w={"full"}
          defaultIndex={localStorage.getItem("tab") === "news" ? 0 : 1}
          onChange={(e) => {
            if (e === 0) {
              setCommunityList(null);
              navigate("news");
              localStorage.setItem("tab", "news");
            }

            if (e === 1) {
              setCommunityList(null);
              navigate("reviews");
              localStorage.setItem("tab", "reviews");
            }
          }}
        >
          <TabList
            w={"full"}
            position={"sticky"}
            top={"54px"}
            left={0}
            right={0}
            pt={2}
            bgColor={"white"}
          >
            <Tab w={"full"}>시설소식</Tab>
            <Tab w={"full"}>이용후기</Tab>
          </TabList>

          <TabPanels>
            <TabPanel bgColor={"gray.100"} p={0}>
              <Stack height={"100vh"} overflowY={"scroll"} pb={"170px"}>
                {communityList?.map((review) => (
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
            <TabPanel bgColor={"gray.100"} p={0}>
              <Stack height={"100vh"} overflowY={"scroll"} pb={"170px"}>
                {communityList?.map((review) => (
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

      {(userInfo?.type === "기관회원" ||
        localStorage.getItem("tab") === "reviews") && (
        <Circle
          position={"absolute"}
          bottom={"80px"}
          right={4}
          bgColor={"blue.400"}
          zIndex={"sticky"}
          shadow={"lg"}
          p={2}
          cursor={"pointer"}
          onClick={() =>
            navigate("register", {
              state: {
                path: window.location.pathname.split("/").pop(),
                facility: userInfo.facility,
              },
            })
          }
        >
          <FiPlus size={54} color="white" />
        </Circle>
      )}

      <Flex position={"sticky"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default CommunityList;
