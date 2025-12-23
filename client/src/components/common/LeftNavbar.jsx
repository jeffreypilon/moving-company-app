import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Button, Stack } from 'react-bootstrap';
import PropTypes from 'prop-types';

// Import all user photos
import davidWilliamsPhoto from '../../assets/images/David_Williams.jpg';
import emilyJohnsonPhoto from '../../assets/images/Emily_Johnson.jpg';
import jamesWilsonPhoto from '../../assets/images/James_Wilson.jpg';
import jenniferBrownPhoto from '../../assets/images/Jennifer_Brown.jpg';
import johnAndersonPhoto from '../../assets/images/John_Anderson.jpg';
import lisaMillerPhoto from '../../assets/images/Lisa_Miller.jpg';
import michaelRobertsPhoto from '../../assets/images/Michael_Roberts.jpg';
import robertDavisPhoto from '../../assets/images/Robert_Davis.jpg';
import sarahMitchellPhoto from '../../assets/images/Sarah_Mitchell.jpg';

/**
 * LeftNavbar Component
 * Scrollable left sidebar with conditional content based on authentication status
 * Shows Latest News and Testimonials when logged out
 * Shows user profile and role-specific buttons when logged in
 */
function LeftNavbar() {
  // Get authentication state and user info from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  /**
   * Get user photo path
   * Maps photoFilename to imported image assets
   */
  const getUserPhotoPath = () => {
    if (!user?.photoFilename) {
      return null;
    }
    
    // Map of filenames to imported images
    const photoMap = {
      'David_Williams.jpg': davidWilliamsPhoto,
      'Emily_Johnson.jpg': emilyJohnsonPhoto,
      'James_Wilson.jpg': jamesWilsonPhoto,
      'Jennifer_Brown.jpg': jenniferBrownPhoto,
      'John_Anderson.jpg': johnAndersonPhoto,
      'Lisa_Miller.jpg': lisaMillerPhoto,
      'Michael_Roberts.jpg': michaelRobertsPhoto,
      'Robert_Davis.jpg': robertDavisPhoto,
      'Sarah_Mitchell.jpg': sarahMitchellPhoto
    };
    
    return photoMap[user.photoFilename] || null;
  };

  /**
   * Render content when user is NOT logged in
   */
  const renderLoggedOutContent = () => (
    <>
      {/* Latest News Section */}
      <Card className="mb-3">
        <Card.Header className="bg-primary text-white fw-bold">
          Latest News
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <p className="mb-2">
              Star Movers expands service coverage to three new metropolitan areas this month.
            </p>
          </div>
          <div className="mb-3">
            <p className="mb-2">
              We&apos;ve added eco-friendly moving trucks to our fleet reducing our carbon footprint.
            </p>
          </div>
          <div className="mb-0">
            <p className="mb-0">
              Star Movers receives Best Moving Company Award for exceptional customer service.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Customer Testimonials Section */}
      <Card>
        <Card.Header className="bg-success text-white fw-bold">
          Customer Testimonials
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <p className="mb-1">
              Star Movers made our cross-country move absolutely seamless and stress-free!
            </p>
            <p className="fst-italic text-muted mb-0">- Jennifer Thompson</p>
          </div>
          <div className="mb-3">
            <p className="mb-1">
              Professional, efficient, and careful with all our belongings - highly recommend!
            </p>
            <p className="fst-italic text-muted mb-0">- Michael Chen</p>
          </div>
          <div className="mb-3">
            <p className="mb-1">
              Best moving experience ever, the team went above and beyond our expectations.
            </p>
            <p className="fst-italic text-muted mb-0">- Sarah Williams</p>
          </div>
          <div className="mb-0">
            <p className="mb-1">
              Punctual, courteous, and took great care of our furniture and fragile items.
            </p>
            <p className="fst-italic text-muted mb-0">- David Martinez</p>
          </div>
        </Card.Body>
      </Card>
    </>
  );

  /**
   * Render content when user IS logged in
   */
  const renderLoggedInContent = () => {
    const isAdmin = user?.userType === 'admin';
    const photoPath = getUserPhotoPath();

    return (
      <>
        {/* User Profile Section */}
        <Card className="mb-3">
          <Card.Body className="text-center">
            {/* User Photo */}
            <div className="d-flex justify-content-center mb-3">
              {photoPath ? (
                <img
                  src={photoPath}
                  alt={user.fullName || 'User'}
                  className="rounded"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '3px solid #ddd'
                  }}
                />
              ) : (
                <div
                  className="rounded d-flex align-items-center justify-content-center bg-secondary text-white"
                  style={{
                    width: '150px',
                    height: '150px',
                    border: '3px solid #ddd',
                    fontSize: '48px',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
            </div>

            {/* User Name */}
            <h5 className="fw-bold mb-1">
              {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
            </h5>

            {/* User Type */}
            <p className="text-muted mb-0">
              {user?.userType === 'admin' ? 'Admin' : 'Customer'}
            </p>
          </Card.Body>
        </Card>

        {/* Navigation Buttons Section */}
        <Card>
          <Card.Body>
            <Stack gap={2}>
              {/* Common button for both user types */}
              <Button
                as={Link}
                to="/dashboard"
                variant="primary"
                className="w-100"
              >
                Dashboard
              </Button>

              {/* Admin-specific buttons */}
              {isAdmin ? (
                <>
                  <Button
                    as={Link}
                    to="/add-service"
                    variant="outline-primary"
                    className="w-100"
                  >
                    Add Service
                  </Button>
                  <Button
                    as={Link}
                    to="/view-service"
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Service
                  </Button>
                  <Button
                    as={Link}
                    to="/view-message"
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Message
                  </Button>
                  <Button
                    as={Link}
                    to="/view-quote"
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Quote
                  </Button>
                  <Button
                    as={Link}
                    to="/view-orders"
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Orders
                  </Button>
                </>
              ) : (
                /* Customer-specific buttons */
                <>
                  <Button
                    as={Link}
                    to="/request-service"
                    variant="outline-primary"
                    className="w-100"
                  >
                    Request Service
                  </Button>
                  <Button
                    as={Link}
                    to="/quick-quote"
                    variant="outline-primary"
                    className="w-100"
                  >
                    Quick Quote
                  </Button>
                  <Button
                    as={Link}
                    to="/new-inquiry"
                    variant="outline-primary"
                    className="w-100"
                  >
                    New Inquiry
                  </Button>
                  <Button
                    as={Link}
                    to="/view-orders"
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Orders
                  </Button>
                </>
              )}
            </Stack>
          </Card.Body>
        </Card>
      </>
    );
  };

  return (
    <div className="left-navbar" style={{ width: '280px' }}>
      {isAuthenticated ? renderLoggedInContent() : renderLoggedOutContent()}
    </div>
  );
}

LeftNavbar.propTypes = {
  // No props needed - gets auth state from Redux store
};

export default LeftNavbar;
