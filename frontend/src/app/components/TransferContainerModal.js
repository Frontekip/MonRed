'use client';

import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';

export default function TransferContainerModal({ show, handleClose, handleTransfer, containerName, isTransferring }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await handleTransfer(email);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isTransferring}>
          <Modal.Title>
            <i className="fas fa-exchange-alt me-2"></i>
            Transfer Container
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Transfer <strong>{containerName}</strong> to another user</p>
          
          {error && (
            <Alert variant="danger" className="mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            The target user must:
            <ul className="mb-0 mt-2">
              <li>Have an active account</li>
              <li>Have available container slots</li>
              <li>Be able to manage the transferred container</li>
            </ul>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Target User's Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isTransferring}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            disabled={isTransferring}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isTransferring}
          >
            {isTransferring ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Transferring...
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right me-2"></i>
                Transfer Container
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
} 