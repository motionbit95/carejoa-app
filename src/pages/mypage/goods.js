import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { serviceKey, xmlToJson } from "../search/search";
import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiCalendar, FiPhone } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import Header from "../../component/header";

function Goods(props) {
  const location = useLocation();
  const [goodsList, setGoodsList] = useState([]);
  useEffect(() => {
    console.log(location.state.uid);
    const getUser = async (uid) => {
      fetch(
        `http://127.0.0.1:5004/motionbit-doc/us-central1/getDocument?collection=USERS&docId=${uid}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let tempList = [];
          data.goods?.forEach((item) => {
            if (item[0] === "J") {
              // 병원 일반정보를 저장한다.
              fetch(
                `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getEqpInfo2.7?serviceKey=${serviceKey}&ykiho=${item}`
              )
                .then((response) => {
                  return response?.text();
                })
                .then((result) => {
                  const parser = new DOMParser();
                  const xmlDoc = parser.parseFromString(
                    result,
                    "application/xml"
                  );

                  // XML 객체를 JSON으로 변환
                  const json = xmlToJson(xmlDoc);
                  //   console.log(json);
                  let items = json.response.body.items.item;
                  tempList.push(items);

                  if (tempList.length === data.goods.length) {
                    setGoodsList(tempList);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          });
        })
        .catch((error) => console.log(error));
    };

    getUser(location.state.uid);
  }, []);

  const deleteGoods = (idx) => {
    goodsList.splice(idx, 1);
    setGoodsList([...goodsList]);

    fetch(
      `https://us-central1-motionbit-doc.cloudfunctions.net/api/updateDocument?subCollection=USERS&documentId=${location.state.uid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goods: goodsList,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        alert("관심시설에서 삭제되었습니다.");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Stack minH={"100vh"} position={"relative"}>
      <Box position={"absolute"} top={0} left={0} right={0} />
      <Header title={"나의 관심시설"} customButton={<></>} />
      <Stack flex={1} px={4} pb={8}>
        {goodsList?.map((item, index) => (
          <Box
            p={4}
            border={"1px"}
            borderColor={"gray.200"}
            w={"full"}
            position={"relative"}
          >
            <Stack spacing={4}>
              <HStack justifyContent={"space-between"}>
                <Text fontWeight={"bold"} fontSize={"lg"}>
                  {item.yadmNm?.text}
                </Text>
              </HStack>
              <Text fontSize={"sm"} color={"gray.500"}>
                {item.addr?.text}
              </Text>
              <HStack spacing={4}>
                <HStack>
                  <Icon as={FiPhone} />
                  <Text color={"blue.500"}>{item.telno?.text}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiCalendar} />
                  <Text color={"blue.500"}>
                    {item.estbDd?.text.slice(0, 4)}-
                    {item.estbDd?.text.slice(4, 6)}-
                    {item.estbDd?.text.slice(6, 8)}
                  </Text>
                </HStack>
              </HStack>
            </Stack>
            <Box position={"absolute"} right={0} bottom={2}>
              <IconButton
                onClick={() => deleteGoods(index)}
                variant={"unstyled"}
                icon={<BsBookmarkFill size={20} color="#ecc94b" />}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default Goods;
