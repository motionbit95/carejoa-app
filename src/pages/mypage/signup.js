import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
import RadioButtonGroup from "../../component/radiobuttongroup";
import { serviceKey, xmlToJson } from "../search/search";
import AutoComplete from "../../component/autocomplete";
import Header from "../../component/header";

function SignUp(props) {
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [userInfo, setUserInfo] = React.useState({
    email: null,
    password: null,
    type: "개인회원",
  });
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [facility, setFacility] = React.useState({
    code: "",
    type: "요양병원",
    name: "",
    city: "",
    district: "",
    addr: "",
  });

  const [isValid, setIsValid] = React.useState(false);

  function generateRandomUsername() {
    const base = "유저"; // 고정 문자열
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 10000~99999 사이의 랜덤 숫자 생성
    return `${base}${randomNumber}`;
  }

  const handleSubmit = () => {
    if (userInfo.password !== confirmPassword) {
      alert("패스워드가 일치하지 않습니다.");
      return;
    }

    let username;

    // console.log(username);
    // console.log(userInfo.email);
    // console.log(userInfo.password);
    // console.log(userInfo.type);
    console.log(facility);

    if (userInfo.type === "개인회원") {
      username = generateRandomUsername();
    } else {
      username = facility.name;
    }

    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        updateProfile(auth.currentUser, {
          displayName: username,
        }).then(() => {
          console.log("profile updated");
        });

        fetch(`${process.env.REACT_APP_SERVER_URL}/addUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            type: userInfo.type,
            facility: facility,
          }),
        })
          .then(() => {
            console.log("user added");
          })
          .catch((error) => {
            console.log(error);
          });

        console.log(user);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkFacility = (code) => {
    const url = `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getEqpInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`;

    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(result, "application/xml");

        // XML 객체를 JSON으로 변환
        const json = xmlToJson(xmlDoc);
        let items = json.response.body.items.item;

        console.log(items);
        setFacility({
          ...facility,
          addr: items.addr.text,
        });

        setIsValid(true);
        alert("유효한 기관코드입니다.");
      })
      .catch((error) => {
        console.log(error);
        setIsValid(false);
        alert("유효하지 않은 기관코드입니다.");
      });
  };

  return (
    <Stack>
      <Stack position={"sticky"} top={0} left={0} right={0} spacing={0}>
        <Header title={"회원가입"} customButton={<></>} />
      </Stack>
      <VStack spacing={4} w={"100%"} p={4}>
        <Heading>회원가입 정보 입력</Heading>
        <Stack spacing={4} w={"100%"} p={4}>
          <FormControl isRequired>
            <FormLabel>회원 구분</FormLabel>
            <RadioButtonGroup
              list={["개인회원", "기관회원"]}
              defaultValue="개인회원"
              setValue={(value) => setUserInfo({ ...userInfo, type: value })}
            />
          </FormControl>
          {userInfo.type === "기관회원" ? (
            <Stack>
              <HStack>
                <Input
                  size={"lg"}
                  type="text"
                  placeholder="기관코드를 입력하세요."
                  value={facility.code}
                  onChange={(e) =>
                    setFacility({ ...userInfo, code: e.target.value })
                  }
                />
                <Button onClick={() => checkFacility(facility.code)}>
                  확인
                </Button>
              </HStack>
              <Text
                cursor={"pointer"}
                color="red.500"
                fontSize="sm"
                fontWeight="bold"
                px={2}
                textDecoration={"underline"}
                onClick={() => onOpen()}
              >
                기관코드찾기
              </Text>
            </Stack>
          ) : null}
          <FormControl isRequired>
            <FormLabel>이메일</FormLabel>
            <FormHelperText>추후 로그인 시 아이디로 사용됩니다.</FormHelperText>
            <Input
              size={"lg"}
              type="email"
              placeholder="이메일를 입력하세요."
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>패스워드</FormLabel>
            <Input
              size={"lg"}
              type="password"
              placeholder="패스워드를 입력하세요."
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>패스워드 확인</FormLabel>
            <Input
              size={"lg"}
              type="password"
              placeholder="패스워드를 확인해주세요."
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
        </Stack>
        <Button onClick={handleSubmit} w={"100%"} colorScheme="blue" size="lg">
          회원가입하기
        </Button>
        <HStack>
          <Text>이미 회원이신가요?</Text>
          <Text
            fontWeight={"bold"}
            color={"blue.500"}
            cursor={"pointer"}
            onClick={() => navigate("/login")}
            textDecoration={"underline"}
          >
            로그인하기
          </Text>
        </HStack>

        <Modal isOpen={isOpen} size={["full", "3xl"]}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>기관코드찾기</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={8}>
                <AutoComplete
                  setFacility={(name, code) => {
                    console.log(name, code);
                    setFacility({ ...facility, name: name, code: code });
                  }}
                  setType={(type) => setFacility({ ...facility, type: type })}
                  setLocation={(city, district) => {
                    setFacility({
                      ...facility,
                      city: city,
                      district: district,
                    });
                  }}
                />
                {facility.code && (
                  <VStack>
                    <Text> {"기관코드는"}</Text>
                    <Text
                      fontWeight={"bold"}
                      color={"red.500"}
                      maxW={"full"}
                      textAlign={"center"}
                    >
                      {facility.code}
                    </Text>
                    <Text> {"입니다."}</Text>
                  </VStack>
                )}
                <Button
                  onClick={() => {
                    onClose();
                  }}
                >
                  적용
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Stack>
  );
}

export default SignUp;
