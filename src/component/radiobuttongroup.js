import { RadioGroup, Stack, Box } from "@chakra-ui/react";
import { useState } from "react";

function RadioButtonGroup(props) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <RadioGroup onChange={setValue} value={value}>
      <Stack direction="row" spacing={4} w={"full"}>
        {props.list.map((item) => (
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
            borderRadius="md"
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
