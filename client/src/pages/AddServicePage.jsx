import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import serviceService from '../services/serviceService';

function AddServicePage() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateTitle = (value) => {
    if (!value.trim()) return 'Title is required';
    return '';
  };

  const validateDescription = (value) => {
    if (!value.trim()) return 'Description is required';
    return '';
  };

  const validateImageUrl = (value) => {
    if (!value.trim()) return 'Image URL is required';
    // Basic URL validation
    try {
      new URL(value);
      return '';
    } catch (e) {
      return 'Please enter a valid URL';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'title':
        error = validateTitle(value);
        break;
      case 'description':
        error = validateDescription(value);
        break;
      case 'imageUrl':
        error = validateImageUrl(value);
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: validateTitle(formData.title),
      description: validateDescription(formData.description),
      imageUrl: validateImageUrl(formData.imageUrl)
    };

    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim()
      };

      await serviceService.createService(serviceData);
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Service creation error:', error);
      
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('An error occurred while creating the service. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Add Service</h2>
              
              {apiError && (
                <Alert variant="danger" dismissible onClose={() => setApiError('')}>
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.title}
                    placeholder="Enter service title"
                  />
                  {errors.title && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.title}
                    </div>
                  )}
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.description}
                    placeholder="Enter service description"
                  />
                  {errors.description && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.description}
                    </div>
                  )}
                </Form.Group>

                {/* Image URL */}
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.imageUrl}
                    placeholder="Enter image URL"
                  />
                  {errors.imageUrl && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.imageUrl}
                    </div>
                  )}
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex gap-2 mb-3">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-grow-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleModalOk} centered backdrop="static">
        <Modal.Body className="text-center py-4">
          <h5 className="mb-3">Service Added</h5>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0">
          <Button variant="primary" onClick={handleModalOk}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddServicePage;
