import { RadioGroup, Stack, Box, Heading } from "@chakra-ui/react";
import { useState } from "react";

function RadioButtonGroup(props) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <RadioGroup onChange={setValue} value={value}>
      <Stack direction="row" spacing={0} w={"full"}>
        {props.list.map((item, index) => (
          <Box
            key={item}
            w={"full"}
            as="button"
            onClick={() => {
              setValue(item);
              props.setValue(item);
            }}
            bg={value === item ? "blue.600" : "gray.200"}
            color={value === item ? "white" : "black"}
            px={5}
            py={3}
            borderWidth="1px"
            // borderRadius="md"
            borderLeftRadius={index === 0 ? "lg" : "none"}
            borderRightRadius={index === props.list.length - 1 ? "lg" : "none"}
            cursor="pointer"
            _focus={{ boxShadow: "none" }}
          >
            {item}
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
}

export default RadioButtonGroup;
