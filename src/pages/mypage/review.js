import {
  Box,
  HStack,
  Image,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../component/header";
import { parsingDate } from "../counseling/counsel_list";
import Rating from "../../component/rating";

function Review(props) {
  const location = useLocation();
  const uid = location.state.uid;
  const [myReviews, setMyReviews] = React.useState([]);

  useEffect(() => {
    const getReviews = () => {
      fetch(
        `https://us-central1-motionbit-doc.cloudfunctions.net/api/getReviews?uid=${uid}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMyReviews(data);
        })
        .catch((error) => console.error(error));
    };

    getReviews();
  }, [uid]);

  const deleteReview = (id) => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      fetch(
        `https://us-central1-motionbit-doc.cloudfunctions.net/api/deleteDocument?subCollection=REVIEWS&documentId=${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMyReviews(myReviews.filter((review) => review.id !== id));
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <Stack minH={"100vh"} position={"relative"} bgColor={"gray.100"}>
      <Box position={"absolute"} top={0} left={0} right={0} />
      <Header title={"나의 이용후기"} customButton={<></>} />
      <Stack flex={1}>
        {myReviews.map((review) => (
          <Stack bgColor={"white"} p={4}>
            <HStack justifyContent={"space-between"}>
              <Stack spacing={0}>
                <Text fontWeight={"bold"} fontSize={"lg"}>
                  {review.facility.name}
                </Text>
                <Text opacity={0.7}>
                  {review.facility.city} {review.facility.district}
                </Text>
              </Stack>
              <Stack spacing={0} justifyContent={"flex-end"}>
                <Text textAlign={"right"}>{parsingDate(review.createdAt)}</Text>
                <Rating
                  cursor={"default"}
                  rating={review.rating}
                  onClick={() => {}}
                />
              </Stack>
            </HStack>
            <HStack overflowY={"scroll"}>
              {review.urlList.map((url) => (
                <Image
                  src={url}
                  w={"150px"}
                  aspectRatio={1}
                  alt={review.facility.name}
                  key={url}
                  objectFit={"cover"}
                />
              ))}
            </HStack>
            <Text whiteSpace={"pre-line"}>{review.content}</Text>
            <HStack justifyContent={"flex-end"} divider={<StackDivider />}>
              {/* <Text>수정</Text> */}
              <Text
                cursor={"pointer"}
                color={"red.500"}
                onClick={() => deleteReview(review.id)}
              >
                삭제
              </Text>
            </HStack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default Review;
