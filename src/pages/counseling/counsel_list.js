import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  HStack,
  Progress,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import BottomNavigation from "../../component/bottom_nav";
import { useNavigate } from "react-router-dom";
import { FiFile } from "react-icons/fi";

function parsingDate(timestamp) {
  // 밀리초를 Date 객체로 변환
  const date = new Date(timestamp);

  // YYYY.MM.DD 형식으로 변환
  const formattedDate =
    date.getFullYear() +
    "." +
    String(date.getMonth() + 1).padStart(2, "0") +
    "." +
    String(date.getDate()).padStart(2, "0");

  return formattedDate; // 2024.09.13
}

function CounselList(props) {
  const navigate = useNavigate();

  const [counselList, setCounselList] = React.useState([]);

  // 상담지 리스트 받아오기
  useEffect(() => {
    const getMyCounsels = async () => {
      const userId = "test";

      fetch(
        `http://127.0.0.1:5004/motionbit-doc/us-central1/getCounsel?userId=${userId}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCounselList(data);
        })
        .catch((error) => {
          console.log(error);
          setCounselList([]);
        });
    };

    getMyCounsels();
  }, []);

  return (
    <Stack bgColor={"gray.100"} minH={"100vh"}>
      <Flex position={"fixed"} top={0} left={0} right={0}>
        <Header title={"상담 목록"} />
      </Flex>
      <Stack pt={"52px"} pb={"80px"} height={"full"}>
        {counselList.length === 0 ? (
          <VStack p={4} spacing={8} justifyContent={"center"}>
            <VStack>
              <Circle
                w={"120px"}
                h={"120px"}
                bgGradient="linear(to-r, teal.500, blue.500)" // 그라데이션 방향과 색상
              >
                <FiFile size={64} color="white" opacity={0.9} />
              </Circle>

              <Text fontSize={"xl"} fontWeight={"bold"}>
                받은 견적이 없습니다.
              </Text>

              <Text
                fontSize={"md"}
                whiteSpace={"pre-line"}
                textAlign={"center"}
                color={"gray.500"}
              >
                {"상담지를 작성하고\n요양기관의 견적을 받아보세요."}
              </Text>
            </VStack>

            <Button
              size={"lg"}
              colorScheme="blue"
              onClick={() => navigate("register")}
            >
              무료 상담 신청하기
            </Button>
          </VStack>
        ) : (
          <>
            {/* 여기에 상담 리스트 보여주기 */}
            <Stack spacing={4}>
              {counselList.map((counsel, index) => (
                <CounselItem counsel={counsel} key={index} />
              ))}
            </Stack>
          </>
        )}
      </Stack>
      <Flex position={"fixed"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

function CounselItem(props) {
  const counsel = props.counsel;

  useEffect(() => {
    console.log(counsel.answers);
  }, []);

  return (
    <Stack width={"full"} bgColor={"white"} p={4} spacing={4}>
      <HStack justifyContent={"space-between"}>
        <Text fontWeight={"bold"} fontSize={"lg"}>
          {counsel.answers[6]} 님
        </Text>
        <Text>{parsingDate(counsel.createdAt)}</Text>
      </HStack>
      <Progress
        value={
          counsel.state === 0 ? 10 : parseInt(((counsel.state + 1) * 100) / 3)
        }
      />
      <HStack justifyContent={"space-between"}>
        <Text>상담요청</Text>
        <Text>상담진행</Text>
        <Text>상담완료</Text>
      </HStack>

      <Text>아직 받은 견적이 없어요!</Text>
    </Stack>
  );
}

export default CounselList;
