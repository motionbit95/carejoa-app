import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  HStack,
  Progress,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import BottomNavigation from "../../component/bottom_nav";
import { useNavigate } from "react-router-dom";
import { FiFile, FiPlus } from "react-icons/fi";
import Loading from "../../component/loading";

export function parsingDate(timestamp) {
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
        `http://127.0.0.1:5004/motionbit-doc/us-central1/getCounsels?userId=${userId}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "%c검색된 상담지 리스트",
            "background-color: yellow; color: black;"
          );
          if (data.message) {
            setCounselList([]);
          } else {
            setCounselList(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getMyCounsels();
  }, []);

  function deleteCounsel(id) {
    console.log(id);
    if (window.confirm("상담지를 삭제하시겠습니까?")) {
      fetch(
        `https://us-central1-motionbit-doc.cloudfunctions.net/api/deleteDocument?subCollection=COUNSELING&documentId=${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <Stack bgColor={"gray.100"} minH={"100vh"} position={"relative"}>
      <Flex position={"sticky"} top={0} left={0} right={0}>
        <Header title={"상담 목록"} />
      </Flex>
      {counselList ? (
        <Stack flex={1}>
          {counselList?.length === 0 ? (
            <VStack p={4} spacing={8} justifyContent={"center"} minH={"500px"}>
              <VStack>
                <Circle
                  w={"120px"}
                  h={"120px"}
                  bgGradient="linear(to-r, teal.500, blue.500)" // 그라데이션 방향과 색상
                >
                  <FiFile size={64} color="white" opacity={0.9} />
                </Circle>

                <Text fontSize={"xl"} fontWeight={"bold"}>
                  요청한 상담이 없습니다.
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
              <Stack spacing={3}>
                {counselList.map((counsel, index) => (
                  <Stack
                    bgColor={"white"}
                    w={"full"}
                    divider={<StackDivider />}
                  >
                    <CounselItem counsel={counsel} key={index} />
                    <HStack divider={<StackDivider />} w={"full"} p={2} pb={4}>
                      <Box
                        color={"gray.500"}
                        fontWeight={"bold"}
                        variant={"unstyled"}
                        w={"full"}
                        textAlign={"center"}
                        cursor={"pointer"}
                        onClick={() => {
                          deleteCounsel(counsel.id);
                        }}
                      >
                        <Text>삭제</Text>
                      </Box>

                      <Box
                        color={"blue.500"}
                        fontWeight={"bold"}
                        variant={"unstyled"}
                        w={"full"}
                        textAlign={"center"}
                        cursor={"pointer"}
                        onClick={() => {
                          navigate(`view?id=${counsel.id}`, {
                            state: { counsel: counsel },
                          });
                        }}
                      >
                        <Text>자세히보기</Text>
                      </Box>
                    </HStack>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      ) : (
        <Stack flex={1}>
          <Loading />
        </Stack>
      )}
      <Circle
        position={"absolute"}
        bottom={"80px"}
        right={4}
        bgColor={"blue.400"}
        zIndex={"sticky"}
        shadow={"lg"}
        p={2}
        cursor={"pointer"}
        onClick={() => navigate("register")}
      >
        <FiPlus size={54} color="white" />
      </Circle>
      <Flex position={"sticky"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

function CounselItem(props) {
  const counsel = props.counsel;

  return (
    <Stack width={"full"} p={4}>
      <HStack justifyContent={"space-between"}>
        {/* <Text>{counsel.id}</Text> */}
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
