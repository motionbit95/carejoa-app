import {
  Badge,
  Box,
  HStack,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SelectLocation, {
  siDoCd,
  siGunGuCd,
} from "../../component/select_location";
import Pagination from "../../component/pagination";
import { adminPttnCd } from "../../data";
import MapComponent, { Distance, getLocation } from "../../component/kakaomap";

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
function Search(props) {
  // 표시할 리스트
  const [selectCity, setSelectCity] = useState("전체");
  const [selectDistrict, setSelectDistrict] = useState("전체");

  const [cityCode, setCityCode] = useState("00");
  const [districtCode, setDistrictCode] = useState("000");

  const [items, setItems] = useState([]);
  const [numOfRows, setNumOfRows] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수를 설정합니다.

  const [currentPosition, setCurrentPosition] = useState({});

  const serviceKey =
    "4eAe85Va5t5sA%2FR%2B2PTfuwd%2BxyGU7h5yNNRENMZ3G7zUociiug2xxmCEi379uajXgHxrSwGwFjBm47JuoC5NhQ%3D%3D";

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

  useEffect(() => {
    const getGeneralInfo = async () => {
      fetch(
        `http://apis.data.go.kr/B550928/searchLtcInsttService01/getLtcInsttSeachList01?siDoCd=${cityCode}&pageNo=${pageNo}&siGunGuCd=${districtCode}&serviceKey=${serviceKey}`
      )
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

    getGeneralInfo();
  }, [cityCode, districtCode, pageNo]);
  return (
    <Stack>
      <HStack p={4} w={"full"}>
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
      </HStack>
      <HStack px={4}>
        <Text>{"총"}</Text>
        <HStack spacing={0}>
          <Text fontWeight={"bold"} color={"blue.500"}>
            {totalCount}
          </Text>
          <Text>개</Text>
        </HStack>
      </HStack>
      <Stack bgColor={useColorModeValue("gray.100", "gray.900")}>
        {items.map((value, index) => (
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
      </Stack>
      <Pagination
        totalPages={totalPages}
        currentPage={parseInt(pageNo)}
        setCurrentPage={(pageNo) => setPageNo(parseInt(pageNo))}
      />
    </Stack>
  );
}

export default Search;
