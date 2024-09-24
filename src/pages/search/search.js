import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Pagination from "../../component/pagination";
import {
  adminPttnCd,
  siDoCd,
  siDoCd_2,
  siGunGuCd,
  siGunGuCd_2,
} from "../../data";
import MapComponent, { Distance, getLocation } from "../../component/kakaomap";
import { FiBookmark, FiMap, FiSearch } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../component/bottom_nav";
import Advertise from "./advertise";
import SelectLocation from "./select_location";
import SelectTypeCode, { facility } from "./select_typecode";

// XML 데이터를 JSON으로 변환하는 함수
export function xmlToJson(xml) {
  let obj = {};

  // Element 노드일 때
  if (xml.nodeType === 1) {
    // 속성이 있는 경우
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute = xml.attributes.item(i);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  }
  // Text 노드일 때
  else if (xml.nodeType === 3) {
    obj = xml.nodeValue.trim();
  }

  // 자식 노드가 있을 때 재귀적으로 처리
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      let nodeName = item.nodeName.includes("#")
        ? item.nodeName.substr(1)
        : item.nodeName;
      if (typeof obj[nodeName] === "undefined") {
        const jsonValue = xmlToJson(item);
        if (jsonValue !== "") {
          // 빈 문자열은 제외
          obj[nodeName] = jsonValue;
        }
      } else {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        const jsonValue = xmlToJson(item);
        if (jsonValue !== "") {
          // 빈 문자열은 제외
          obj[nodeName].push(jsonValue);
        }
      }
    }
  }

  return obj;
}

export const serviceKey =
  "4eAe85Va5t5sA%2FR%2B2PTfuwd%2BxyGU7h5yNNRENMZ3G7zUociiug2xxmCEi379uajXgHxrSwGwFjBm47JuoC5NhQ%3D%3D";

