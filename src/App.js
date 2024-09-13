import logo from "./logo.svg";
import "./App.css";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Search from "./pages/search/search";
import Counseling from "./pages/counseling/counseling";
import CounselList from "./pages/counseling/counsel_list";
import CounselView from "./pages/counseling/counsel_view";
import MyPage from "./pages/mypage/mypage";
import Login from "./pages/mypage/login";
import Setting from "./pages/mypage/setting";

function App() {
  return (
    <ChakraProvider>
      <Container maxW={"container.sm"} p={0}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/counseling" element={<CounselList />} />
            <Route path="/counseling/register" element={<Counseling />} />
            <Route path="/counseling/view*" element={<CounselView />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage/setting" element={<Setting />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  );
}

export default App;
