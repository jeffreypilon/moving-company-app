import { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import userService from '../services/userService';

// Import user photos
import johnAndersonPhoto from '../assets/images/John_Anderson.jpg';
import sarahMitchellPhoto from '../assets/images/Sarah_Mitchell.jpg';
import michaelRobertsPhoto from '../assets/images/Michael_Roberts.jpg';
import emilyJohnsonPhoto from '../assets/images/Emily_Johnson.jpg';
import davidWilliamsPhoto from '../assets/images/David_Williams.jpg';
import jenniferBrownPhoto from '../assets/images/Jennifer_Brown.jpg';
import robertDavisPhoto from '../assets/images/Robert_Davis.jpg';
import lisaMillerPhoto from '../assets/images/Lisa_Miller.jpg';
import jamesWilsonPhoto from '../assets/images/James_Wilson.jpg';

/**
 * ContactsPage Component
 * Display contact information for admin users
 */
function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Photo mapping
  const photoMap = {
    'John_Anderson.jpg': johnAndersonPhoto,
    'Sarah_Mitchell.jpg': sarahMitchellPhoto,
    'Michael_Roberts.jpg': michaelRobertsPhoto,
    'Emily_Johnson.jpg': emilyJohnsonPhoto,
    'David_Williams.jpg': davidWilliamsPhoto,
    'Jennifer_Brown.jpg': jenniferBrownPhoto,
    'Robert_Davis.jpg': robertDavisPhoto,
    'Lisa_Miller.jpg': lisaMillerPhoto,
    'James_Wilson.jpg': jamesWilsonPhoto
  };

  const getUserPhotoPath = (photoFilename) => {
    if (!photoFilename) return null;
    return photoMap[photoFilename] || null;
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAdminUsers();
      setContacts(response.users);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact information. Please try again later.');
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
        <p className="mt-3">Loading contact information...</p>
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
      <h1 className="mb-4">Contact Us</h1>
      
      {/* Contact Information Card */}
      <Card 
        className="shadow-sm mb-4" 
        style={{ borderRadius: '15px', border: '2px solid #dee2e6' }}
      >
        <Card.Body className="p-4">
          <p className="lead mb-4">
            Need help with your moving and packing needs? Our dedicated team is here to assist you! 
            Please feel free to reach out to any of our experienced staff members below. We're committed 
            to making your move as smooth and stress-free as possible.
          </p>
          
          <hr className="my-4" />
          
          {/* Contact List */}
          {contacts.length === 0 ? (
            <Alert variant="info">No contact information available at this time.</Alert>
          ) : (
            <div>
              {contacts.map((contact, index) => (
                <div key={contact._id}>
                  {index > 0 && <hr className="my-4" />}
                  
                  {/* User Photo in rounded rectangle */}
                  {contact.photoFilename && getUserPhotoPath(contact.photoFilename) && (
                    <div className="mb-3">
                      <div 
                        style={{ 
                          borderRadius: '15px', 
                          border: '2px solid #dee2e6',
                          overflow: 'hidden',
                          width: '150px',
                          height: '150px'
                        }}
                      >
                        <img 
                          src={getUserPhotoPath(contact.photoFilename)} 
                          alt={`${contact.firstName} ${contact.lastName}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <strong className="fs-5">
                      {contact.firstName} {contact.lastName}
                    </strong>
                  </div>
                  <div className="mb-1">
                    <strong>Phone:</strong> {contact.phone}
                  </div>
                  <div>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${contact.email}`} className="text-decoration-none">
                      {contact.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ContactsPage;
