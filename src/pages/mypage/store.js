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
import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";

function Store(props) {
  const navigate = useNavigate();
  const [selectPrice, setPrice] = React.useState(1000);

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
            {0}캐시
          </Text>
        </HStack>
        <Stack p={4}>
          <Text fontWeight={"bold"} fontSize={"lg"}>
            일반충전
          </Text>
          <PriceCard
            price={1000}
            onClick={() => setPrice(1000)}
            selected={selectPrice === 1000}
          />
          <PriceCard
            price={5000}
            bonus={500}
            onClick={() => setPrice(5000)}
            selected={selectPrice === 5000}
          />
          <PriceCard
            price={10000}
            bonus={1000}
            onClick={() => setPrice(10000)}
            selected={selectPrice === 10000}
          />
          <PriceCard
            price={50000}
            bonus={5000}
            onClick={() => setPrice(50000)}
            selected={selectPrice === 50000}
            hot
          />
          <PriceCard
            price={100000}
            bonus={10000}
            onClick={() => setPrice(100000)}
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
        <Button w={"full"} colorScheme="blue" onClick={() => {}}>
          {selectPrice.toLocaleString()}원 결제하기
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
              {price.toLocaleString()} 캐시
            </Text>
            {hot ? <Badge colorScheme="red">Hot</Badge> : null}
          </HStack>
          {bonus && (
            <HStack spacing={1} fontSize={"sm"}>
              <Text color={"blue.500"}>+{bonus.toLocaleString()}</Text>
              <Text color={"gray.500"}>보너스캐시</Text>
            </HStack>
          )}
        </Stack>
        <Text fontSize={"lg"} color={selected ? "blue.400" : "black"}>
          {price.toLocaleString()}원
        </Text>
      </HStack>
    </Stack>
  );
};

export default Store;
