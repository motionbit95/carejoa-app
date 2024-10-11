import {
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";

function Payment(props) {
  const navigate = useNavigate();
  const [totalData, setTotalData] = React.useState([]);
  const [paidData, setPaidData] = React.useState([]);
  const [usedData, setUsedData] = React.useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/getPaymentList?uid=${user.uid}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setPaidData(data);
          })
          .catch((error) => console.log(error));
      } else {
        console.log("user is not logged in");
      }
    });
  }, []);

  useEffect(() => {
    setTotalData(paidData.sort((a, b) => b.paidAt - a.paidAt));
  }, [paidData]);

  return (
    <Stack minH={"100vh"} spacing={0} bgColor={"white"}>
      <Stack>
        <Header title={"충전 및 사용내역"} customButton={<></>} />
      </Stack>
      <Stack w={"full"} spacing={8} pb={16} p={4}>
        <Tabs variant={"soft-rounded"} size={"sm"}>
          <TabList
            position={"sticky"}
            top={"54px"}
            left={0}
            right={0}
            pt={2}
            gap={2}
          >
            <Tab border={"1px solid "} borderColor={"gray.200"}>
              전체
            </Tab>
            <Tab border={"1px solid "} borderColor={"gray.200"}>
              충전
            </Tab>
            <Tab border={"1px solid "} borderColor={"gray.200"}>
              사용
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel bgColor={"gray.100"} p={0}>
              <Stack w={"full"} p={4} bgColor={"white"} borderRadius={"lg"}>
                {totalData?.map((data, index) => {
                  return (
                    <Stack>
                      {new Date(
                        totalData[index].paidAt
                      ).toLocaleDateString() !==
                        (index === 0
                          ? ""
                          : new Date(
                              totalData[index - 1].paidAt
                            ).toLocaleDateString()) && <Divider />}
                      <HStack>
                        <HStack w={"40%"}>
                          {new Date(
                            totalData[index].paidAt
                          ).toLocaleDateString() !==
                            (index === 0
                              ? ""
                              : new Date(
                                  totalData[index - 1].paidAt
                                ).toLocaleDateString()) && (
                            <Text fontSize={"sm"}>
                              {new Date(data.paidAt).toLocaleDateString()}
                            </Text>
                          )}
                        </HStack>
                        <HStack w={"full"} justifyContent={"space-between"}>
                          <Stack fontSize={"sm"}>
                            {/* <Text>
                          {new Date(data.paidAt).toLocaleDateString()}{" "}
                        </Text> */}
                            <Text>
                              {new Date(data.paidAt).toLocaleTimeString()}
                            </Text>
                          </Stack>

                          <Text color={"blue.400"} fontWeight={"bold"}>
                            +{parseInt(data.cash)?.toLocaleString()}캐시
                          </Text>
                        </HStack>
                      </HStack>
                    </Stack>
                  );
                })}
              </Stack>
            </TabPanel>
            <TabPanel bgColor={"gray.100"} p={0}>
              <Stack w={"full"} p={4} bgColor={"white"} borderRadius={"lg"}>
                {paidData?.map((data, index) => {
                  return (
                    <Stack>
                      {new Date(paidData[index].paidAt).toLocaleDateString() !==
                        (index === 0
                          ? ""
                          : new Date(
                              paidData[index - 1].paidAt
                            ).toLocaleDateString()) && <Divider />}
                      <HStack>
                        <HStack w={"40%"}>
                          {new Date(
                            paidData[index].paidAt
                          ).toLocaleDateString() !==
                            (index === 0
                              ? ""
                              : new Date(
                                  paidData[index - 1].paidAt
                                ).toLocaleDateString()) && (
                            <Text fontSize={"sm"}>
                              {new Date(data.paidAt).toLocaleDateString()}
                            </Text>
                          )}
                        </HStack>
                        <HStack w={"full"} justifyContent={"space-between"}>
                          <Stack fontSize={"sm"}>
                            {/* <Text>
                          {new Date(data.paidAt).toLocaleDateString()}{" "}
                        </Text> */}
                            <Text>
                              {new Date(data.paidAt).toLocaleTimeString()}
                            </Text>
                          </Stack>

                          <Text color={"blue.400"} fontWeight={"bold"}>
                            +{parseInt(data.cash)?.toLocaleString()}캐시
                          </Text>
                        </HStack>
                      </HStack>
                    </Stack>
                  );
                })}
              </Stack>
            </TabPanel>
            <TabPanel bgColor={"gray.100"} p={0}>
              <Stack w={"full"} p={4} bgColor={"white"} borderRadius={"lg"}>
                {usedData?.map((data, index) => {
                  return (
                    <Stack>
                      {new Date(usedData[index].paidAt).toLocaleDateString() !==
                        (index === 0
                          ? ""
                          : new Date(
                              usedData[index - 1].paidAt
                            ).toLocaleDateString()) && <Divider />}
                      <HStack>
                        <HStack w={"40%"}>
                          {new Date(
                            usedData[index].paidAt
                          ).toLocaleDateString() !==
                            (index === 0
                              ? ""
                              : new Date(
                                  usedData[index - 1].paidAt
                                ).toLocaleDateString()) && (
                            <Text fontSize={"sm"}>
                              {new Date(data.paidAt).toLocaleDateString()}
                            </Text>
                          )}
                        </HStack>
                        <HStack w={"full"} justifyContent={"space-between"}>
                          <Stack fontSize={"sm"}>
                            {/* <Text>
                          {new Date(data.paidAt).toLocaleDateString()}{" "}
                        </Text> */}
                            <Text>
                              {new Date(data.paidAt).toLocaleTimeString()}
                            </Text>
                          </Stack>

                          <Text color={"blue.400"} fontWeight={"bold"}>
                            +{parseInt(data.cash)?.toLocaleString()}캐시
                          </Text>
                        </HStack>
                      </HStack>
                    </Stack>
                  );
                })}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Stack>
  );
}

export default Payment;
