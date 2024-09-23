import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import { FiX } from "react-icons/fi";

function ImageUploader(props) {
  return (
    <Box
      width="100%"
      overflowX="auto"
      whiteSpace="nowrap" // 박스가 줄바꿈 없이 가로로 쌓이도록 설정
    >
      <HStack justifyContent={"flex-start"}>
        {props.imageList?.map((_, index) => (
          <Box
            key={index}
            minW={"100px"}
            width="100px" // 박스의 최소 가로 크기
            height="100px"
            overflow={"hidden"}
            borderRadius={"md"}
            position={"relative"}
          >
            <IconButton
              size={"xs"}
              borderRadius={"full"}
              position={"absolute"}
              top={1}
              right={1}
              colorScheme="red"
              // as={FiX}
              icon={<Icon as={FiX} />}
              onClick={() => props.removeImage(index)}
            />
            <Image
              w={"full"}
              h={"full"}
              objectFit="cover"
              src={props.imageList[index].url}
            />
          </Box>
        ))}
      </HStack>
    </Box>
  );
}

export default ImageUploader;
