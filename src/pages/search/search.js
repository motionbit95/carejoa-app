import { Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SelectLocation, {
  siDoCd,
  siGunGuCd,
} from "../../component/select_location";

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
  const [selectCity, setSelectCity] = React.useState("전체");
  const [selectDistrict, setSelectDistrict] = React.useState("전체");

  const [cityCode, setCityCode] = React.useState("00");
  const [districtCode, setDistrictCode] = React.useState("000");

  const [items, setItems] = React.useState([]);
  const [numOfRows, setNumOfRows] = React.useState(10);
  const [pageNo, setPageNo] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

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
          console.log(json.response.body);

          let items = json.response.body.items.item;
          setItems(items);
          setPageNo(json.response.body.pageNo.text);
          setNumOfRows(json.response.body.numOfRows.text);
          setTotalCount(json.response.body.totalCount.text);

          if (items?.length > 0) {
            items.forEach((element) => {
              let longTermAdminSym = element.longTermAdminSym.text;
              let adminPttnCd = element.adminPttnCd.text;
              console.log(longTermAdminSym, adminPttnCd);
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
                  const json = xmlToJson(xmlDoc);
                  console.log(json);
                })
                .catch((error) => console.error(error));
            });
          }
        })
        .catch((error) => console.error(error));
    };

    getGeneralInfo();
  }, [cityCode, districtCode]);
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
      {/* {list.map((item) => (
        <Text>{item.adminNm}</Text>
      ))} */}
    </Stack>
  );
}

export default Search;
