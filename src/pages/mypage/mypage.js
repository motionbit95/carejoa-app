import {
  Avatar,
  Button,
  Circle,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FiChevronRight, FiUser } from "react-icons/fi";
import { RiCoupon2Fill } from "react-icons/ri";
import Header from "../../component/header";
import BottomNavigation from "../../component/bottom_nav";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

function MyPage(props) {
  const navigate = useNavigate();
  const [state, setState] = React.useState({ isLogin: false });
  const [user, setUser] = React.useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("user is not logged in");
        setUser(null);
        setState({ ...state, isLogin: false });
      } else {
        setUser(user);
        console.log("user is logged in", user);
        setState({ ...state, isLogin: true });
      }
    });
  }, []);
  return (
    <Stack>
      <Stack
        position={"sticky"}
        top={0}
        left={0}
        right={0}
        spacing={0}
        zIndex={9999}
      >
        <Header title={"마이페이지"} customButton={<></>} />
      </Stack>

      {state.isLogin ? (
        <Stack divider={<StackDivider />} spacing={4} p={4} flex={1}>
          {/* 프로필 */}
          <Stack spacing={4}>
            <HStack spacing={4} w={"full"} justifyContent={"space-between"}>
              <HStack>
                <Avatar size={"lg"} src={user?.photoURL} />
                <Stack w={"full"} spacing={1}>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    {user?.displayName}
                  </Text>
                  <Text color={"gray.500"} fontSize={"sm"}>
                    {user?.email}
                  </Text>
                </Stack>
              </HStack>
              <Button borderRadius={"full"} onClick={() => navigate("setting")}>
                계정설정
              </Button>
            </HStack>
            <HStack
              p={3}
              bgColor={"gray.100"}
              borderRadius={4}
              justifyContent={"space-between"}
              cursor={"pointer"}
              onClick={() => console.log("test")}
            >
              <HStack>
                <Icon as={RiCoupon2Fill} />
                <Text>쿠폰함</Text>
              </HStack>
              <Icon as={FiChevronRight} />
            </HStack>
          </Stack>

          {/* 나의활동 */}
          <Stack spacing={4}>
            <Heading size={"md"}>나의 활동</Heading>
            <HStack
              justifyContent={"space-between"}
              cursor={"pointer"}
              onClick={() => navigate("/goods", { state: { uid: user.uid } })}
            >
              <Text>관심시설</Text>
              <Icon as={FiChevronRight} />
            </HStack>
            <HStack
              justifyContent={"space-between"}
              cursor={"pointer"}
              onClick={() => navigate("/counseling")}
            >
              <Text>상담내역</Text>
              <Icon as={FiChevronRight} />
            </HStack>
            <HStack
              justifyContent={"space-between"}
              cursor={"pointer"}
              onClick={() => navigate("/review", { state: { uid: user.uid } })}
            >
              <Text>이용후기</Text>
              <Icon as={FiChevronRight} />
            </HStack>
          </Stack>

          {/* 이용내역 */}
          <Stack spacing={4}>
            <Heading size={"md"}>조아 캐시</Heading>
            <HStack justifyContent={"space-between"}>
              <Text>스토어</Text>
              <Icon as={FiChevronRight} />
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text>충전 / 사용 내역</Text>
              <Icon as={FiChevronRight} />
            </HStack>
          </Stack>

          {/* 고객센터 */}
          <Stack spacing={4}>
            <Heading size={"md"}>고객센터</Heading>
            <HStack justifyContent={"space-between"}>
              <Text>공지사항</Text>
              <Icon as={FiChevronRight} />
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text>이벤트</Text>
              <Icon as={FiChevronRight} />
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text>FAQ</Text>
              <Icon as={FiChevronRight} />
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text>가이드</Text>
              <Icon as={FiChevronRight} />
            </HStack>
          </Stack>
        </Stack>
      ) : (
        <VStack p={4} spacing={8} justifyContent={"center"} minH={"500px"}>
          <VStack>
            <Circle
              w={"120px"}
              h={"120px"}
              bgGradient="linear(to-r, teal.500, blue.500)" // 그라데이션 방향과 색상
            >
              <FiUser size={64} color="white" opacity={0.9} />
            </Circle>

            <Text fontSize={"xl"} fontWeight={"bold"}>
              로그인 후 이용해주세요.
            </Text>

            <Text
              fontSize={"md"}
              whiteSpace={"pre-line"}
              textAlign={"center"}
              color={"gray.500"}
            >
              {"케어조아 서비스를 이용하시기 위해\n로그인이 필요합니다."}
            </Text>
          </VStack>

          <Button
            size={"lg"}
            colorScheme="blue"
            onClick={() => navigate("/login")}
          >
            로그인 / 회원가입
          </Button>
        </VStack>
      )}

      <Flex position={"sticky"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default MyPage;
