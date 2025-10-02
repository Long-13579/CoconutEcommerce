import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Pagination,
} from "@windmill/react-ui";
// import response from "../utils/demo/usersData";

const UsersTable = ({ resultsPerPage, filter, staffMode }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  // pagination setup
  const [totalResults, setTotalResults] = useState(0);

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    // Use staffMode to determine endpoint
    const endpoint = staffMode
      ? "http://localhost:8000/api/users/users/?staff_only=true"
      : "http://localhost:8000/api/users/users/?staff_only=false";
    fetch(endpoint)
      .then(res => res.json())
      .then(users => {
        setTotalResults(users.length);
        setData(users.slice((page - 1) * resultsPerPage, page * resultsPerPage));
      });
  }, [page, resultsPerPage, staffMode]);

  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined on</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">{user.username}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">
                    {new Date(user.joined_on).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default UsersTable;
