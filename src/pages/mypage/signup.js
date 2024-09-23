import { Button, Input, Stack } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

function SignUp(props) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState({
    email: null,
    password: null,
  });
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

    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        updateProfile(auth.currentUser, {
          displayName: username,
        }).then(() => {
          console.log("profile updated");
        });
        console.log(user);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Stack>
      <Input
        type="email"
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
      <Input
        type="password"
        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
      />
      <Button onClick={handleSubmit}>회원가입하기</Button>
    </Stack>
  );
}

export default SignUp;
