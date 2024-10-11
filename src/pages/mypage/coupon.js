import {
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";

function Coupon(props) {
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
        <Header title={"쿠폰"} customButton={<></>} />
      </Stack>
      <Flex w={"full"} bgColor={"white"} minH={"100vh"}>
        <Tabs>
          <TabList
            w={"full"}
            position={"sticky"}
            top={"54px"}
            left={0}
            right={0}
            pt={2}
            bgColor={"white"}
          >
            <Tab w={"full"}>시설소식</Tab>
            <Tab w={"full"}>이용후기</Tab>
          </TabList>

          <TabPanels>
            <TabPanel bgColor={"gray.100"} p={0}></TabPanel>
            <TabPanel bgColor={"gray.100"} p={0}></TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Stack>
  );
}

export default Coupon;
