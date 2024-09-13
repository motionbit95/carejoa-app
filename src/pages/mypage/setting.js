import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { auth } from "../../firebase/config";

function Setting(props) {
  const [formData, setFormData] = React.useState({
    name: null,
    email: null,
    confirmPassword: null,
    password: null,
  });

  const [defaultValue, setDefaultValue] = React.useState({
    name: null,
    email: null,
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setDefaultValue({
          ...defaultValue,
          name: user.displayName,
          email: user.email,
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <Stack>
      <Stack position={"sticky"} top={0} left={0} right={0} spacing={0}>
        <Header title={"계정설정"} customButton={<></>} />
      </Stack>

      <VStack w={"full"} p={4} spacing={8}>
        <Avatar size={"xl"} />

        <Stack spacing={4} w={"full"}>
          <FormControl>
            <FormLabel>이름</FormLabel>

            <Input
              defaultValue={defaultValue.name}
              placeholder="활동명을 입력해주세요."
              variant={"flushed"}
              maxLength={20}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <FormHelperText textAlign={"right"}>
              {formData.name ? formData.name?.length : 0} / 20
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
              isReadOnly
              placeholder="이메일을 입력해주세요."
              type="email"
              defaultValue={defaultValue.email}
              variant={"flushed"}
              maxLength={20}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>비밀번호 변경</FormLabel>
            <Stack>
              <Input
                placeholder="현재 비밀번호를 입력해주세요."
                type="password"
                variant={"flushed"}
                maxLength={20}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <Input
                placeholder="변경할 비밀번호를 입력해주세요."
                type="password"
                variant={"flushed"}
                maxLength={20}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Stack>
          </FormControl>
          <HStack divider={<StackDivider />} py={8}>
            <Text color={"gray.500"} variant={"unstyled"}>
              로그아웃
            </Text>
            <Text color={"gray.500"} variant={"unstyled"}>
              탈퇴하기
            </Text>
          </HStack>
        </Stack>
      </VStack>

      <Flex position={"fixed"} bottom={0} left={0} right={0}>
        <Button
          isDisabled={
            !(formData.name !== defaultValue.name) &&
            !(
              formData.confirmPassword &&
              formData.password &&
              formData.confirmPassword === formData.password
            )
          }
          borderRadius={0}
          w={"full"}
          colorScheme="blue"
          height={"60px"}
          onClick={() => console.log(formData)}
        >
          저장하기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Setting;
