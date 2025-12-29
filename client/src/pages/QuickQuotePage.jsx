import { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import serviceService from '../services/serviceService';
import quoteService from '../services/quoteService';
import serviceAreaService from '../services/serviceAreaService';

// US States list
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

/**
 * QuickQuotePage Component
 * Form for users to request a moving quote
 */
function QuickQuotePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    // Moving From
    fromStreetAddress: '',
    fromCity: '',
    fromState: '',
    fromZipCode: '',
    // Moving To
    toStreetAddress: '',
    toCity: '',
    toState: '',
    toZipCode: '',
    // Move Date
    moveDate: '',
    // Service
    serviceId: ''
  });

  const [services, setServices] = useState([]);
  const [activeServiceAreas, setActiveServiceAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load services and active service areas on component mount
  useEffect(() => {
    fetchServices();
    fetchActiveServiceAreas();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to request a quote');
    }
  }, [isAuthenticated]);

  /**
   * Fetch available services
   */
  const fetchServices = async () => {
    try {
      const response = await serviceService.getAllServices();
      const activeServices = response.services.filter(service => service.isActive);
      setServices(activeServices.sort((a, b) => a.title.localeCompare(b.title)));
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    }
  };

  /**
   * Fetch active service areas
   */
  const fetchActiveServiceAreas = async () => {
    try {
      const response = await serviceAreaService.getActiveServiceAreas();
      const activeStates = response.data?.serviceAreas || [];
      setActiveServiceAreas(activeStates.map(area => area.stateCode));
    } catch (err) {
      console.error('Error fetching active service areas:', err);
      // Don't set error here as it's not critical for form display
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Handle form reset
   */
  const handleReset = () => {
    setFormData({
      fromStreetAddress: '',
      fromCity: '',
      fromState: '',
      fromZipCode: '',
      toStreetAddress: '',
      toCity: '',
      toState: '',
      toZipCode: '',
      moveDate: '',
      serviceId: ''
    });
    setValidated(false);
    setError('');
    setSuccess('');
  };

  /**
   * Validate zip code format
   */
  const isValidZipCode = (zipCode) => {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  };

  /**
   * Check if state is in active service area
   */
  const isStateInServiceArea = (stateCode) => {
    return activeServiceAreas.includes(stateCode);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('You must be logged in to request a quote');
      return;
    }

    // Additional validation
    if (!isValidZipCode(formData.fromZipCode)) {
      setError('Please enter a valid "From" zip code (e.g., 12345 or 12345-6789)');
      return;
    }

    if (!isValidZipCode(formData.toZipCode)) {
      setError('Please enter a valid "To" zip code (e.g., 12345 or 12345-6789)');
      return;
    }

    // Validate service areas
    if (!isStateInServiceArea(formData.fromState)) {
      setError('Selected "Moving From" state is outside of our service area. Please select a state within the service area.');
      return;
    }

    if (!isStateInServiceArea(formData.toState)) {
      setError('Selected "Moving To" state is outside of our service area. Please select a state within the service area.');
      return;
    }

    // Check if move date is in the future
    const selectedDate = new Date(formData.moveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Move date must be in the future');
      return;
    }

    if (form.checkValidity() === false) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await quoteService.createQuote(formData);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error creating quote:', err);
      setError(err.response?.data?.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle success modal OK button click
   */
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Quick Quote</h1>

      {!isAuthenticated && (
        <Alert variant="warning">
          You must be <Alert.Link onClick={() => navigate('/login')}>logged in</Alert.Link> to request a quote.
        </Alert>
      )}

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Card style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}>
        <Card.Body className="p-4">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Moving From Section */}
            <h5 className="fw-bold mb-3">Moving From</h5>
            
            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                name="fromStreetAddress"
                value={formData.fromStreetAddress}
                onChange={handleChange}
                required
                placeholder="Enter street address"
                disabled={!isAuthenticated}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a street address.
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="fromCity"
                    value={formData.fromCity}
                    onChange={handleChange}
                    required
                    placeholder="Enter city"
                    disabled={!isAuthenticated}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a city.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="fromState"
                    value={formData.fromState}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select...</option>
                    {US_STATES.map(state => {
                      const inServiceArea = isStateInServiceArea(state);
                      return (
                        <option 
                          key={state} 
                          value={state}
                          disabled={!inServiceArea}
                          style={{ color: inServiceArea ? 'inherit' : '#999' }}
                        >
                          {state} {!inServiceArea ? '(Not serviced)' : ''}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a state.
                  </Form.Control.Feedback>
                  {activeServiceAreas.length > 0 && (
                    <Form.Text className="text-muted">
                      Only states within our service area are available
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="fromZipCode"
                    value={formData.fromZipCode}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                    maxLength="10"
                    disabled={!isAuthenticated}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid zip code.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            {/* Moving To Section */}
            <h5 className="fw-bold mb-3">Moving To</h5>
            
            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                name="toStreetAddress"
                value={formData.toStreetAddress}
                onChange={handleChange}
                required
                placeholder="Enter street address"
                disabled={!isAuthenticated}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a street address.
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="toCity"
                    value={formData.toCity}
                    onChange={handleChange}
                    required
                    placeholder="Enter city"
                    disabled={!isAuthenticated}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a city.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="toState"
                    value={formData.toState}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select...</option>
                    {US_STATES.map(state => {
                      const inServiceArea = isStateInServiceArea(state);
                      return (
                        <option 
                          key={state} 
                          value={state}
                          disabled={!inServiceArea}
                          style={{ color: inServiceArea ? 'inherit' : '#999' }}
                        >
                          {state} {!inServiceArea ? '(Not serviced)' : ''}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a state.
                  </Form.Control.Feedback>
                  {activeServiceAreas.length > 0 && (
                    <Form.Text className="text-muted">
                      Only states within our service area are available
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="toZipCode"
                    value={formData.toZipCode}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                    maxLength="10"
                    disabled={!isAuthenticated}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid zip code.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            {/* Move Date */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Move Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="moveDate"
                    value={formData.moveDate}
                    onChange={handleChange}
                    required
                    min={getMinDate()}
                    disabled={!isAuthenticated}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a move date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Select Service */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Service</Form.Label>
                  <Form.Select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select a service...</option>
                    {services.map(service => (
                      <option key={service._id} value={service._id}>
                        {service.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a service.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Buttons */}
            <div className="d-flex gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !isAuthenticated}
              >
                {loading ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={handleReset}
                disabled={loading || !isAuthenticated}
              >
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={handleSuccessModalClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Quote submitted successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessModalClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default QuickQuotePage;
