import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../../component/header";
import { useLocation, useNavigate } from "react-router-dom";
import ImageUploader from "../../component/image_uploader";
import { FiImage } from "react-icons/fi";
import { auth } from "../../firebase/config";
import AutoComplete from "../../component/autocomplete";
import { BsFillStarFill, BsStar } from "react-icons/bs";
import Rating from "../../component/rating";

function CommunityRegister(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { path } = location.state || "/";

  const [imageList, setImageList] = React.useState([]);
  const [urlList, setUrlList] = React.useState([]);
  const [content, setContent] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [facility, setFacility] = React.useState(
    location.state.facility
      ? location.state.facility
      : {
          code: "",
          type: "",
          name: "",
          city: "",
          district: "",
        }
  );

  useEffect(() => {
    console.log(facility);
  }, [facility]);

  const imageRef = React.useRef();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleFiles = (event) => {
    event.preventDefault();

    const files = Array.from(event.target.files); // 파일 목록을 배열로 변환
    const fileUrls = files.map((file) => {
      const url = URL.createObjectURL(file); // 파일에 대한 URL 생성
      return { file, url }; // 파일과 URL을 함께 저장
    });
    console.log(fileUrls);
    setImageList([...imageList, ...fileUrls]); // 상태 업데이트

    imageRef.current.value = null;
  };

  const handleSubmit = () => {
    // console.log(imageList);
    // console.log(content);
    uploadFiles(imageList);
  };

  useEffect(() => {
    if (urlList.length > 0) {
      setIsLoading(true);
      console.log(urlList);
      console.log(content);
      // console.log(auth.currentUser.photoURL, auth.currentUser.displayName);
      // console.log(Date.now());

      fetch(
        `${
          process.env.REACT_APP_SERVER_URL
        }/saveDocument?subCollection=${path.toUpperCase()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: auth.currentUser.uid, // 누가 신청했는지 알아야한다.
            createdAt: Date.now(), // 언제 신청했는지 알아야한다.
            content: content,
            urlList: urlList,
            facility: facility,
            rating: rating,
            code: facility.code,
          }),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
          // 저장이 완료되었다는 알림을 발생시키고 페이지를 이동합니다.
          setIsLoading(false);
          alert("작성이 완료되었습니다.!");
          navigate(`/community/${path}`);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [urlList]);

  const uploadFiles = async (files) => {
    console.log(files);
    // 파일 리스트를 읽어들여 base64로 변환
    const fileData = await Promise.all(
      files.map(async ({ file }) => {
        console.log(file);
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () =>
            resolve({
              name: file.name,
              mimetype: file.type,
              content: reader.result.split(",")[1], // base64 데이터 추출
            });
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      })
    );

    fetch(`${process.env.REACT_APP_SERVER_URL}/uploadFiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: fileData,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.code === "0000") {
          // 업로드 된 링크를 반환합니다.
          setUrlList(result.filePaths);
        }
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        return [];
      });
  };

  const searchFacilitity = (keyword) => {
    console.log(keyword);
  };

  return (
    <Stack bgColor={"gray.100"} minH={"100vh"}>
      <Flex position={"sticky"} top={0} left={0} right={0}>
        <Header
          title={path === "news" ? "시설소식 작성하기" : "이용후기 작성하기"}
        />
      </Flex>
      <Flex w={"full"} bgColor={"white"} flex={1} p={4}>
        <Stack w={"full"} spacing={4}>
          <Flex w={"full"} justifyContent={"center"}>
            {path === "news" ? (
              <Input
                isDisabled
                _disabled={{ color: "black" }}
                value={facility?.name}
              />
            ) : (
              <AutoComplete
                setFacility={(name, code) =>
                  setFacility({ ...facility, name: name, code: code })
                }
                setType={(type) => setFacility({ ...facility, type: type })}
                setLocation={(city, district) =>
                  setFacility({ ...facility, city: city, district: district })
                }
              />
            )}
          </Flex>
          <Flex w={"full"} justifyContent={"center"}>
            <Center
              minWidth="100px" // 박스의 최소 가로 크기
              height="100px"
              background="white"
              borderRadius={"md"}
              border={"1px solid #c8c8c8"}
              mr={2}
              onClick={() => imageRef.current.click()}
              cursor={"pointer"}
            >
              <VStack>
                <FiImage size={36} color="#8c8c8c" />
                <Text>{imageList.length} / 10</Text>
              </VStack>
            </Center>
            <Input
              display={"none"}
              type={"file"}
              ref={imageRef}
              multiple
              onChange={handleFiles}
              accept="image/*"
            />
            <ImageUploader
              imageList={imageList}
              removeImage={(index) =>
                setImageList(imageList.filter((_, i) => i !== index))
              }
            />
          </Flex>
          <Flex w={"full"} justifyContent={"center"}>
            <Textarea
              w={"full"}
              placeholder={
                "이곳에 글을 작성해주세요. (최소 10자 이상 입력해주세요.)"
              }
              minHeight={"200px"}
              minLength={10}
              onChange={(e) => setContent(e.target.value)}
              value={content}
              resize={"none"}
            />
          </Flex>
          {path === "reviews" && (
            <Stack>
              <Text fontWeight={"bold"}>별점을 선택해주세요.</Text>
              <Rating setRating={setRating} rating={rating} boxSize={"32px"} />
            </Stack>
          )}
        </Stack>
      </Flex>

      <Flex position={"sticky"} bottom={0} left={0} right={0}>
        <Button
          colorScheme={
            imageList.length === 0 || content.length < 10 ? "gray" : "blue"
          }
          w={"full"}
          height={"60px"}
          fontSize={"lg"}
          borderRadius={0}
          isDisabled={imageList.length === 0 || content.length < 10}
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {!facility.name
            ? "이용기관을 선택해주세요."
            : imageList.length === 0
            ? "사진을 최소 1장 이상 업로드해주세요."
            : content.length < 10
            ? "최소 10자 이상 입력해주세요."
            : "작성 완료"}
        </Button>
      </Flex>
    </Stack>
  );
}

export default CommunityRegister;
