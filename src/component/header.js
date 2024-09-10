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
} from "@chakra-ui/react";
import React from "react";
import { FiChevronDown, FiMap, FiSearch } from "react-icons/fi";
import { cities, districts } from "../data";

function Header(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("bottom");
  const [selectCity, setSelectCity] = React.useState("전체");
  const [selectDistrict, setSelectDistrict] = React.useState("전체");

  const handleReset = () => {
    setSelectCity("전체");
    setSelectDistrict("전체");
  };
  return (
    <HStack
      w={"full"}
      p={2}
      justifyContent={"space-between"}
      borderBottom={"1px solid #d9d9d9"}
      bgColor={useColorModeValue("white", "gray.800")}
    >
      <Heading size={"md"} color={"blue.500"}>
        CareJOA
      </Heading>
      <HStack>
        <Button
          as="a"
          target="_blank"
          variant="outline"
          rightIcon={<FiChevronDown />}
          onClick={onOpen}
        >
          {selectDistrict === "전체" ? selectCity : selectDistrict}
        </Button>
        <HStack spacing={0}>
          <IconButton icon={<FiSearch />} variant={"ghost"} />
          <IconButton icon={<FiMap />} variant={"ghost"} />
        </HStack>
      </HStack>

      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">관심지역설정</DrawerHeader>
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
                onClick={handleReset}
              >
                초기화
              </Button>
              <Button
                w={"100%"}
                size={"lg"}
                colorScheme="blue"
                onClick={() => {
                  props.setLocation(selectCity, selectDistrict);
                  onClose();
                }}
              >
                관심지역 설정 완료
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
}

export default Header;
