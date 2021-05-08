import React from 'react';
import Navbar from "react-bootstrap/navbar";

export const Nav = () => (
    <Navbar bg="dark" variant="dark" className="p-2">
        <Navbar.Brand href="#home">
        <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
        />{' '}
        Publically Sourced Research and Analytics.
        </Navbar.Brand>
    </Navbar>
  );