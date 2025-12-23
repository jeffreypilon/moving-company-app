import { Container } from 'react-bootstrap';
import logoImage from '../assets/images/star_movers_logo_1.jpg';

/**
 * HomePage Component
 * Landing page for Star Movers
 */
function HomePage() {
  return (
    <Container className="py-5">
      <h1>Welcome to Star Movers</h1>
      <p className="lead">Your trusted partner for all your moving needs.</p>
      
      {/* Star Movers Logo */}
      <div className="d-flex justify-content-center my-4">
        <img
          src={logoImage}
          alt="Star Movers Logo"
          style={{
            width: '75%',
            height: 'auto',
            borderRadius: '15px',
            border: '2px solid #dee2e6'
          }}
        />
      </div>
      
      <p>This is the home page. Content will be added later.</p>
    </Container>
  );
}

export default HomePage;
