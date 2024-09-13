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
import { regionMap } from "../data";

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
