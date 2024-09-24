import { Center, CircularProgress } from "@chakra-ui/react";
import React from "react";

function Loading(props) {
  return (
    <Center
      w={"full"}
      minH={"full"}
      position={"absolute"}
      top={0}
      alignItems={"center"}
      justifyContent={"center"}
      bgColor={"rgba(0, 0, 0, 0.5)"}
      zIndex={9999}
    >
      <CircularProgress isIndeterminate color="blue.300" />
    </Center>
  );
}

export default Loading;
