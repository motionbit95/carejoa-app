import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  Text,
  useDisclosure,
  Stack,
  useColorModeValue,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FiChevronDown, FiMap, FiSearch } from "react-icons/fi";
import { cities, districts, siDoCd, siGunGuCd } from "../data";
import { KakaoMapLocation } from "./kakaomap";

function SelectLocation(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("bottom");
  const [myCity, setMyCity] = React.useState("");
  const [myDistrict, setMyDistrict] = React.useState("");
  const [selectCity, setSelectCity] = React.useState(
    props.city ? props.city : "지역 선택"
  );
  const [selectDistrict, setSelectDistrict] = React.useState(
    props.district ? props.district : "지역 선택"
  );

  useEffect(() => {
    if (selectDistrict) {
      const element = document.getElementById(selectDistrict);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" }); // 해당 ID의 요소로 스크롤
      }
    }
  }, [selectDistrict]); // selectedId가 변경될 때마다 실행

  const handleReset = () => {
    setSelectCity(myCity);
    setSelectDistrict(myDistrict);
  };
  return (
    <>
      <KakaoMapLocation
        setLocation={(city, district) => {
          // console.log(city, district);
          setMyCity(city);
          setMyDistrict(district);
        }}
      />
      <Button
        {...props}
        as="a"
        target="_blank"
        variant="outline"
        rightIcon={<FiChevronDown />}
        onClick={() => {
          // console.log(props.isDisabled);
          if (!props.isDisabled) onOpen();
        }}
      >
        {props.district
          ? props.district
          : props.defaultValue
          ? props.defaultValue
          : "지역 선택"}
      </Button>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">지역 설정</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <HStack w={"100%"} alignItems={"flex-start"} spacing={0}>
              <Stack
                maxH={"500px"}
                w={"30%"}
                overflowY={"scroll"}
                bgColor={useColorModeValue("gray.100", "gray.900")}
              >
                {cities.map((city) => (
                  <Flex
                    bgColor={city === selectCity ? "blue.200" : "transparent"}
                    cursor={"pointer"}
                    p={2}
                    justifyContent={"center"}
                    key={city}
                    alignItems={"center"}
                    onClick={() => {
                      setSelectCity(city);
                      setSelectDistrict("전체");
                    }}
                  >
                    <Text>{city}</Text>
                  </Flex>
                ))}
              </Stack>
              <Stack w={"70%"} maxH={"500px"} overflowY={"scroll"}>
                {districts[selectCity]?.map((district) => (
                  <Flex
                    id={district}
                    cursor={"pointer"}
                    py={2}
                    px={8}
                    key={district}
                    bgColor={
                      district === selectDistrict ? "blue.100" : "transparent"
                    }
                    onClick={() => setSelectDistrict(district)}
                  >
                    <Text>{district}</Text>
                  </Flex>
                ))}
              </Stack>
            </HStack>
          </DrawerBody>
          <DrawerFooter>
            <ButtonGroup w={"100%"} justifyContent={"space-between"}>
              <Button
                w={"100%"}
                size={"lg"}
                variant={"outline"}
                onClick={() => {
                  handleReset();
                  //   props.setLocation("전체", "전체");
                }}
              >
                내 지역 설정
              </Button>
              <Button
                w={"100%"}
                size={"lg"}
                colorScheme="blue"
                onClick={() => {
                  // console.log(
                  //   selectCity,
                  //   siGunGuCd[selectCity][selectDistrict]
                  // );
                  props.setLocation(selectCity, selectDistrict);
                  onClose();
                }}
              >
                지역 설정 완료
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SelectLocation;
