import logo from "./logo.svg";
import "./App.css";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Search from "./pages/search/search";

function App() {
  return (
    <ChakraProvider>
      <Container maxW={"container.sm"} p={0}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  );
}

export default App;
