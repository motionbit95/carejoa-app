import { Button, Heading, Input, Stack, VStack } from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";

function Find(props) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(null);

  const sendResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("password reset email sent");
        alert("비밀번호 재설정 이메일을 전송하였습니다.");
        navigate("/login");
      })
      .catch((error) => {
        alert("가입되지 않은 이메일입니다.");
        console.log(error);
      });
  };
  return (
    <Stack minH={"100vh"} spacing={0} bgColor={"gray.50"}>
      <Stack>
        <Header title={"비밀번호 재설정"} customButton={<></>} />
      </Stack>
      <VStack w={"full"} p={4} spacing={8} pb={16}>
        <Input
          size={"lg"}
          placeholder="가입시 입력하셨던 이메일을 입력해주세요."
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Button size={"lg"} w={"full"} onClick={sendResetPassword}>
          비밀번호 재설정 이메일 전송
        </Button>
      </VStack>
    </Stack>
  );
}

export default Find;
