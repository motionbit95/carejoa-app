import {
  HStack,
  useDisclosure,
  useColorModeValue,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { FiMap, FiSearch } from "react-icons/fi";
import SelectLocation from "./select_location";

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
        <SelectLocation
          city={selectCity}
          district={selectDistrict}
          setLocation={(city, district) => {
            setSelectCity(city);
            setSelectDistrict(district);
          }}
        />
        <HStack spacing={0}>
          <IconButton icon={<FiSearch />} variant={"ghost"} />
          <IconButton icon={<FiMap />} variant={"ghost"} />
        </HStack>
      </HStack>
    </HStack>
  );
}

export default Header;
