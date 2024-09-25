import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  Stack,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { regionMap, siDoCd_2, siGunGuCd_2 } from "../data";
import { serviceKey, xmlToJson } from "../pages/search/search";
import Loading from "./loading";

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구의 반지름 (킬로미터 단위)
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (킬로미터 단위)
}

export const Distance = ({ currentPosition, ...props }) => {
  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (props.address) {
      if (!window.kakao) {
        alert("카카오맵 API가 로드되지 않았습니다.");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(props.address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          setCoords(coords);
          const distance = haversineDistance(
            coords.getLat(),
            coords.getLng(),
            currentPosition.latitude,
            currentPosition.longitude
          );
          setDistance(distance);
        } else {
          console.error("주소를 찾을 수 없습니다.");
        }
      });
    }
  }, [props.address]);

  useEffect(() => {
    if (props.pos) {
      const dist = haversineDistance(
        parseFloat(props.pos.yPos),
        parseFloat(props.pos.xPos),
        currentPosition.latitude,
        currentPosition.longitude
      );

      setDistance(dist);
    }
  }, [props.pos]);

  return (
    <>
      {distance && (
        <HStack>
          <Icon as={FiMapPin} />
          <Text>
            {distance >= 1
              ? parseInt(distance) + "km"
              : parseInt(distance * 1000) + "m"}
          </Text>
        </HStack>
      )}
    </>
  );
};

export const KakaoMapLocation = (props) => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState({
    region_1depth: "",
    region_2depth: "",
  });

  useEffect(() => {
    // 브라우저에서 현재 위치를 가져옵니다.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });

          // 카카오 API가 로드되었는지 확인합니다.
          if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            // 좌표를 행정구역 정보로 변환합니다.
            const coord = new window.kakao.maps.LatLng(lat, lon);
            geocoder.coord2RegionCode(
              coord.getLng(),
              coord.getLat(),
              (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  for (let i = 0; i < result.length; i++) {
                    // 시/도 정보 (region_1depth)
                    if (result[i].region_type === "H") {
                      setAddress((prev) => ({
                        ...prev,
                        region_1depth: regionMap[result[i].region_1depth_name],
                        region_2depth: result[i].region_2depth_name,
                      }));
                      props.setLocation(
                        regionMap[result[i].region_1depth_name],
                        result[i].region_2depth_name
                      );
                    }
                  }
                }
              }
            );
          } else {
            alert("카카오 API가 로드되지 않았습니다.");
          }
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다.", error);
          alert("위치 정보를 가져오는데 실패했습니다.");
        }
      );
    } else {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  return (
    <Box display={"none"}>
      <h1>내 위치 정보</h1>
      {location.lat && location.lon ? (
        <>
          <p>위도: {location.lat}</p>
          <p>경도: {location.lon}</p>
          <p>시/도: {address.region_1depth}</p>
          <p>시/군/구: {address.region_2depth}</p>
        </>
      ) : (
        <p>위치 정보를 가져오는 중...</p>
      )}
    </Box>
  );
};

