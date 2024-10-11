import {
  Badge,
  Button,
  Circle,
  Flex,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { parsingDate } from "./counsel_list";
import { useLocation, useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { BiReceipt } from "react-icons/bi";

function CounselView(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [counsel, setCounsel] = React.useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getCounsel = async (counselId) => {
      console.log(counselId);
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/getCounsel?counselId=${counselId}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setCounsel(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (location.search) {
      // URLSearchParams 객체 생성
      const urlParams = new URLSearchParams(location.search);
      const counselId = urlParams.get("id");
      getCounsel(counselId);
    }
  }, [location.search]);

  return (
    <Stack bgColor={"gray.100"} minH={"100vh"}>
      <Flex position={"sticky"} top={0} left={0} right={0}>
        <Stack spacing={0} w={"full"}>
          <Header
            title={"상담 상세"}
            customButton={
              <Button onClick={onOpen} variant={"outline"}>
                내 상담지
              </Button>
            }
          />
          {counsel && (
            <Stack
              divider={<StackDivider />}
              spacing={4}
              bgColor={"white"}
              pb={4}
            >
              <Stack id="title" p={4}>
                <HStack>
                  <Badge colorScheme={"blue"}>요청일</Badge>
                  <Text>{parsingDate(counsel.createdAt)} </Text>
                </HStack>
                <Heading>{counsel.answers[6]} 님</Heading>
              </Stack>
              <HStack alignItems={"flex-start"} px={4}>
                <Icon as={FiInfo} m={1} mt={"5px"} />
                <Stack>
                  <Text fontWeight={"bold"} fontSize={"lg"}>
                    {counsel.state === 0
                      ? "상담요청"
                      : counsel.state === 1
                      ? "상담진행"
                      : "상담완료"}
                  </Text>
                  <Text color={"gray.500"} whiteSpace={"pre-wrap"}>
                    {counsel.state === 0
                      ? "견적이 아직 도착하지 않았어요!"
                      : counsel.state === 1
                      ? "견적이 도착했어요!\n하단 내역을 확인해주세요."
                      : "완료된 상담이예요:)"}
                  </Text>
                </Stack>
              </HStack>
            </Stack>
          )}
        </Stack>
      </Flex>

      <Stack>
        <VStack
          p={4}
          spacing={8}
          justifyContent={"center"}
          minH={"500px"}
          bgColor={"white"}
        >
          <VStack>
            <Circle
              w={"120px"}
              h={"120px"}
              bgGradient="linear(to-r, teal.500, blue.500)" // 그라데이션 방향과 색상
            >
              <BiReceipt size={64} color="white" opacity={0.9} />
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
              {"요양시설에서 받은 견적이 없습니다."}
            </Text>
          </VStack>
        </VStack>
      </Stack>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <HStack justifyContent={"space-between"} position={"relative"} p={6}>
            <Heading size={"lg"}>내 상담지</Heading>
            <ModalCloseButton />
          </HStack>
          <ModalBody>
            <Stack spacing={6} pb={8}>
              {counsel?.questions.map((value, index) => (
                <Stack>
                  <Text color={"gray.500"} key={index}>
                    {value.question}
                  </Text>
                  <Text fontWeight={"bold"} fontSize={"lg"} key={index}>
                    {counsel.answers[index]}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default CounselView;
