import {
  HStack,
  useDisclosure,
  useColorModeValue,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowLeft, FiBookmark, FiMap, FiSearch } from "react-icons/fi";
import SelectLocation from "./select_location";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

function Header(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("bottom");
  const [selectCity, setSelectCity] = React.useState("전체");
  const [selectDistrict, setSelectDistrict] = React.useState("전체");

  const navigate = useNavigate();

  return (
    <HStack
      w={"full"}
      p={2}
      justifyContent={"space-between"}
      borderBottom={"1px solid #d9d9d9"}
      bgColor={useColorModeValue("white", "gray.800")}
    >
      {props.title ? (
        <Heading size={"md"}>
          <IconButton
            variant={"unstyle"}
            icon={<FiArrowLeft size={20} />}
            onClick={() => navigate(-1)}
          />
          {props.title}
        </Heading>
      ) : (
        <Heading
          size={"md"}
          color={"blue.500"}
          cursor={"pointer"}
          onClick={() => (window.location.href = "/")}
        >
          CareJOA
        </Heading>
      )}
      <HStack>
        {props.isVisibleLocation && (
          <SelectLocation
            city={selectCity}
            district={selectDistrict}
            setLocation={(city, district) => {
              setSelectCity(city);
              setSelectDistrict(district);
            }}
            setCode={(city, district) => {
              if (city) {
                console.log("시도코드 : ", city);
              }

              if (district) {
                console.log("시군구코드 : ", district.substr(2, 5));
              }
            }}
          />
        )}
        {props.customButton ? (
          props.customButton
        ) : (
          <HStack spacing={0}>
            <IconButton
              icon={<FiSearch size={20} />}
              variant={"unstyle"}
              onClick={() => navigate("/search")}
            />
            <IconButton
              icon={<FiBookmark size={20} />}
              variant={"unstyle"}
              onClick={() => {
                navigate("/goods", { state: { uid: auth.currentUser.uid } });
              }}
            />
          </HStack>
        )}
      </HStack>
    </HStack>
  );
}

export default Header;