export const KakaoMap = (props) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    props.onSelect(selectedLocation);
  }, [selectedLocation]);

  // 지도 이동 시 발생하는 이벤트 핸들러 (idle 이벤트)
  const updateRegionInfo = (map) => {
    const center = map.getCenter(); // 지도 중심 좌표 가져오기
    // 주소-좌표 변환 객체 생성
    const geocoder = new window.kakao.maps.services.Geocoder();
    // 중심 좌표를 이용해 행정구역 정보를 요청
    geocoder.coord2RegionCode(
      center.getLng(),
      center.getLat(),
      (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // const regionInfo = `${result[0].region_1depth_name} ${result[0].region_2depth_name} ${result[0].region_3depth_name}`;
          // console.log(regionInfo);

          let sidoCd = siDoCd_2[regionMap[result[0].region_1depth_name]];
          let sgguCd =
            siGunGuCd_2[regionMap[result[0].region_1depth_name]][
              result[0].region_2depth_name.replace("시 ", "")
            ];

          const url = `https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=${serviceKey}&sidoCd=${sidoCd}&sgguCd=${sgguCd}&clCd=28`;

          fetch(url)
            .then((response) => response.text())
            .then((data) => {
              // DOMParser를 사용해 XML 문자열을 XML 객체로 변환
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(data, "application/xml");
              // XML 객체를 JSON으로 변환
              const json = xmlToJson(xmlDoc);

              let hospitalList = json.response.body.items.item;
              let tempList = [];
              hospitalList.forEach((item) => {
                let temp = {
                  id: item.ykiho.text,
                  name: item.yadmNm.text,
                  lat: parseFloat(item.YPos.text),
                  lng: parseFloat(item.XPos.text),
                  imageUrl: require(`../assets/icons/HiLocationMarker_blue.png`),
                };

                tempList.push(temp);
                if (tempList.length === hospitalList.length) {
                  setLocations(tempList);
                }

                // 마커 클릭 시 인포윈도우를 열기 위한 함수
                const createMarkerClickListener = (marker, location) => {
                  return () => {
                    setSelectedMarker(marker);
                    setSelectedLocation(location);
                  };
                };

                const markerPosition = new window.kakao.maps.LatLng(
                  currentPosition.latitude,
                  currentPosition.longitude
                );

                const markerImage = new window.kakao.maps.MarkerImage(
                  require(`../assets/icons/BiCurrentLocation.png`), // 사용자 정의 이미지 URL
                  new window.kakao.maps.Size(36, 36) // 마커 크기
                );

                const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                  image: markerImage,
                });

                marker.setMap(map);

                tempList.forEach((location) => {
                  const markerPosition = new window.kakao.maps.LatLng(
                    location.lat,
                    location.lng
                  );

                  const markerImage = new window.kakao.maps.MarkerImage(
                    require(`../assets/icons/HiLocationMarker_blue.png`), // 사용자 정의 이미지 URL
                    new window.kakao.maps.Size(36, 36) // 마커 크기
                  );

                  const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage,
                  });

                  // 마커 클릭 이벤트 등록
                  window.kakao.maps.event.addListener(
                    marker,
                    "click",
                    createMarkerClickListener(marker, location)
                  );
                  marker.setMap(map); // 마커를 지도에 표시
                });
              });

              // setHospitalList(data.response.body.items.item);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    );
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCurrentPosition({ latitude, longitude });
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다.", error);
          setCurrentPosition({
            latitude: 37.566826,
            longitude: 126.9786567,
          });
          alert("위치 정보를 가져오는데 실패했습니다.");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (currentPosition) {
      // Kakao Maps API를 불러오는 스크립트 동적으로 추가
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2d045f8344d78f996255cb39c9bd9055&autoload=false`;
      document.head.appendChild(script);

      // 스크립트 로드 완료 후 지도 생성
      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map"); // 지도를 표시할 div
          const options = {
            center: new window.kakao.maps.LatLng(
              currentPosition.latitude,
              currentPosition.longitude
            ), // 초기 중심 좌표 (서울)
            level: 6, // 지도의 확대 레벨
          };
          const map = new window.kakao.maps.Map(container, options); // 지도 생성

          updateRegionInfo(map);

          // 지도 이동 또는 확대/축소가 끝난 후 호출되는 이벤트
          window.kakao.maps.event.addListener(map, "idle", function () {
            updateRegionInfo(map);
          });
        });
      };

      // 컴포넌트가 unmount 될 때 스크립트 제거
      return () => document.head.removeChild(script);
    }
  }, [currentPosition]);

  return (
    <>
      {currentPosition ? (
        <div
          id="map"
          style={{
            width: "100%",
            height: "100vh",
          }}
        />
      ) : (
        <Stack minH={"100vh"}>
          <Loading />
        </Stack>
      )}
    </>
  );
};

const MapComponent = () => {
  const { kakao } = window;
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);

  const handleSearch = () => {
    if (!kakao) {
      alert("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        setCoords(coords);

        const container = document.getElementById("map");
        const options = {
          center: coords,
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });

        map.setCenter(coords);
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Stack spacing={4} mb={4}>
          <Input
            placeholder="주소를 입력하세요"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={handleSearch} colorScheme="teal">
            주소로 검색
          </Button>
        </Stack>
        <Box id="map" w="100%" h="400px" />
        {coords && (
          <Text mt={4}>
            좌표: 위도 {coords.getLat()}, 경도 {coords.getLng()}
          </Text>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default MapComponent;
