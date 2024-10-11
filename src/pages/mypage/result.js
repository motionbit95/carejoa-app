import { Button, Heading, Input, Stack, VStack } from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";

function Result(props) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(null);

  return (
    <Stack minH={"100vh"} spacing={0} bgColor={"gray.50"}>
      <Stack>
        <Header title={"결제완료"} customButton={<></>} />
      </Stack>
    </Stack>
  );
}

export default Result;
