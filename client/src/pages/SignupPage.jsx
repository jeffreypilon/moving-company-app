import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import authService from '../services/authService';

// US States (contiguous continental United States)
const US_STATES = [
  'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 
  'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 
  'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
  'WV', 'WI', 'WY'
];

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format phone number as (xxx)xxx-xxxx
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)})${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)})${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  // Format zip code as xxxxx-xxxx
  const formatZipCode = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
  };

  // Validation functions
  const validateFirstName = (value) => {
    if (!value.trim()) return 'First name is required';
    if (!/^[A-Za-z\s]+$/.test(value)) return 'First name must contain only letters';
    if (value.length > 30) return 'First name must be 30 characters or less';
    return '';
  };

  const validateLastName = (value) => {
    if (!value.trim()) return 'Last name is required';
    if (!/^[A-Za-z\s]+$/.test(value)) return 'Last name must contain only letters';
    if (value.length > 30) return 'Last name must be 30 characters or less';
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    if (value.includes(' ')) return 'Email cannot contain spaces';
    if (!value.includes('@')) return 'Email must include @ symbol';
    if (!value.toLowerCase().endsWith('.com')) return 'Email must end with .com';
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 10) return 'Password must be 10 characters or less';
    if (!/^[A-Za-z0-9]+$/.test(value)) return 'Password must be alphanumeric only';
    return '';
  };

  const validatePhone = (value) => {
    if (!value) return 'Phone number is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 10) return 'Phone number must be 10 digits';
    return '';
  };

  const validateStreetAddress = (value) => {
    if (!value.trim()) return 'Street address is required';
    if (value.length > 30) return 'Street address must be 30 characters or less';
    return '';
  };

  const validateCity = (value) => {
    if (!value.trim()) return 'City is required';
    if (!/^[A-Za-z0-9\s]+$/.test(value)) return 'City must contain only letters and numbers';
    if (value.length > 30) return 'City must be 30 characters or less';
    return '';
  };

  const validateState = (value) => {
    if (!value) return 'State is required';
    return '';
  };

  const validateZipCode = (value) => {
    if (!value) return 'Zip code is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 5 && cleaned.length !== 9) {
      return 'Zip code must be 5 or 9 digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatting
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    } else if (name === 'zipCode') {
      formattedValue = formatZipCode(value);
    } else if (name === 'password' && value.length > 10) {
      return; // Don't allow more than 10 characters
    } else if ((name === 'firstName' || name === 'lastName') && value.length > 30) {
      return; // Don't allow more than 30 characters
    } else if ((name === 'streetAddress' || name === 'city') && value.length > 30) {
      return; // Don't allow more than 30 characters
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
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
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'lastName':
        error = validateLastName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'streetAddress':
        error = validateStreetAddress(value);
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'state':
        error = validateState(value);
        break;
      case 'zipCode':
        error = validateZipCode(value);
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
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      phone: validatePhone(formData.phone),
      streetAddress: validateStreetAddress(formData.streetAddress),
      city: validateCity(formData.city),
      state: validateState(formData.state),
      zipCode: validateZipCode(formData.zipCode)
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
      // Remove formatting from phone and zip before sending to backend
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      const cleanedZip = formData.zipCode.replace(/\D/g, '');

      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: cleanedPhone,
        streetAddress: formData.streetAddress.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zipCode: cleanedZip
      };

      await authService.register(userData);
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setErrors({});
    setApiError('');
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              
              {apiError && (
                <Alert variant="danger" dismissible onClose={() => setApiError('')}>
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* First Name */}
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.firstName}
                    maxLength={30}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.firstName}
                    </div>
                  )}
                </Form.Group>

                {/* Last Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.lastName}
                    maxLength={30}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.lastName}
                    </div>
                  )}
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.email}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.email}
                    </div>
                  )}
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.password}
                      maxLength={10}
                      placeholder="Enter password"
                      style={{ paddingRight: '40px' }}
                    />
                    <Button
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0',
                        border: 'none',
                        background: 'transparent',
                        color: '#6c757d'
                      }}
                      type="button"
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  {errors.password && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.password}
                    </div>
                  )}
                </Form.Group>

                {/* Phone */}
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.phone}
                    placeholder="(xxx)xxx-xxxx"
                  />
                  {errors.phone && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.phone}
                    </div>
                  )}
                </Form.Group>

                {/* Street Address */}
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.streetAddress}
                    maxLength={30}
                    placeholder="Enter street address"
                  />
                  {errors.streetAddress && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.streetAddress}
                    </div>
                  )}
                </Form.Group>

                {/* City */}
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.city}
                    maxLength={30}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.city}
                    </div>
                  )}
                </Form.Group>

                {/* State */}
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.state}
                  >
                    <option value="">Select state...</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Form.Select>
                  {errors.state && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.state}
                    </div>
                  )}
                </Form.Group>

                {/* Zip Code */}
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.zipCode}
                    placeholder="xxxxx-xxxx"
                  />
                  {errors.zipCode && (
                    <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.zipCode}
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
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
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

          {/* Sign In Link */}
          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              style={{ textDecoration: 'none', color: '#0d6efd', fontWeight: '500' }}
            >
              Sign In
            </a>
          </div>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleModalOk} centered backdrop="static">
        <Modal.Body className="text-center py-4">
          <h5 className="mb-3">New User Account Created</h5>
          <p>Please click OK to sign in.</p>
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

export default SignupPage;
