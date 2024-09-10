import { Grid, GridItem, Icon, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";

function Category(props) {
  const { onChange } = props;
  return (
    <Grid gridTemplateColumns={"repeat(5, 1fr)"} gap={{ base: 2, md: 4 }}>
      <GridItem>
        <VStack p={2} onClick={() => onChange("/search/map")}>
          <Image src={require("../../assets/icons/icon1.png")} />
          <Text fontSize={"xs"}>지도검색</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack p={2} onClick={() => onChange("/search/location")}>
          <Image src={require("../../assets/icons/icon2.png")} />
          <Text fontSize={"xs"}>지역검색</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=제휴시설")}
        >
          <Image src={require("../../assets/icons/icon3.png")} />
          <Text fontSize={"xs"}>제휴시설</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack p={2} onClick={() => onChange("/search/location?type=요양원")}>
          <Image src={require("../../assets/icons/icon4.png")} />
          <Text fontSize={"xs"}>요양원</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=요양병원")}
        >
          <Image src={require("../../assets/icons/icon5.png")} />
          <Text fontSize={"xs"}>요양병원</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=주야간보호")}
        >
          <Image src={require("../../assets/icons/icon6.png")} />
          <Text fontSize={"xs"}>주야간보호</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=실버타운")}
        >
          <Image src={require("../../assets/icons/icon7.png")} />
          <Text fontSize={"xs"}>실버타운</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=방문요양")}
        >
          <Image src={require("../../assets/icons/icon8.png")} />
          <Text fontSize={"xs"}>방문요양</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=방문목욕")}
        >
          <Image src={require("../../assets/icons/icon9.png")} />
          <Text fontSize={"xs"}>방문목욕</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack p={2} onClick={() => onChange("/search/location?type=양로원")}>
          <Image src={require("../../assets/icons/icon10.png")} />
          <Text fontSize={"xs"}>양로원</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=방문간호")}
        >
          <Image src={require("../../assets/icons/icon11.png")} />
          <Text fontSize={"xs"}>방문간호</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=단기보호")}
        >
          <Image src={require("../../assets/icons/icon12.png")} />
          <Text fontSize={"xs"}>단기보호</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=간병서비스")}
        >
          <Image src={require("../../assets/icons/icon13.png")} />
          <Text fontSize={"xs"}>간병서비스</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack
          p={2}
          onClick={() => onChange("/search/location?type=동행서비스")}
        >
          <Image src={require("../../assets/icons/icon14.png")} />
          <Text fontSize={"xs"}>동행서비스</Text>
        </VStack>
      </GridItem>
    </Grid>
  );
}

export default Category;
