import React from 'react';

function TrackingListPaginator({ cap, perPage, currentOffset, onChange }) {
  if (!cap || cap < perPage) {
    return null;
  }
  const pagesAmount = Math.ceil(cap / perPage);
  const currPage = currentOffset / perPage;

  function handleClick(newPage) {
    onChange(newPage * perPage);
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currPage < 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handleClick(currPage - 1)}>&laquo;</button>
        </li>
        {(new Array(pagesAmount)).fill(null).map((_, i) => (
          <li key={`paginator-button-${i}`} className={`page-item ${i === currPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handleClick(i)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currPage >= pagesAmount - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handleClick(currPage + 1)}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );
}

export default TrackingListPaginator;