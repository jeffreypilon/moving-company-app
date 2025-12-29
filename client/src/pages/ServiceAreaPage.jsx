import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import serviceAreaService from '../services/serviceAreaService';

/**
 * ServiceAreaPage Component
 * Admin page to manage service areas with interactive US map
 */
function ServiceAreaPage() {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  /**
   * Fetch all service areas
   */
  const fetchServiceAreas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceAreaService.getAllServiceAreas();
      const areas = response.data?.serviceAreas || [];
      setServiceAreas(areas);
    } catch (err) {
      console.error('Error fetching service areas:', err);
      if (err.response?.status === 404 || err.response?.data?.message?.includes('not found')) {
        setError('Service areas not initialized. Click "Initialize States" to set up all continental US states.');
      } else {
        setError('Failed to load service areas. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize all states
   */
  const handleInitializeStates = async () => {
    try {
      setInitializing(true);
      setError('');
      await serviceAreaService.initializeStates();
      setSuccess('All 48 continental US states have been initialized!');
      fetchServiceAreas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error initializing states:', err);
      setError(err.response?.data?.message || 'Failed to initialize states.');
    } finally {
      setInitializing(false);
    }
  };

  /**
   * Toggle state active status
   */
  const handleStateClick = async (stateCode) => {
    try {
      setError('');
      const response = await serviceAreaService.toggleServiceAreaStatus(stateCode);
      const updatedArea = response.data?.serviceArea;
      
      // Update local state
      setServiceAreas(prev =>
        prev.map(area =>
          area.stateCode === stateCode
            ? { ...area, isActive: updatedArea.isActive }
            : area
        )
      );
      
      const stateName = serviceAreas.find(a => a.stateCode === stateCode)?.stateName;
      setSuccess(`${stateName} ${updatedArea.isActive ? 'activated' : 'deactivated'}`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error toggling state:', err);
      setError('Failed to update state. Please try again.');
    }
  };

  /**
   * Check if state is active
   */
  const isStateActive = (stateCode) => {
    const area = serviceAreas.find(a => a.stateCode === stateCode);
    return area?.isActive || false;
  };

  /**
   * Get active state count
   */
  const getActiveCount = () => {
    return serviceAreas.filter(a => a.isActive).length;
  };

  // State data with positions for SVG map
  const states = [
    // West Coast
    { code: 'WA', x: 50, y: 40, w: 80, h: 60 },
    { code: 'OR', x: 50, y: 105, w: 80, h: 60 },
    { code: 'CA', x: 30, y: 170, w: 90, h: 120 },
    // Mountain
    { code: 'ID', x: 135, y: 70, w: 70, h: 80 },
    { code: 'MT', x: 210, y: 40, w: 100, h: 70 },
    { code: 'WY', x: 210, y: 115, w: 90, h: 70 },
    { code: 'NV', x: 125, y: 155, w: 70, h: 90 },
    { code: 'UT', x: 200, y: 190, w: 60, h: 75 },
    { code: 'CO', x: 265, y: 200, w: 85, h: 70 },
    { code: 'AZ', x: 200, y: 270, w: 80, h: 80 },
    { code: 'NM', x: 285, y: 275, w: 75, h: 85 },
    // Plains
    { code: 'ND', x: 315, y: 45, w: 85, h: 55 },
    { code: 'SD', x: 315, y: 105, w: 85, h: 60 },
    { code: 'NE', x: 355, y: 170, w: 85, h: 60 },
    { code: 'KS', x: 365, y: 235, w: 80, h: 60 },
    { code: 'OK', x: 375, y: 300, w: 75, h: 55 },
    { code: 'TX', x: 365, y: 360, w: 110, h: 120 },
    // Midwest
    { code: 'MN', x: 405, y: 70, w: 75, h: 85 },
    { code: 'IA', x: 445, y: 160, w: 70, h: 60 },
    { code: 'MO', x: 450, y: 225, w: 75, h: 75 },
    { code: 'AR', x: 460, y: 305, w: 65, h: 70 },
    { code: 'LA', x: 485, y: 380, w: 75, h: 80 },
    { code: 'WI', x: 485, y: 95, w: 65, h: 80 },
    { code: 'IL', x: 520, y: 180, w: 55, h: 95 },
    { code: 'MI', x: 555, y: 110, w: 75, h: 90 },
    { code: 'IN', x: 580, y: 205, w: 50, h: 75 },
    { code: 'OH', x: 635, y: 190, w: 65, h: 75 },
    // South
    { code: 'MS', x: 530, y: 315, w: 50, h: 80 },
    { code: 'AL', x: 585, y: 320, w: 50, h: 85 },
    { code: 'TN', x: 580, y: 265, w: 95, h: 50 },
    { code: 'KY', x: 625, y: 230, w: 80, h: 30 },
    { code: 'FL', x: 650, y: 410, w: 110, h: 80 },
    { code: 'GA', x: 645, y: 330, w: 65, h: 75 },
    { code: 'SC', x: 715, y: 305, w: 60, h: 55 },
    { code: 'NC', x: 710, y: 250, w: 85, h: 50 },
    // East Coast
    { code: 'WV', x: 710, y: 220, w: 45, h: 45 },
    { code: 'VA', x: 760, y: 215, w: 75, h: 50 },
    { code: 'MD', x: 800, y: 195, w: 45, h: 25 },
    { code: 'DE', x: 850, y: 195, w: 25, h: 30 },
    { code: 'PA', x: 760, y: 160, w: 85, h: 50 },
    { code: 'NJ', x: 850, y: 160, w: 35, h: 50 },
    { code: 'NY', x: 800, y: 100, w: 85, h: 55 },
    { code: 'CT', x: 890, y: 140, w: 35, h: 20 },
    { code: 'RI', x: 920, y: 135, w: 20, h: 20 },
    { code: 'MA', x: 890, y: 110, w: 50, h: 25 },
    { code: 'VT', x: 870, y: 80, w: 30, h: 40 },
    { code: 'NH', x: 905, y: 80, w: 30, h: 40 },
    { code: 'ME', x: 900, y: 40, w: 45, h: 55 }
  ];

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1>Service Area Management</h1>
        <p className="lead text-muted mb-0">
          Click on states in the map to activate or deactivate service areas
        </p>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading service areas...</p>
        </div>
      ) : serviceAreas.length === 0 ? (
        <Card className="text-center p-5" style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}>
          <Card.Body>
            <h3>No Service Areas Found</h3>
            <p className="text-muted mb-4">
              Initialize all 48 continental US states to get started.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleInitializeStates}
              disabled={initializing}
            >
              {initializing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Initializing...
                </>
              ) : (
                'Initialize States'
              )}
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Statistics Card */}
          <Card className="mb-4" style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h5 className="mb-0">Active Service Areas</h5>
                </Col>
                <Col md={6} className="text-end">
                  <Badge bg="success" className="fs-5">
                    {getActiveCount()} of 48 states active
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* US Map */}
          <Card style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}>
            <Card.Body>
              <div className="text-center mb-3">
                <h5>Continental United States Map</h5>
                <p className="text-muted small mb-0">
                  <Badge bg="success" className="me-2">Green</Badge> = Active Service Area
                  <span className="mx-2">|</span>
                  <Badge bg="secondary">Gray</Badge> = Inactive
                </p>
              </div>
              
              {/* SVG Map Container */}
              <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                <svg
                  viewBox="0 0 960 600"
                  style={{ width: '100%', height: 'auto' }}
                >
                  <g id="states">
                    {states.map(state => (
                      <g 
                        key={state.code} 
                        onClick={() => handleStateClick(state.code)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect 
                          x={state.x} 
                          y={state.y} 
                          width={state.w} 
                          height={state.h} 
                          rx="5"
                          fill={isStateActive(state.code) ? '#28a745' : '#6c757d'}
                          stroke="#fff" 
                          strokeWidth="2"
                          style={{ transition: 'fill 0.3s' }}
                        />
                        <text 
                          x={state.x + state.w / 2} 
                          y={state.y + state.h / 2 + 5} 
                          textAnchor="middle" 
                          fill="#fff" 
                          fontSize="16" 
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {state.code}
                        </text>
                      </g>
                    ))}
                  </g>
                </svg>
              </div>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Click on any state to toggle its service area status
                </small>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default ServiceAreaPage;
