import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/star_movers_logo_1_small.jpg';

/**
 * PageHeader Component
 * Fixed top navigation bar with company logo and menu items
 * Always visible at the top of the page even when scrolling
 */
function PageHeader() {
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top" className="border-bottom shadow-sm">
      <Container fluid>
        {/* Company Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
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
            <Nav.Link as={Link} to="/" className="px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="px-3">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/contacts" className="px-3">
              Contacts
            </Nav.Link>
            <Nav.Link as={Link} to="/services" className="px-3">
              Services
            </Nav.Link>
            <Nav.Link as={Link} to="/prices" className="px-3">
              Prices
            </Nav.Link>
            <Nav.Link as={Link} to="/quick-quote" className="px-3">
              QuickQuote
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PageHeader;
