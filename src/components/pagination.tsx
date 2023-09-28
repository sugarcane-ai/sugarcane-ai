import React from "react";
import ReactPaginate from "react-paginate";


interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({pageCount, onPageChange}) => {

  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      pageCount={pageCount}
      onPageChange={onPageChange}
      nextLinkClassName="pagination__link"
      disabledClassName="pagination__link--disabled"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
    />
  )
}

export default Pagination;
