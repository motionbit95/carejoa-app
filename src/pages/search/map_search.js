import React, { useEffect } from "react";
import { KakaoMap } from "../../component/kakaomap";
import { serviceKey, xmlToJson } from "./search";
import { Box, Flex, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { FiCalendar, FiPhone } from "react-icons/fi";
import Header from "../../component/header";
import { useNavigate } from "react-router-dom";

function MapSearch(props) {
  const navigate = useNavigate();
  const [selectLocation, setSelectLocation] = React.useState(null);
  const [selectItem, setSelectItem] = React.useState(null);

  useEffect(() => {
    if (selectLocation) {
      console.log(selectLocation);

      if (selectLocation.id[0] === "J") {
        // 병원 일반정보를 저장한다.
        fetch(
          `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getEqpInfo2.7?serviceKey=${serviceKey}&ykiho=${selectLocation.id}`
        )
          .then((response) => {
            return response?.text();
          })
          .then((result) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(result, "application/xml");

            // XML 객체를 JSON으로 변환
            const json = xmlToJson(xmlDoc);
            console.log("test>>>>", json);
            let items = json.response.body.items.item;

            setSelectItem(items);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [selectLocation]);
  return (
    <Flex pos={"relative"} h={"full"}>
      <Flex position={"absolute"} top={0} left={0} right={0} zIndex={9999}>
        <Header title={"지도 검색"} />
      </Flex>

      <KakaoMap onSelect={(location) => setSelectLocation(location)} />
      {selectItem && (
        <Box
          id="selectItem"
          p={4}
          w={"full"}
          position={"absolute"}
          zIndex={9999}
          bottom={0}
          left={0}
          right={0}
          cursor={"pointer"}
          onClick={() =>
            navigate(
              `/detail/${
                selectLocation.id[0] === "J" ? "hospital" : "facility"
              }/${selectLocation.id}`
            )
          }
        >
          <Stack
            spacing={4}
            p={4}
            bgColor={"white"}
            borderRadius={"xl"}
            boxShadow={"lg"}
          >
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"} fontSize={"lg"}>
                {selectItem.yadmNm?.text}
              </Text>
            </HStack>
            <Text fontSize={"sm"} color={"gray.500"}>
              {selectItem.addr?.text}
            </Text>
            <HStack spacing={4}>
              <HStack>
                <Icon as={FiPhone} />
                <Text color={"blue.500"}>{selectItem.telno?.text}</Text>
              </HStack>
              <HStack>
                <Icon as={FiCalendar} />
                <Text color={"blue.500"}>
                  {selectItem.estbDd?.text.slice(0, 4)}-
                  {selectItem.estbDd?.text.slice(4, 6)}-
                  {selectItem.estbDd?.text.slice(6, 8)}
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>
      )}
    </Flex>
  );
}

export default MapSearch;
