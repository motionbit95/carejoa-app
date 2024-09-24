import {
  Button,
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

function SignUp(props) {
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [userInfo, setUserInfo] = React.useState({
    email: null,
    password: null,
    type: "personal",
  });

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
    const username = generateRandomUsername();
    console.log(username);
    console.log(userInfo.email);
    console.log(userInfo.password);
    console.log(userInfo.type);

    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        updateProfile(auth.currentUser, {
          displayName: username,
        }).then(() => {
          console.log("profile updated");
        });

        fetch("http://127.0.0.1:5004/motionbit-doc/us-central1/addUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            type: userInfo.type,
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
      <RadioButtonGroup
        list={["개인회원", "기관회원"]}
        defaultValue="개인회원"
        setValue={(value) => setUserInfo({ ...userInfo, type: value })}
      />
      {userInfo.type === "기관회원" ? (
        <Stack>
          <HStack>
            <Input
              type="text"
              placeholder="기관코드를 입력하세요."
              value={facility.code}
              onChange={(e) =>
                setFacility({ ...userInfo, code: e.target.value })
              }
            />
            <Button onClick={() => checkFacility(facility.code)}>확인</Button>
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
      <Input
        type="email"
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
      <Input
        type="password"
        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
      />
      <Button onClick={handleSubmit}>회원가입하기</Button>

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
                  setFacility({ ...facility, city: city, district: district });
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
    </Stack>
  );
}

export default SignUp;
