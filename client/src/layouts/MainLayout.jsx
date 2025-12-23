import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '../components/common/PageHeader';
import LeftNavbar from '../components/common/LeftNavbar';

/**
 * MainLayout Component
 * Main application layout structure with fixed header and left sidebar
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main content area
 */
function MainLayout({ children }) {
  return (
    <div className="main-layout">
      {/* Fixed Top Header */}
      <PageHeader />

      {/* Main Content Area with Top Padding to account for fixed header */}
      <Container fluid style={{ paddingTop: '70px' }}>
        <Row>
          {/* Left Sidebar (Scrollable) */}
          <Col xs={12} md={3} lg={2} className="d-none d-md-block p-3">
            <LeftNavbar />
          </Col>

          {/* Main Content Area */}
          <Col xs={12} md={9} lg={10}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
