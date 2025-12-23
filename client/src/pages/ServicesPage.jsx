import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import serviceService from '../services/serviceService';

/**
 * ServicesPage Component
 * Displays all available services from the database
 */
function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceService.getAllServices();
      
      // Sort services alphabetically by title (ascending)
      // response.services because serviceService already extracts data.services
      const sortedServices = response.services.sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      
      setServices(sortedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading services...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Our Services</h1>
      <p className="lead mb-5">Explore our comprehensive moving services.</p>

      {services.length === 0 ? (
        <Alert variant="info">No services available at this time.</Alert>
      ) : (
        <Row>
          {services.map((service) => (
            <Col key={service._id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm" style={{ borderRadius: '15px' }}>
                <Card.Body className="d-flex flex-column">
                  {/* Service Image in nested rounded rectangle */}
                  <div 
                    className="mb-3" 
                    style={{ 
                      borderRadius: '10px', 
                      border: '2px solid #dee2e6',
                      overflow: 'hidden'
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={service.imageUrl}
                      alt={service.title}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  {/* Service Title */}
                  <Card.Title className="fw-bold mb-3">
                    {service.title}
                  </Card.Title>

                  {/* Service Description */}
                  <Card.Text className="flex-grow-1">
                    {service.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ServicesPage;
