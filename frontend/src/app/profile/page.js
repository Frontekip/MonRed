'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUser(data);
      setProfileForm({
        name: data.name,
        email: data.email
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setUser(data.user);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message);
      }

      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h1 className="mb-4">Account Settings</h1>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Profile Information</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleProfileUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Change Password</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handlePasswordChange}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
} 