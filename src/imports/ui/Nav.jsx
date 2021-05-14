import React from 'react';
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/navbar";
import NavB from "react-bootstrap/nav";

export const Nav = () => (
    <Navbar bg="dark" variant="dark" className="p-2">
        <Navbar.Brand href="/">SpaceIntel</Navbar.Brand>
         
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <NavB className="mr-auto">
                    <NavB.Link href="#"><Link to="/satellites">Satellites</Link></NavB.Link>
                    <NavB.Link href="#"><Link to="/schemas">Schemas</Link></NavB.Link>
                    {/* <NavB.Link href="sources">Data Sources</NavB.Link> */}
                    <NavB.Link href="#"><Link to="/about">About</Link></NavB.Link>
                </NavB>
            </Navbar.Collapse>
    </Navbar>
  );