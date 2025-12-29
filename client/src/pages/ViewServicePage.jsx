import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import serviceService from '../services/serviceService';

/**
 * ViewServicePage Component
 * Admin page to view and manage all services
 */
function ViewServicePage() {
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true
  });
  const [editValidated, setEditValidated] = useState(false);

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  /**
   * Fetch all services
   */
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceService.getAllServices();
      const sortedServices = response.services.sort((a, b) => a.title.localeCompare(b.title));
      setServices(sortedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEditClick = (service) => {
    setSelectedService(service);
    setEditFormData({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      isActive: service.isActive
    });
    setEditValidated(false);
    setShowEditModal(true);
  };

  /**
   * Handle delete button click
   */
  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  /**
   * Handle edit form input change
   */
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Handle edit form submission
   */
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setEditValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    try {
      setError('');
      await serviceService.updateService(selectedService._id, editFormData);
      setSuccess(`Service "${editFormData.title}" updated successfully!`);
      setShowEditModal(false);
      fetchServices();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err.response?.data?.message || 'Failed to update service. Please try again.');
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    try {
      setError('');
      await serviceService.deleteService(selectedService._id);
      setSuccess(`Service "${selectedService.title}" deleted successfully!`);
      setShowDeleteModal(false);
      fetchServices();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service. Please try again.');
      setShowDeleteModal(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedService(null);
    setEditValidated(false);
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>View Services</h1>
          <p className="lead text-muted mb-0">Manage all services offered by Star Movers</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/add-service')}
        >
          Add New Service
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <p>Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <Alert variant="info">
          No services found. Click "Add New Service" to create one.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {services.map((service) => (
            <Col key={service._id}>
              <Card 
                style={{ 
                  borderRadius: '15px', 
                  border: '2px solid #dee2e6',
                  height: '100%'
                }}
              >
                {/* Service Image */}
                <div style={{ 
                  borderRadius: '10px', 
                  border: '2px solid #dee2e6',
                  margin: '15px 15px 0 15px',
                  overflow: 'hidden'
                }}>
                  <Card.Img 
                    variant="top" 
                    src={service.imageUrl} 
                    alt={service.title}
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>

                <Card.Body className="d-flex flex-column">
                  {/* Title and Status Badge */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold mb-0">
                      {service.title}
                    </Card.Title>
                    <Badge 
                      bg={service.isActive ? 'success' : 'secondary'}
                      className="ms-2"
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Description */}
                  <Card.Text className="flex-grow-1">
                    {service.description}
                  </Card.Text>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => handleEditClick(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => handleDeleteClick(service)}
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      Created: {new Date(service.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit Service Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseModals}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={editValidated} onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                required
                placeholder="Enter service title"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a service title.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                required
                placeholder="Enter service description"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a service description.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={editFormData.imageUrl}
                onChange={handleEditChange}
                required
                placeholder="Enter image URL"
              />
              <Form.Control.Feedback type="invalid">
                Please provide an image URL.
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Provide a URL to an image (e.g., from Adobe Stock, Unsplash, etc.)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                label="Active (Service is available to customers)"
                checked={editFormData.isActive}
                onChange={handleEditChange}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={handleCloseModals}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this service?</p>
          <div className="bg-light p-3 rounded">
            <strong>{selectedService?.title}</strong>
            <p className="mb-0 text-muted small mt-2">{selectedService?.description}</p>
          </div>
          <Alert variant="warning" className="mt-3 mb-0">
            <small>⚠️ This action cannot be undone.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Service
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ViewServicePage;
