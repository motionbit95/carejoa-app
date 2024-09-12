import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SelectLocation, {
  siDoCd,
  siGunGuCd,
} from "../../component/select_location";
import Pagination from "../../component/pagination";
import { adminPttnCd } from "../../data";

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

  const serviceKey =
    "4eAe85Va5t5sA%2FR%2B2PTfuwd%2BxyGU7h5yNNRENMZ3G7zUociiug2xxmCEi379uajXgHxrSwGwFjBm47JuoC5NhQ%3D%3D";

  useEffect(() => {
    const getGeneralInfo = async () => {
      const longTermAdminSym = 21130500195;
      fetch(
        `http://apis.data.go.kr/B550928/searchLtcInsttService01/getLtcInsttSeachList01?siDoCd=${cityCode}&pageNo=${1}&siGunGuCd=${districtCode}&serviceKey=${serviceKey}`
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
          console.log(
            parseInt(parseInt(json.response.body.totalCount.text) / 10) + 1
          );
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
                  const json1 = xmlToJson(xmlDoc);

                  fetch(
                    `http://127.0.0.1:5004/motionbit-doc/us-central1/getFacilityGeneral?longTermAdminSym=${longTermAdminSym}`
                  )
                    .then((response) => response.text())
                    .then((result) => {
                      console.log(result);
                    })
                    .catch((error) => console.error(error));

                  // 인원수 받아오는 함수
                  fetch(
                    `http://apis.data.go.kr/B550928/getLtcInsttDetailInfoService02/getAceptncNmprDetailInfoItem02?longTermAdminSym=${longTermAdminSym}&adminPttnCd=${adminPttnCd}&serviceKey=${serviceKey}`
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
                      const json2 = xmlToJson(xmlDoc);

                      console.log({
                        ...json1.response.body.item,
                        ...json2.response.body.item,
                      });

                      list.push({
                        ...json1.response.body.item,
                        ...json2.response.body.item,
                      });
                      if (list.length === items.length) setItems(list);
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
      <SelectLocation
        city={selectCity}
        district={selectDistrict}
        setLocation={(city, district) => {
          setSelectCity(city);
          setSelectDistrict(district);
        }}
        setCode={(city, district) => {
          if (city) {
            console.log("시도코드 : ", city);
            setCityCode(city);
          }

          if (district) {
            console.log("시군구코드 : ", district.substr(2, 5));
            setDistrictCode(district.substr(2, 5));
          }
        }}
      />

      <Text>총 {totalCount}개</Text>
      {items.map((value, index) => (
        <Stack key={index} spacing={1}>
          {/* <Box>
            <Badge colorScheme="blue">
              {adminPttnCd[value.adminPttnCd.text]}
            </Badge>
          </Box> */}
          <Text fontWeight={"bold"}>{value.adminNm.text}</Text>
          <Text>
            {/* {value.siDoCd.text}
            {value.siGunGuCd.text}
            {value.BDongCd.text}
            {value.riCd.text}
            {value.detailAddr?.text}|{value.gunmulMlno?.text}
            {value.gunmulSlno?.text !== "0"
              ? "-" + value.gunmulSlno?.text + "|"
              : ""}
            {value.fi?.text ? value.fi?.text + "층|" : ""}| */}
            {value.locTelNo_1?.text}-{value.locTelNo_2?.text}-
            {value.locTelNo_3?.text} | {adminPttnCd[value.adminPttnCd.text]}
          </Text>
          <HStack>
            <Badge>
              {parseInt(value.totPer?.text) > 100
                ? "대형"
                : parseInt(value.totPer?.text) > 30
                ? "중형"
                : "소형"}
            </Badge>
            <Badge>
              설립{" "}
              {new Date().getFullYear() -
                parseInt(value.longTermPeribRgtDt.text.slice(0, 4)) +
                1}
              년
            </Badge>
          </HStack>
        </Stack>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={pageNo}
        onPageChange={setPageNo}
      />
    </Stack>
  );
}

export default Search;