function Search(props) {
  // 표시할 리스트
  const [selectCity, setSelectCity] = useState("서울");
  const [selectDistrict, setSelectDistrict] = useState("강남구");
  const [selectType, setSelectType] = useState("요양병원");
  const [tempKeyword, setTempKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [goods, setGoods] = useState([
    "JDQ4MTg4MSM1MSMkMSMkMCMkOTkkNTgxMzUxIzIxIyQxIyQ1IyQ3OSQyNjEyMjIjNjEjJDEjJDQjJDgz",
  ]);

  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");

  const [items, setItems] = useState([]);
  const [numOfRows, setNumOfRows] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수를 설정합니다.

  const [currentPosition, setCurrentPosition] = useState({});

  // 요양병원 리스트
  const [hospitalList, setHospitalList] = useState([]);

  useEffect(() => {
    // 시설이 변경되었을 때 해당 코드를 수행합니다.
    if (selectType === "요양병원") {
      // 요양병원일 경우 병원 검색 API를 수행합니다.
      // API 가이드 : https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15001698#/API%20%EB%AA%A9%EB%A1%9D/getHospBasisList
      // https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList
      const url = `https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=${serviceKey}`;

      searchHospital(url);
    } else {
      // 그 외의 경우 장기요양기관 검색 API를 수행합니다.
      // API 가이드 : https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15059029
      // http://apis.data.go.kr/B550928/searchLtcInsttService01/getLtcInsttSeachList01
      const url = `http://apis.data.go.kr/B550928/searchLtcInsttService01/getLtcInsttSeachList01?serviceKey=${serviceKey}`;

      searchFacility();
    }
  }, [selectType, keyword, pageNo]);

  const searchHospital = (url) => {
    // 지역 코드 및 검색어로 요양병원을 검색합니다.

    const sidoCd = siDoCd_2[selectCity]; // 병원 검색용 지역코드는 siDoCd_2에서 매핑합니다.
    const sgguCd = siGunGuCd_2[selectCity][selectDistrict]; // 병원 검색용 지역코드는 siGunGuCd_2에서 매핑합니다.
    const clCd = 28; // 요양병원 분류코드입니다.

    const paramUrl = `${url}&sidoCd=${sidoCd}&sgguCd=${sgguCd}&clCd=${clCd}&pageNo=${pageNo}&numOfRows=${numOfRows}&yadmNm=${keyword}`;

    // 데이터를 받아옵니다.
    fetch(paramUrl)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        // 교환 데이터 표준이 xml 형식입니다. 해당 데이터를 json으로 변환합니다.

        // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        // XML 객체를 JSON으로 변환
        const json = xmlToJson(xmlDoc);
        const searchedData = json.response.body.items.item;
        let hospitalList = []; // 파싱한 obj를 배열로 저장합니다.

        // 페이지네이션 속성 업데이트
        setPageNo(json.response.body.pageNo.text);
        setNumOfRows(json.response.body.numOfRows.text);
        setTotalCount(json.response.body.totalCount.text);
        setTotalPages(
          parseInt(parseInt(json.response.body.totalCount.text) / 10) + 1
        );
        if (xmlToJson(xmlDoc).response.body.totalCount.text === "0") {
          setHospitalList([]);
        } else if (xmlToJson(xmlDoc).response.body.totalCount.text === "1") {
          // 데이터가 하나일 경우
          // 필요한 데이터만 추출합니다.
          const data = searchedData;
          console.log(xmlToJson(xmlDoc).response.body);
          const hospital = {
            cmdcResdntCnt: data.cmdcResdntCnt?.text ?? 0, // 한방레지던트 인원수
            cmdcSdrCnt: data.cmdcSdrCnt?.text ?? 0, // 한방 전문의 인원수
            cmdcGdrCnt: data.cmdcGdrCnt?.text ?? 0, // 한방 일반의 인원수
            cmdcIntnCnt: data.cmdcIntnCnt?.text ?? 0, // 한방 인턴 인원수
            pnursCnt: data.pnursCnt?.text ?? 0, // 조산사 인원수
            detyGdrCnt: data.detyGdrCnt?.text ?? 0, // 치과 일반의 인원수
            detyIntnCnt: data.detyIntnCnt?.text ?? 0, // 치과 인턴 인원수
            detyResdntCnt: data.detyResdntCnt?.text ?? 0, // 치과 레지던트 인원수
            detySdrCnt: data.detySdrCnt?.text ?? 0, // 치과 전문의 인원수
            mdeptSdrCnt: data.mdeptSdrCnt?.text ?? 0, // 의과 전문의 인원수
            mdeptResdntCnt: data.mdeptResdntCnt?.text ?? 0, // 의과 레지던트 인원수
            mdeptGdrCnt: data.mdeptGdrCnt?.text ?? 0, // 의과 일반의 인원수
            mdeptIntnCnt: data.mdeptIntnCnt?.text ?? 0, // 의과 인턴 인원수
            drTotCnt: data.drTotCnt?.text ?? 0, // 의사 총 수
            telno: data.telno?.text ?? "", // 전화번호
            hospUrl: data.hospUrl?.text ?? "", // 홈페이지
            estbDd: data.estbDd?.text ?? "", // 개설일자
            sidoCdNm: data.sidoCdNm?.text ?? "", // 시도명
            sidoCd: data.sidoCd?.text ?? "", // 시도코드
            sgguCdNm: data.sgguCdNm?.text ?? "", // 시군구명
            sgguCd: data.sgguCd?.text ?? "", // 시군구코드
            emdongNm: data.emdongNm?.text ?? "", // 읍면동명
            postNo: data.postNo?.text ?? "", // 우편번호
            addr: data.addr?.text ?? "", // 주소
            XPos: data.XPos?.text ?? "", // x좌표
            YPos: data.YPos?.text ?? "", // y좌표
            distance: data.distance?.text ?? "", // 거리
            ykiho: data.ykiho?.text ?? "", // 암호화된요양기호
            yadmNm: data.yadmNm?.text ?? "", // 병원명
            clCd: data.clCd?.text ?? "28", // 종별코드
            clCdNm: data.clCdNm?.text ?? "요양병원", // 종별코드명
          };

          hospitalList.push(hospital);
          setHospitalList(hospitalList);
        } else {
          searchedData.forEach((data) => {
            // 필요한 데이터만 추출합니다.
            const hospital = {
              cmdcResdntCnt: data.cmdcResdntCnt?.text ?? 0, // 한방레지던트 인원수
              cmdcSdrCnt: data.cmdcSdrCnt?.text ?? 0, // 한방 전문의 인원수
              cmdcGdrCnt: data.cmdcGdrCnt?.text ?? 0, // 한방 일반의 인원수
              cmdcIntnCnt: data.cmdcIntnCnt?.text ?? 0, // 한방 인턴 인원수
              pnursCnt: data.pnursCnt?.text ?? 0, // 조산사 인원수
              detyGdrCnt: data.detyGdrCnt?.text ?? 0, // 치과 일반의 인원수
              detyIntnCnt: data.detyIntnCnt?.text ?? 0, // 치과 인턴 인원수
              detyResdntCnt: data.detyResdntCnt?.text ?? 0, // 치과 레지던트 인원수
              detySdrCnt: data.detySdrCnt?.text ?? 0, // 치과 전문의 인원수
              mdeptSdrCnt: data.mdeptSdrCnt?.text ?? 0, // 의과 전문의 인원수
              mdeptResdntCnt: data.mdeptResdntCnt?.text ?? 0, // 의과 레지던트 인원수
              mdeptGdrCnt: data.mdeptGdrCnt?.text ?? 0, // 의과 일반의 인원수
              mdeptIntnCnt: data.mdeptIntnCnt?.text ?? 0, // 의과 인턴 인원수
              drTotCnt: data.drTotCnt?.text ?? 0, // 의사 총 수
              telno: data.telno?.text ?? "", // 전화번호
              hospUrl: data.hospUrl?.text ?? "", // 홈페이지
              estbDd: data.estbDd?.text ?? "", // 개설일자
              sidoCdNm: data.sidoCdNm?.text ?? "", // 시도명
              sidoCd: data.sidoCd?.text ?? "", // 시도코드
              sgguCdNm: data.sgguCdNm?.text ?? "", // 시군구명
              sgguCd: data.sgguCd?.text ?? "", // 시군구코드
              emdongNm: data.emdongNm?.text ?? "", // 읍면동명
              postNo: data.postNo?.text ?? "", // 우편번호
              addr: data.addr?.text ?? "", // 주소
              XPos: data.XPos?.text ?? "", // x좌표
              YPos: data.YPos?.text ?? "", // y좌표
              distance: data.distance?.text ?? "", // 거리
              ykiho: data.ykiho?.text ?? "", // 암호화된요양기호
              yadmNm: data.yadmNm?.text ?? "", // 병원명
              clCd: data.clCd?.text ?? "28", // 종별코드
              clCdNm: data.clCdNm?.text ?? "요양병원", // 종별코드명
            };

            hospitalList.push(hospital);

            if (hospitalList.length === searchedData.length) {
              // 배경색과 텍스트 색상 변경
              console.log(
                "%c검색된 요양병원 리스트",
                "background-color: yellow; color: black;"
              );
              console.log(hospitalList);
              setHospitalList(hospitalList);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchFacility = () => {
    let url =
      "http://apis.data.go.kr/B550928/searchLtcInsttService01/getLtcInsttSeachList01?serviceKey=" +
      serviceKey +
      "&pageNo=" +
      pageNo +
      "&numOfRows=" +
      numOfRows;

    if (cityCode) {
      url += "&siDoCd=" + cityCode;
    }

    if (districtCode) {
      url += "&siGunGuCd=" + districtCode;
    }

    if (keyword) {
      url += "&adminNm=" + keyword;
    }

    console.log(url);

    fetch(url)
      .then((response) => response.text())
      .then((result) => {
        // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(result, "application/xml");

        // XML 객체를 JSON으로 변환
        const json = xmlToJson(xmlDoc);
        let items = json.response.body.items.item;
        setPageNo(json.response.body.pageNo.text);
        setNumOfRows(json.response.body.numOfRows.text);
        setTotalCount(json.response.body.totalCount.text);
        setTotalPages(
          parseInt(parseInt(json.response.body.totalCount.text) / 10) + 1
        );

        if (items?.length > 0) {
          let list = [];
          items.forEach((element) => {
            let longTermAdminSym = element.longTermAdminSym.text;
            let adminPttnCd = element.adminPttnCd.text;
            fetch(
              `http://apis.data.go.kr/B550928/getLtcInsttDetailInfoService02/getGeneralSttusDetailInfoItem02?longTermAdminSym=${longTermAdminSym}&adminPttnCd=${adminPttnCd}&serviceKey=${serviceKey}`
            )
              .then((response) => response.text())
              .then((result) => {
                // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(
                  result,
                  "application/xml"
                );
                // XML 객체를 JSON으로 변환
                const searchedData = xmlToJson(xmlDoc);

                // 시설현황 가지고 오기
                fetch(
                  `http://127.0.0.1:5004/motionbit-doc/us-central1/getFacilityGeneral?longTermAdminSym=${longTermAdminSym}`
                )
                  .then((response) => response.json())
                  .then((result) => {
                    const generalData = result;
                    // 인원수 받아오는 함수
                    fetch(
                      `http://apis.data.go.kr/B550928/getLtcInsttDetailInfoService02/getAceptncNmprDetailInfoItem02?longTermAdminSym=${longTermAdminSym}&adminPttnCd=${adminPttnCd}&serviceKey=${serviceKey}`
                    )
                      .then((response) => response.text())
                      .then(async (result) => {
                        // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(
                          result,
                          "application/xml"
                        );
                        // XML 객체를 JSON으로 변환
                        const json2 = xmlToJson(xmlDoc);

                        console.log({
                          ...searchedData.response.body.item,
                          ...json2.response?.body?.item,
                          ...generalData[0],
                        });

                        list.push({
                          ...searchedData.response.body.item,
                          ...json2.response?.body?.item,
                          ...generalData[0],
                        });
                        if (list.length === items.length) setItems(list);
                      })
                      .catch((error) => console.error(error));
                  })
                  .catch((error) => console.error(error));
              })
              .catch((error) => console.error(error));
          });
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setCityCode(siDoCd[selectCity]);
    setDistrictCode(siGunGuCd[selectCity][selectDistrict].slice(2, 5));
  }, [selectCity, selectDistrict]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log(latitude, longitude);
          setCurrentPosition({ latitude, longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      document.getElementById("locationInfo").innerText =
        "Geolocation is not supported by this browser.";
    }
  }, []);

  return (
    <Stack pb={"70px"}>
      <Stack p={2}>
        <HStack>
          <HStack justifyContent={"space-between"} w={"full"}>
            <Heading size={"md"}>희망하는 조건을 선택하세요.</Heading>
            <HStack spacing={0}>
              <IconButton
                icon={<FiBookmark size={20} />}
                variant={"unstyle"}
                onClick={() => (window.location.href = "/")}
              />
              <IconButton icon={<FiMap size={20} />} variant={"unstyle"} />
            </HStack>
          </HStack>
        </HStack>
        <HStack>
          <SelectLocation
            w={"full"}
            city={selectCity}
            district={selectDistrict}
            setLocation={(city, district) => {
              setSelectCity(city);
              setSelectDistrict(district);
            }}
            setCode={(city, district) => {
              if (city) {
                setCityCode(city);
              }

              if (district) {
                setDistrictCode(district.substr(2, 5));
              }
            }}
          />
          <SelectTypeCode
            w={"full"}
            selectType={selectType}
            setType={(type) => {
              setSelectType(type);
              console.log(facility[type]);
            }}
          />
        </HStack>
        <HStack>
          <Input
            placeholder="요양기관 이름을 입력하세요."
            onChange={(e) => setTempKeyword(e.target.value)}
          />
          <IconButton
            icon={<FiSearch />}
            onClick={() => {
              setPageNo(1);
              setKeyword(tempKeyword);
            }}
          />
        </HStack>
      </Stack>
      <Advertise />
      <HStack px={4}>
        <Text>{"총"}</Text>
        <HStack spacing={0}>
          <Text fontWeight={"bold"} color={"blue.500"}>
            {totalCount}
          </Text>
          <Text>개</Text>
        </HStack>
      </HStack>
      <Stack
        bgColor={useColorModeValue("gray.100", "gray.900")}
        position={"relative"}
      >
        {selectType !== "요양병원" &&
          items.map((value, index) => (
            <Stack key={index} bgColor={"white"} p={4}>
              {/* <Box>
            <Badge colorScheme="blue">
              {adminPttnCd[value.adminPttnCd.text]}
            </Badge>
          </Box> */}
              <Text fontWeight={"bold"} fontSize={"lg"}>
                {value.adminNm}
              </Text>
              <Text color={"gray.500"}>{value.detailAddr}</Text>

              <HStack divider={<StackDivider borderColor="gray.200" />}>
                <Distance
                  address={value.detailAddr.split(" (")[0]}
                  currentPosition={currentPosition}
                />

                <Text>
                  {value.locTelNo_1?.text}-{value.locTelNo_2?.text}-
                  {value.locTelNo_3?.text}
                </Text>
              </HStack>
              <HStack>
                <Badge variant={"solid"}>
                  {parseInt(value.totPer?.text) > 100
                    ? "대형"
                    : parseInt(value.totPer?.text) > 30
                    ? "중형"
                    : "소형"}
                </Badge>
                <Badge variant={"solid"}>
                  {adminPttnCd[value.adminPttnCd.text]}
                </Badge>
                {value.longTermPeribRgtDt &&
                  value.longTermPeribRgtDt.includes("-") && (
                    <Badge size={"lg"}>
                      설립{" "}
                      {new Date().getFullYear() -
                        value.longTermPeribRgtDt.split("-")[0]}
                      년
                    </Badge>
                  )}
              </HStack>
            </Stack>
          ))}
        {selectType === "요양병원" &&
          hospitalList.map((value, index) => (
            <Stack key={index} bgColor={"white"} p={4} position={"relative"}>
              <Box position={"absolute"} right={0} bottom={2}>
                <IconButton
                  variant={"unstyled"}
                  icon={
                    goods.includes(value.ykiho) ? (
                      <BsBookmarkFill size={20} color="#ecc94b" />
                    ) : (
                      <FiBookmark size={20} color="#8c8c8c" />
                    )
                  }
                />
              </Box>
              <Text fontWeight={"bold"} fontSize={"lg"}>
                {value.yadmNm}
              </Text>
              <Text color={"gray.500"} fontSize={"sm"}>
                {value.addr}
              </Text>

              <HStack divider={<StackDivider borderColor="gray.200" />}>
                <Distance
                  pos={{
                    xPos: value.XPos,
                    yPos: value.YPos,
                  }}
                  currentPosition={currentPosition}
                />

                <Text>{value.telno}</Text>
              </HStack>
              <HStack>
                <Badge variant={"solid"}>{value.clCdNm}</Badge>
                {value.estbDd && (
                  <Badge size={"lg"}>
                    설립{" "}
                    {new Date().getFullYear() -
                      parseInt(value.estbDd.slice(0, 4))}
                    년
                  </Badge>
                )}
              </HStack>
            </Stack>
          ))}
      </Stack>
      <Pagination
        totalPages={totalPages}
        currentPage={parseInt(pageNo)}
        setCurrentPage={(pageNo) => setPageNo(parseInt(pageNo))}
      />
      <Flex position={"fixed"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default Search;
