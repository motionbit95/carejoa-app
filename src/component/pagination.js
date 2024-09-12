import React from "react";
import {
  Button,
  Stack,
  Box,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const getPageButtons = () => {
    const pageButtons = [];
    const delta = 2; // Number of pages to show on either side of the current page

    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(totalPages, currentPage + delta);

    if (currentPage - delta <= 1) {
      endPage = Math.min(
        totalPages,
        endPage + (delta - (currentPage - startPage))
      );
      startPage = Math.max(1, endPage - 2 * delta);
    }

    if (totalPages - currentPage < delta) {
      startPage = Math.max(1, startPage - (delta - (totalPages - currentPage)));
      endPage = Math.min(totalPages, startPage + 2 * delta);
    }

    if (totalPages > 5) {
      //   if (currentPage > 3) {
      //     pageButtons.push(1);
      //     if (currentPage > 4) pageButtons.push("...");
      //   }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
      }

      //   if (currentPage < totalPages - 2) {
      //     if (currentPage < totalPages - 3) pageButtons.push("...");
      //     pageButtons.push(totalPages);
      //   }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    }

    return pageButtons;
  };

  const pageButtons = getPageButtons();

  // Define responsive styles for buttons
  const buttonSize = useBreakpointValue({ base: "xs", md: "md" });

  return (
    <Stack direction="row" spacing={4} align="center" justify="center" my={4}>
      <IconButton
        icon={<FiChevronLeft />}
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        size={buttonSize}
      />
      {pageButtons.map((page, index) => (
        <Button
          key={index}
          onClick={() => page !== "..." && handlePageChange(page)}
          variant={page === currentPage ? "solid" : "outline"}
          isDisabled={page === "..."}
          size={buttonSize}
        >
          {page}
        </Button>
      ))}
      <IconButton
        icon={<FiChevronRight />}
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        size={buttonSize}
      />
    </Stack>
  );
};

export default Pagination;
