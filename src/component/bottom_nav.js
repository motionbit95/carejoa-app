import {
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiFileText, FiHome, FiSearch, FiSmile, FiUser } from "react-icons/fi";

function BottomNavigation(props) {
  const { page, onChange } = props;
  return (
    <HStack
      bgColor={"white"}
      w={"full"}
      justifyContent={"space-around"}
      p={2}
      py={3}
      borderTop={"1px solid #d9d9d9"}
    >
      <VStack onClick={() => onChange("home")} cursor={"pointer"}>
        <Icon as={FiHome} color={page === "home" ? "blue.500" : "gray.500"} />
        <Text color={page === "home" ? "blue.500" : "gray.500"} fontSize={"sm"}>
          홈
        </Text>
      </VStack>
      <VStack onClick={() => onChange("search")} cursor={"pointer"}>
        <Icon
          as={FiSearch}
          color={page === "search" ? "blue.500" : "gray.500"}
        />
        <Text
          color={page === "search" ? "blue.500" : "gray.500"}
          fontSize={"sm"}
        >
          검색
        </Text>
      </VStack>
      <VStack onClick={() => onChange("community")} cursor={"pointer"}>
        <Icon
          as={FiSmile}
          color={page === "community" ? "blue.500" : "gray.500"}
        />
        <Text
          color={page === "community" ? "blue.500" : "gray.500"}
          fontSize={"sm"}
        >
          소식
        </Text>
      </VStack>
      <VStack onClick={() => onChange("counseling")} cursor={"pointer"}>
        <Icon
          as={FiFileText}
          color={page === "counseling" ? "blue.500" : "gray.500"}
        />
        <Text
          color={page === "counseling" ? "blue.500" : "gray.500"}
          fontSize={"sm"}
        >
          상담
        </Text>
      </VStack>
      <VStack onClick={() => onChange("mypage")} cursor={"pointer"}>
        <Icon as={FiUser} color={page === "mypage" ? "blue.500" : "gray.500"} />
        <Text
          color={page === "mypage" ? "blue.500" : "gray.500"}
          fontSize={"sm"}
        >
          마이
        </Text>
      </VStack>
    </HStack>
  );
}

export default BottomNavigation;
