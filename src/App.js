import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Center,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Search from "./pages/search/search";
import Counseling from "./pages/counseling/counseling";
import CounselList from "./pages/counseling/counsel_list";
import CounselView from "./pages/counseling/counsel_view";
import MyPage from "./pages/mypage/mypage";
import Login from "./pages/mypage/login";
import Setting from "./pages/mypage/setting";
import CommunityList from "./pages/community/community_list";
import CommunityRegister from "./pages/community/community_register";
import SignUp from "./pages/mypage/signup";
import Find from "./pages/mypage/find";
import Review from "./pages/mypage/review";
import Detail from "./pages/search/detail";
import Goods from "./pages/mypage/goods";
import MapSearch from "./pages/search/map_search";

function App() {
  return (
    <ChakraProvider>
      <Flex bgColor={"gray.50"}>
        <Container maxW={"480px"} p={0} bgColor={"white"}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/mapsearch" element={<MapSearch />} />
              <Route path="/detail/*" element={<Detail />} />
              <Route path="/community/*" element={<CommunityList />} />
              <Route
                path="/community/register"
                element={<CommunityRegister />}
              />
              <Route path="/counseling" element={<CounselList />} />
              <Route path="/counseling/register" element={<Counseling />} />
              <Route path="/counseling/view*" element={<CounselView />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/review/*" element={<Review />} />
              <Route path="/goods/*" element={<Goods />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/find/*" element={<Find />} />
              <Route path="/mypage/setting" element={<Setting />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
