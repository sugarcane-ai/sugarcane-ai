import React from "react";
import Paginate from '@mui/material/Pagination';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange,}) => {

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  return (
    <Paginate
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
    />
  )
}

export default Pagination;
