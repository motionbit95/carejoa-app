import { Button, HStack, IconButton } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, setCurrentPage, totalPages, ...props }) => {
  useEffect(() => {
    console.log(currentPage, totalPages);
  }, [currentPage]);
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    let startPage, endPage;

    // 현재 페이지를 기준으로 앞뒤로 2개씩 페이지를 보여줌
    startPage = currentPage - 2;
    endPage = currentPage + 2;

    // startPage가 1보다 작으면 1로 설정
    if (startPage < 1) {
      startPage = 1;
      endPage = 5;
    }

    // endPage가 totalPages보다 크면 조정
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - 4 > 1 ? totalPages - 4 : 1; // 최소 1부터 시작
    }

    // 페이지 번호 버튼 생성
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          borderRadius={"full"}
          variant={i === currentPage ? "solid" : "unstyled"}
          key={i}
          onClick={() => handleClick(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <HStack {...props} spacing={2} w={"full"} justifyContent={"center"} p={4}>
      <IconButton
        icon={<FiChevronLeft />}
        onClick={() => handleClick(currentPage - 1)}
        isDisabled={currentPage === 1}
      />
      {renderPageNumbers()}
      <IconButton
        icon={<FiChevronRight />}
        onClick={() => handleClick(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      />
    </HStack>
  );
};

export default Pagination;
