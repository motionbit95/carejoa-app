import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import PortOne from "@portone/browser-sdk/v2";

function Setting(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    // name: null,
    // email: null,
    // confirmPassword: null,
    // password: null,
  });

  const [defaultValue, setDefaultValue] = React.useState({
    name: null,
    email: null,
  });

  const imageRef = React.useRef();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setDefaultValue({
          ...defaultValue,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleLogout = () => {
    auth.signOut();

    navigate("/mypage");
  };

  const handleSubmit = async () => {
    console.log(formData);

    if (formData.photoURL) {
      const file = formData.profile;
      const reader = new FileReader();
      let fileData = await new Promise((resolve, reject) => {
        reader.onload = () =>
          resolve({
            name: file.name,
            mimetype: file.type,
            content: reader.result.split(",")[1], // base64 데이터 추출
          });
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      console.log(fileData);

      fetch(`${process.env.REACT_APP_SERVER_URL}/uploadFiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: [fileData],
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.code === "0000") {
            // 업로드 된 링크를 반환합니다.
            console.log(result.filePaths[0]);

            updateProfile(auth.currentUser, {
              photoURL: result.filePaths[0],
            });
          }
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          return [];
        });
    }

    if (formData.name) {
      updateProfile(auth.currentUser, {
        displayName: formData.name,
      });
    }

    if (formData.password && formData.confirmPassword) {
      const credential = EmailAuthProvider.credential(
        defaultValue.email,
        formData.confirmPassword
      );
      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          console.log("password verified");
          updatePassword(auth.currentUser, formData.password)
            .then(() => {
              console.log("password updated");
              alert("비밀번호가 변경되었습니다.");
              navigate(-1);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    alert("유저 정보가 변경되었습니다.");
    navigate("/mypage");
  };

  const handleFile = (file) => {
    const url = URL.createObjectURL(file); // 파일에 대한 URL 생성
    console.log(url);
    setDefaultValue({ ...defaultValue, photoURL: url });
    setFormData({ ...formData, photoURL: url, profile: file }); // 상태 업데이트
    imageRef.current.value = null;
  };

  const deleteUser = async () => {
    try {
      console.log(auth.currentUser.uid);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/deleteUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: auth.currentUser.uid }), // 유저 UID를 요청의 body에 포함
        }
      );

      if (response.ok) {
        const result = await response.text();
        console.log(result); // 성공 메시지
        auth.signOut();
        navigate("/login");
      } else {
        const errorMessage = await response.text();
        console.error("Error:", errorMessage);
      }
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  const callPortOne = async () => {
    const identityVerificationId = `${crypto.randomUUID().replaceAll("-", "")}`;
    const response = await PortOne.requestIdentityVerification({
      // 고객사 storeId로 변경해주세요.
      storeId: "store-dabf3226-1f5c-437a-bf2b-c52b59f66bc6",
      identityVerificationId: identityVerificationId,
      // 연동 정보 메뉴의 채널 관리 탭에서 확인 가능합니다.
      channelKey: "channel-key-b6ee4271-72a7-44a3-8edc-4d7a64b3675a",
    });

    // 프로세스가 제대로 완료되지 않은 경우 에러 코드가 존재합니다
    if (response.code != null) {
      return alert(response.message);
    }

    const verificationResult = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/identity-verifications`,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(response),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "VERIFIED") {
          setFormData({
            ...formData,
            phoneNumber: data.verifiedCustomer.phoneNumber,
          });

          updateProfile(auth.currentUser, {
            // displayName: data.verifiedCustomer.name,
            phoneNumber: data.verifiedCustomer.phoneNumber,
          }).then(() => {
            console.log("phone number updated", auth.currentUser.phoneNumber);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Stack>
      <Stack position={"sticky"} top={0} left={0} right={0} spacing={0}>
        <Header title={"계정설정"} customButton={<></>} />
      </Stack>

      <VStack w={"full"} p={4} spacing={8}>
        <Avatar
          size={"xl"}
          src={defaultValue.photoURL}
          onClick={() => imageRef.current.click()}
        />
        <Input
          type="file"
          display={"none"}
          id="file"
          accept="image/*"
          ref={imageRef}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <Stack spacing={4} w={"full"}>
          <FormControl>
            <FormLabel>닉네임</FormLabel>

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
            <FormLabel>휴대폰</FormLabel>
            <HStack>
              <Input
                isReadOnly
                placeholder="휴대폰 번호를 입력해주세요."
                type="tel"
                value={formData.phoneNumber}
                variant={"flushed"}
                maxLength={20}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
              <Button onClick={callPortOne}>
                {formData.phoneNumber ? "재인증" : "본인인증"}
              </Button>
            </HStack>
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
            <Text
              color={"gray.500"}
              variant={"unstyled"}
              cursor={"pointer"}
              onClick={() => handleLogout()}
            >
              로그아웃
            </Text>
            <Text
              color={"gray.500"}
              variant={"unstyled"}
              cursor={"pointer"}
              onClick={() => deleteUser()}
            >
              탈퇴하기
            </Text>
          </HStack>
        </Stack>
      </VStack>

      <Flex position={"sticky"} bottom={0} left={0} right={0}>
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
          onClick={handleSubmit}
        >
          저장하기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Setting;
