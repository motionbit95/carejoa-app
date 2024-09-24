import React, { useState } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  ListIcon,
  Flex,
  HStack,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { serviceKey, xmlToJson } from "../pages/search/search";
import SelectLocation from "./select_location";
import { siDoCd, siDoCd_2, siGunGuCd, siGunGuCd_2 } from "../data";

const AutoComplete = (props) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("요양병원");
  const [filteredData, setFilteredData] = useState([]);
  const [codeFilteredData, setCodeFilteredData] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  // 예시 데이터
  const data = ["Apple", "Banana", "Orange", "Grape", "Peach", "Pear"];

  // 검색어에 따라 데이터를 필터링
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (type === "요양병원") {
      const sidoCd = siDoCd_2[city]; // 병원 검색용 지역코드는 siDoCd_2에서 매핑합니다.
      const sgguCd = siGunGuCd_2[city][district]; // 병원 검색용 지역코드는 siGunGuCd_2에서 매핑합니다.
      const clCd = 28; // 요양병원 분류코드입니다.

      const url = `https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=${serviceKey}&yadmNm=${value}&sidoCd=${sidoCd}&sgguCd=${sgguCd}&clCd=${clCd}&pageNo=1&numOfRows=10`;

      fetch(url)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          let item = json.response.body.items.item;
          const adminNmList = [];
          const adminNoList = [];

          if (xmlToJson(xmlDoc).response.body.totalCount.text === "0") {
            setFilteredData([]);
            setCodeFilteredData([]);
          } else if (xmlToJson(xmlDoc).response.body.totalCount.text === "1") {
            setFilteredData([item.yadmNm.text]);
            setCodeFilteredData([item.ykiho.text]);
          } else {
            item.forEach((element) => {
              if (!adminNmList.includes(element.yadmNm.text)) {
                adminNmList.push(element.yadmNm.text);
                adminNoList.push(element.ykiho.text);
              }
            });
            setFilteredData(adminNmList);
            setCodeFilteredData(adminNoList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "요양원") {
      //   console.log(siDoCd[city], siGunGuCd[city][district]);
      const url = `http://apis.data.go.kr/B550928/searchLtcInsttService01/getLtcInsttSeachList01?serviceKey=${serviceKey}&adminNm=${value}&pageNo=1&numOfRows=10&siDoCd=${
        siDoCd[city]
      }&siGunGuCd=${siGunGuCd[city][district].substr(2, 5)}`;
      fetch(url)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "application/xml");

          // XML 객체를 JSON으로 변환
          const json = xmlToJson(xmlDoc);
          //   console.log(json);
          let item = json.response.body.items.item;
          const adminNmList = [];
          const adminNoList = [];
          //   console.log(item);

          if (xmlToJson(xmlDoc).response.body.totalCount.text === "0") {
            setFilteredData([]);
            setCodeFilteredData([]);
          } else if (xmlToJson(xmlDoc).response.body.totalCount.text === "1") {
            setFilteredData([item.adminNm.text]);
            setCodeFilteredData([item.longTermAdminSym.text]);
          } else {
            item.forEach((element) => {
              if (!adminNmList.includes(element.adminNm.text)) {
                adminNmList.push(element.adminNm.text);
                adminNoList.push(element.longTermAdminSym.text);
              }
            });
            setFilteredData(adminNmList);
            setCodeFilteredData(adminNoList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // 항목 클릭 시 선택 처리
  const handleSelectItem = (index) => {
    setQuery(filteredData[index]); // 선택한 항목을 입력값으로 설정
    setFilteredData([]); // 목록을 닫기

    props.setFacility(filteredData[index], codeFilteredData[index]);
  };

  return (
    <Stack w={"full"} spacing={2}>
      <HStack position="relative" width="full">
        <Select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            props.setType(e.target.value);
          }}
        >
          <option value="요양병원">요양병원</option>
          <option value="요양원">요양원</option>
        </Select>
        <SelectLocation
          city={city}
          district={district}
          width="full"
          setLocation={(city, district) => {
            setCity(city);
            setDistrict(district);
            props.setLocation(city, district);
          }}
        />
      </HStack>
      <Box position="relative">
        <Input
          placeholder="2자 이상 입력해주세요."
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {filteredData.length > 0 && (
          <Box
            position="absolute"
            width="100%"
            bg="white"
            boxShadow="md"
            mt={2}
            zIndex={1}
          >
            <List spacing={1}>
              {filteredData.map((item, index) => (
                <ListItem
                  key={index}
                  padding={2}
                  _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                  onClick={() => handleSelectItem(index)}
                >
                  <Flex alignItems="center">
                    <ListIcon as={FiSearch} color="green.500" />
                    {item}
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default AutoComplete;
