import { HStack, Icon } from "@chakra-ui/react";
import React from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

function Rating(props) {
  return (
    <HStack spacing={1}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          cursor={"pointer"}
          key={i}
          as={i < props.rating ? BsStarFill : BsStar}
          alt="star"
          onClick={() => props.setRating(i + 1)}
          color={i < props.rating ? "yellow.400" : "gray.300"}
          {...props}
        />
      ))}
    </HStack>
  );
}

export default Rating;
