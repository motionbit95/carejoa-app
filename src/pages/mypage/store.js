import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect } from "react";
import { auth, db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";
import PortOne from "@portone/browser-sdk/v2";
import { collection, doc, onSnapshot } from "firebase/firestore";

function Store(props) {
  const navigate = useNavigate();
  const [selectPrice, setPrice] = React.useState(1000);
  const [selectBonus, setBonus] = React.useState(0);

  const [data, setData] = React.useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 상위 문서와 하위 문서 참조
        const docRef = doc(db, "database", "carejoa", "USERS", user.uid);

        // 특정 문서에 대한 실시간 구독
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            console.log("Document data:", snapshot.data());
            setData({ id: snapshot.id, ...snapshot.data() });
          } else {
            console.log("No such document!");
          }
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
      }
    });
  }, []);

  const callPortOne = async () => {
    const paymentId = `${crypto.randomUUID().replaceAll("-", "")}`;

    const response = await PortOne.requestPayment({
      // Store ID 설정
      storeId: "store-dabf3226-1f5c-437a-bf2b-c52b59f66bc6",
      // 채널 키 설정 - 스마트로 결제창 일반결제
      channelKey: "channel-key-3efd1f68-fbc5-44d0-96b6-3103ae3c3ed1",
      paymentId: paymentId,
      orderName: `${selectPrice}캐시`,
      totalAmount: selectPrice,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",

      customer: {
        phoneNumber: auth.currentUser.phoneNumber
          ? auth.currentUser.phoneNumber
          : "01000000000",
      },
    });

    if (response.code != null) {
      // 오류 발생
      return alert(response.message);
    }

    // /payment/complete 엔드포인트를 구현해야 합니다. 다음 목차에서 설명합니다.
    const notified = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/payment/complete`,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        // paymentId와 주문 정보를 서버에 전달합니다
        body: JSON.stringify({
          paymentId: paymentId,
          // 주문 정보...
          amount: selectPrice,
          uid: auth.currentUser.uid,
          cash: selectPrice + selectBonus,
        }),
      }
    );

    const result = await notified.json();

    if (result) {
      // 결제 완료 모달 띄우기!
      alert("결제완료!");
    }
  };

  return (
    <Stack minH={"100vh"} spacing={0} bgColor={"gray.50"}>
      <Stack>
        <Header title={"캐시 충전"} customButton={<></>} />
      </Stack>
      <Stack w={"full"} spacing={8}>
        <HStack
          w={"full"}
          bgColor={"gray.800"}
          color={"white"}
          p={4}
          justifyContent={"space-between"}
        >
          <Text>보유캐시</Text>
          <Text fontWeight={"bold"} fontSize={"lg"}>
            {data?.cash?.toLocaleString() ?? "0"}캐시
          </Text>
        </HStack>
        <Stack p={4}>
          <Text fontWeight={"bold"} fontSize={"lg"}>
            일반충전
          </Text>
          <PriceCard
            price={1000}
            onClick={() => {
              setPrice(1000);
              setBonus(0);
            }}
            selected={selectPrice === 1000}
          />
          <PriceCard
            price={5000}
            bonus={500}
            onClick={() => {
              setPrice(5000);
              setBonus(500);
            }}
            selected={selectPrice === 5000}
          />
          <PriceCard
            price={10000}
            bonus={1000}
            onClick={() => {
              setPrice(10000);
              setBonus(1000);
            }}
            selected={selectPrice === 10000}
          />
          <PriceCard
            price={50000}
            bonus={5000}
            onClick={() => {
              setPrice(50000);
              setBonus(5000);
            }}
            selected={selectPrice === 50000}
            hot
          />
          <PriceCard
            price={100000}
            bonus={10000}
            onClick={() => {
              setPrice(100000);
              setBonus(10000);
            }}
            selected={selectPrice === 100000}
          />
        </Stack>
      </Stack>

      <Stack w={"full"} p={4} pb={16}>
        <Text fontWeight={"bold"} color={"gray.600"}>
          조아캐시 이용안내(예시)
        </Text>
        <Stack fontSize={"sm"} spacing={0} color={"gray.500"}>
          <Text>
            - 충전한 캐시는 케어조아의 모든 플랫폼에서 사용할 수 있습니다.
          </Text>
          <Text>
            - 캐시 구매 시 지급되는 보너스 캐시의 수량은 변경할 수 없습니다.
          </Text>
          <Text>
            - 캐시 구매 시 지급되는 보너스 캐시와 이벤트로 받은 무료캐시는 구매
            취소 및 환불 대상이 아닙니다.
          </Text>
          <Text>
            - 캐시 충전금액은 스토어에 표시되는 금액 기준이며, 결제 금액과
            지급금액은 차이가 있을 수 있습니다.
          </Text>
          <Text>- 캐시 구매 또는 사용 전 이용약관 동의가 필요합니다.</Text>
          <Text>- 스토어의 모든 상품은 부과세(VAT)가 포함된 가격입니다.</Text>
          <Text>- 충전 캐시의 유효기간은 마지막 접속일로부터 5년입니다.</Text>
        </Stack>
      </Stack>

      <Flex
        position={"sticky"}
        bottom={0}
        left={0}
        right={0}
        w={"full"}
        p={4}
        bgColor={"white"}
      >
        <Button w={"full"} colorScheme="blue" onClick={callPortOne}>
          {selectPrice?.toLocaleString()}원 결제하기
        </Button>
      </Flex>
    </Stack>
  );
}

const PriceCard = ({ price, bonus, selected, hot, onClick }) => {
  return (
    <Stack
      w={"full"}
      bgColor={"white"}
      p={4}
      justifyContent={"space-between"}
      border={selected ? "2px" : "1px"}
      borderColor={selected ? "blue.300" : "gray.200"}
      borderRadius={"lg"}
      cursor={"pointer"}
      onClick={onClick}
      shadow={"xl"}
      spacing={4}
    >
      <HStack justifyContent={"space-between"}>
        <Stack spacing={0}>
          <HStack>
            <Text fontWeight={"bold"} fontSize={"lg"}>
              {price?.toLocaleString()} 캐시
            </Text>
            {hot ? <Badge colorScheme="red">Hot</Badge> : null}
          </HStack>
          {bonus && (
            <HStack spacing={1} fontSize={"sm"}>
              <Text color={"blue.500"}>+{bonus?.toLocaleString()}</Text>
              <Text color={"gray.500"}>보너스캐시</Text>
            </HStack>
          )}
        </Stack>
        <Text fontSize={"lg"} color={selected ? "blue.400" : "black"}>
          {price?.toLocaleString()}원
        </Text>
      </HStack>
    </Stack>
  );
};

export default Store;
