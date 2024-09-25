import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { serviceKey, xmlToJson } from "./search";
import {
  Box,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiBookmark, FiImage } from "react-icons/fi";

function Detail(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathList = window.location.pathname.split("/");

  const [generalData, setGeneralData] = React.useState({});
  const [detailData, setDetailData] = React.useState({});
  const [doctorDivisionData, setDoctorDivisionData] = React.useState([]);
  const [doctorCountData, setDoctorCountData] = React.useState([]);
  const [medEquipData, setMedEquipData] = React.useState([]);
  const [nursingGradeData, setNursingGradeData] = React.useState([]);
  const [etcHstData, setEtcHstData] = React.useState([]);
  const [paymentData, setPaymentData] = React.useState([]);

  useEffect(() => {
    let code = pathList[pathList.length - 1];
    let type = pathList[pathList.length - 2];

    if (type === "hospital") {
      // 병원 일반 정보를 조회한다.
      fetch(
        `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getEqpInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          console.log(json);
          let items = json.response.body.items.item;

          setGeneralData(items);
        })
        .catch((error) => {
          console.error(error);
        });

      // 병원 세부 정보를 조회한다.
      fetch(
        `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getDtlInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          console.log(json);
          let items = json.response.body.items.item;

          console.log(items);
          setDetailData(items);
        })
        .catch((error) => {
          console.error(error);
        });

      //getSpcSbjtSdrInfo2.7
      fetch(
        `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getSpcSbjtSdrInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          console.log(json);
          let items = json.response.body.items.item;

          console.log(items);
          setDoctorCountData(items);
        })
        .catch((error) => {
          console.error(error);
        });

      //getDgsbjtInfo2.7
      //   fetch(
      //     `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getDgsbjtInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      //   )
      //     .then((response) => {
      //       return response?.text();
      //     })
      //     .then((data) => {
      //       const parser = new DOMParser();
      //       const xmlDoc = parser.parseFromString(data, "application/xml");

      //       // XML 객체를 JSON으로 변환
      //       const json = xmlToJson(xmlDoc);
      //       console.log(json);
      //       let items = json.response.body.items.item;

      //       console.log("asdfasdf", items);
      //       setDoctorDivisionData(items);
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //     });

      //getMedOftInfo2.7
      fetch(
        `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getMedOftInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          let items = json.response.body.items.item;

          console.log(json);

          if (json.response.body.totalCount.text === "0") {
            setMedEquipData([]);
          } else if (json.response.body.totalCount.text === "1") {
            console.log(items);
            setMedEquipData([items]);
          } else {
            setMedEquipData(items);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      //getNursigGrdInfo2.7
      fetch(
        `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getNursigGrdInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          console.log(json);
          let items = json.response.body.items.item;

          setNursingGradeData(items);
        })
        .catch((error) => {
          console.error(error);
        });

      //getEtcHstInfo2.7
      fetch(
        `https://apis.data.go.kr/B551182/MadmDtlInfoService2.7/getEtcHstInfo2.7?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          console.log(json);
          let items = json.response.body.items.item;

          if (json.response.body.totalCount.text === "0") {
            setEtcHstData([]);
          } else if (json.response.body.totalCount.text === "1") {
            setEtcHstData([items]);
          } else {
            setEtcHstData(items);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      //http://apis.data.go.kr/B551182/nonPaymentDamtInfoService/getNonPaymentItemHospDtlList
      fetch(
        `http://apis.data.go.kr/B551182/nonPaymentDamtInfoService/getNonPaymentItemHospDtlList?serviceKey=${serviceKey}&ykiho=${code}`
      )
        .then((response) => {
          return response?.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          console.log(json);
          let items = json.response.body.items.item;

          console.log("asdfasdf", items);
          setPaymentData(items);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  return (
    <Stack w={"full"} position={"relative"}>
      <Flex
        position={"sticky"}
        top={0}
        zIndex={10}
        bgColor={"white"}
        w={"full"}
        p={2}
      >
        <HStack w={"full"} justifyContent={"space-between"}>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            variant={"unstyle"}
            icon={<Icon as={FiArrowLeft} boxSize={"24px"} />}
          />
          <IconButton
            variant={"unstyle"}
            icon={<Icon as={FiBookmark} boxSize={"24px"} />}
          />
        </HStack>
      </Flex>
      <Stack>
        <Center w={"full"} bgColor={"gray.100"} p={4}>
          <Icon as={FiImage} boxSize={"xs"} color={"gray.400"} />
        </Center>
        <Stack p={4}>
          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                {generalData.yadmNm?.text}
              </Text>
              <Text>{generalData.addr?.text}</Text>
              <Stack>
                <Heading size={"xs"}>설립구분</Heading>
                <Text color={"blue.500"}>{generalData.orgTyCdNm?.text}</Text>
                <Heading size={"xs"}>전화번호</Heading>
                <Text color={"blue.500"}>{generalData.telno?.text}</Text>
                <Heading size={"xs"}>설립일자</Heading>
                <Text color={"blue.500"}>
                  {generalData.estbDd?.text.slice(0, 4)}-
                  {generalData.estbDd?.text.slice(4, 6)}-
                  {generalData.estbDd?.text.slice(6, 8)}
                </Text>
              </Stack>
            </Stack>
          </Box>

          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Heading size={"md"}>시설 및 운영정보</Heading>
              <Stack>
                <Heading size={"sm"}>병상수</Heading>

                {(parseInt(generalData.hghrSickbdCnt?.text) > 0 ||
                  parseInt(generalData.stdSickbdCnt?.text) > 0) && (
                  <Stack>
                    <Text>일반입원실</Text>
                    <HStack
                      divider={<StackDivider />}
                      fontSize={"lg"}
                      fontWeight={"bold"}
                    >
                      <Text color={"blue.500"}>
                        상급 : {generalData.hghrSickbdCnt?.text}명
                      </Text>
                      <Text color={"blue.500"}>
                        일반 : {generalData.stdSickbdCnt?.text}명
                      </Text>
                    </HStack>
                  </Stack>
                )}
                {parseInt(generalData.ptrmCnt?.text) > 0 && (
                  <Stack>
                    <Text>물리치료실</Text>
                    <HStack
                      divider={<StackDivider />}
                      fontSize={"lg"}
                      fontWeight={"bold"}
                    >
                      <Text color={"blue.500"}>
                        {generalData.ptrmCnt?.text}명
                      </Text>
                    </HStack>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>

          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Heading size={"md"}>의료장비</Heading>
              <Stack>
                {medEquipData?.map((data) => {
                  return (
                    <Stack key={data.key}>
                      <Text>{data.oftCdNm.text}</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {data.oftCnt?.text}대
                      </Text>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Box>

          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Heading size={"md"}>진료시간</Heading>
              <Stack>
                <Stack>
                  {detailData.trmtMonStart && (
                    <>
                      <Text>월요일</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {detailData.trmtMonStart?.text.slice(0, 2)}:
                        {detailData.trmtMonStart?.text.slice(2, 4)} ~{" "}
                        {detailData.trmtMonEnd?.text.slice(0, 2)}:
                        {detailData.trmtMonEnd?.text.slice(2, 4)}
                      </Text>
                    </>
                  )}
                  {detailData.trmtMonStart && (
                    <>
                      <Text>화요일</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {detailData.trmtTueStart?.text.slice(0, 2)}:
                        {detailData.trmtTueStart?.text.slice(2, 4)} ~{" "}
                        {detailData.trmtTueEnd?.text.slice(0, 2)}:
                        {detailData.trmtTueEnd?.text.slice(2, 4)}
                      </Text>
                    </>
                  )}
                  {detailData.trmtWedStart && (
                    <>
                      <Text>수요일</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {detailData.trmtWedStart?.text.slice(0, 2)}:
                        {detailData.trmtWedStart?.text.slice(2, 4)} ~{" "}
                        {detailData.trmtWedEnd?.text.slice(0, 2)}:
                        {detailData.trmtWedEnd?.text.slice(2, 4)}
                      </Text>
                    </>
                  )}
                  {detailData.trmtThuStart && (
                    <>
                      <Text>목요일</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {detailData.trmtThuStart?.text.slice(0, 2)}:
                        {detailData.trmtThuStart?.text.slice(2, 4)} ~{" "}
                        {detailData.trmtThuEnd?.text.slice(0, 2)}:
                        {detailData.trmtThuEnd?.text.slice(2, 4)}
                      </Text>
                    </>
                  )}
                  {detailData.trmtThuStart && (
                    <>
                      <Text>금요일</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {detailData.trmtFriStart?.text.slice(0, 2)}:
                        {detailData.trmtFriStart?.text.slice(2, 4)} ~{" "}
                        {detailData.trmtFriEnd?.text.slice(0, 2)}:
                        {detailData.trmtFriEnd?.text.slice(2, 4)}
                      </Text>
                    </>
                  )}
                  {detailData.trmtThuStart && (
                    <>
                      <Text>토요일</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {detailData.trmtSatStart?.text.slice(0, 2)}:
                        {detailData.trmtSatStart?.text.slice(2, 4)} ~{" "}
                        {detailData.trmtSatEnd?.text.slice(0, 2)}:
                        {detailData.trmtSatEnd?.text.slice(2, 4)}
                      </Text>
                    </>
                  )}
                  <Heading size={"md"}>점심시간</Heading>
                  <Text>월~금</Text>
                  <Text fontSize={"lg"} fontWeight={"bold"} color={"blue.500"}>
                    {detailData.lunchWeek?.text}
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {doctorCountData?.length > 0 && (
            <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
              <Stack spacing={4}>
                {/* <Stack>
                {doctorDivisionData?.map((data) => {
                  return (
                    <Stack key={data.key}>
                      <Text>{data.dgsbjtCdNm.text}</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {data.dgsbjtPrSdrCnt?.text}명
                      </Text>
                    </Stack>
                  );
                })}
              </Stack> */}
                <Heading size={"md"}>진료과목 및 의사 현황</Heading>
                <Stack>
                  {doctorCountData?.map((data) => {
                    return (
                      <Stack key={data.key}>
                        <Text>{data.dgsbjtCdNm.text}</Text>
                        <Text
                          fontSize={"lg"}
                          fontWeight={"bold"}
                          color={"blue.500"}
                        >
                          {data.dtlSdrCnt?.text}명
                        </Text>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          )}

          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Heading size={"md"}>기타인력</Heading>
              <Stack>
                {etcHstData?.map((data) => {
                  return (
                    <Stack key={data.key}>
                      <Text>{data.dtlGnlNopCdNm.text}</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {data.gnlNopCnt?.text}명
                      </Text>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Box>

          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Heading size={"md"}>간호등급정보</Heading>
              <Stack>
                {nursingGradeData?.map((data) => {
                  return (
                    <Stack key={data.key}>
                      <Text>{data.tyCdNm.text}</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {data.careGrd?.text}등급
                      </Text>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Box>

          <Box p={4} border={"1px"} borderColor={"gray.200"} w={"full"}>
            <Stack spacing={4}>
              <Heading size={"md"}>비급여진료비정보</Heading>
              <Stack>
                {paymentData?.map((data) => {
                  return (
                    <Stack key={data.key}>
                      <Text>{data.npayKorNm.text}</Text>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"blue.500"}
                      >
                        {parseInt(data.curAmt?.text).toLocaleString()}원
                      </Text>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Detail;
