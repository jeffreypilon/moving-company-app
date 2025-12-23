import { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/star_movers_logo_1_small.jpg';

/**
 * PageHeader Component
 * Fixed top navigation bar with company logo and menu items
 * Always visible at the top of the page even when scrolling
 */
function PageHeader() {
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      bg="light" 
      variant="light" 
      expand="lg" 
      fixed="top" 
      className="border-bottom shadow-sm"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container fluid>
        {/* Company Logo */}
        <Navbar.Brand as={Link} to="/" onClick={handleNavClick} className="d-flex align-items-center">
          <img
            src={logoImage}
            alt="Star Movers Logo"
            height="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Toggle button for mobile view */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navigation Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-4">
            <Nav.Link as={Link} to="/" onClick={handleNavClick} className="px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={handleNavClick} className="px-3">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/contacts" onClick={handleNavClick} className="px-3">
              Contacts
            </Nav.Link>
            <Nav.Link as={Link} to="/services" onClick={handleNavClick} className="px-3">
              Services
            </Nav.Link>
            <Nav.Link as={Link} to="/prices" onClick={handleNavClick} className="px-3">
              Prices
            </Nav.Link>
            <Nav.Link as={Link} to="/quick-quote" onClick={handleNavClick} className="px-3">
              QuickQuote
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PageHeader;
