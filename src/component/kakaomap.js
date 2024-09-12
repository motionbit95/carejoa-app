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

export const Distance = ({ address, currentPosition }) => {
  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (!window.kakao) {
      alert("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
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
  }, [address]);

  return (
    <>
      {coords && (
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
