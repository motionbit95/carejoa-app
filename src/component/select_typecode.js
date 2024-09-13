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
  Heading,
  IconButton,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FiChevronDown, FiMap, FiSearch } from "react-icons/fi";
import { adminPttnCd, cities, districts, siDoCd, siGunGuCd } from "../data";
import { KakaoMapLocation } from "./kakaomap";

export const facility = {
  요양병원: [""],
  요양원: ["A01", "A02", "A03"],
  노인요양공동생활가정: ["A04", "S41"],
  재가노인복지시설: ["B01", "B02", "B03", "B04", "B05"],
  재가장기요양기관: ["C01", "C02", "C03", "C04", "C05"],
  방문요양: ["B01", "C01"],
  방문목욕: ["B02", "C02"],
  주야간보호: ["B03", "C03"],
  단기보호: ["B04", "C04"],
  방문간호: ["B05", "C05"],
  치매전담실: [
    "G31",
    "G32",
    "G33",
    "G34",
    "G35",
    "G36",
    "H31",
    "H32",
    "H33",
    "I31",
    "I32",
    "I33",
    "M31",
    "M32",
    "M33",
    "M34",
    "S41",
  ],
};

function SelectTypeCode(props) {
  // 검색할 시설 종류
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("bottom");

  const [selectType, setSelectType] = React.useState(props.selectType);

  return (
    <>
      <Button
        {...props}
        as="a"
        target="_blank"
        variant="outline"
        rightIcon={<FiChevronDown />}
        onClick={onOpen}
      >
        {props.selectType}
      </Button>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">시설형태 선택</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <Grid templateColumns="repeat(2, 1fr)" p={4} gap={4}>
              {Object.keys(facility).map((key) => {
                return (
                  <GridItem key={key} cursor={"pointer"}>
                    <Button
                      w={"100%"}
                      colorScheme={selectType === key ? "blue" : "gray"}
                      onClick={() => {
                        setSelectType(key);
                      }}
                    >
                      {key}
                    </Button>
                  </GridItem>
                );
              })}
            </Grid>
          </DrawerBody>
          <DrawerFooter>
            <ButtonGroup w={"100%"} justifyContent={"space-between"}>
              <Button
                w={"100%"}
                size={"lg"}
                colorScheme="blue"
                onClick={() => {
                  props.setType(selectType);
                  onClose();
                }}
              >
                시설형태 설정 완료
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SelectTypeCode;
