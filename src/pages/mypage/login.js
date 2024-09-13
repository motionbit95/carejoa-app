import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login(props) {
  const navigate = useNavigate();
  const variable = {};

  const [state, setState] = React.useState({
    email: null,
    password: null,
  });

  const onLogin = (e) => {
    e.preventDefault();
    console.log(state);

    signInWithEmailAndPassword(auth, state.email, state.password).then(
      (user) => {
        console.log(user);
        navigate(-1);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <Stack minH={"100vh"} justifyContent={"center"}>
      <Stack position={"fixed"} top={0} left={0} right={0} spacing={0}>
        <Header title={"로그인"} customButton={<></>} />
      </Stack>

      <VStack w={"full"} p={4} spacing={8} pb={16}>
        <Heading>CareJOA</Heading>

        <form style={{ width: "100%" }} onSubmit={onLogin}>
          <Stack>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input
                id="email"
                placeholder="example@carejoa.com"
                onChange={(e) => setState({ ...state, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>비밀번호</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                onChange={(e) =>
                  setState({ ...state, password: e.target.value })
                }
              />
            </FormControl>
            <Button
              isDisabled={!state.email || !state.password}
              size={"lg"}
              type="submit"
              colorScheme="blue"
            >
              이메일 로그인
            </Button>
          </Stack>
        </form>

        <HStack
          w={"full"}
          divider={<StackDivider />}
          justifyContent={"center"}
          spacing={4}
        >
          <Text as={"button"} onClick={() => navigate("/find/email")}>
            이메일 찾기
          </Text>
          <Text as={"button"} onClick={() => navigate("/find/password")}>
            비밀번호 찾기
          </Text>
          <Text as={"button"} onClick={() => navigate("/signup")}>
            회원가입
          </Text>
        </HStack>
      </VStack>
    </Stack>
  );
}

export default Login;
