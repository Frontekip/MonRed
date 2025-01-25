'use client';

import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';

const MONGODB_VERSIONS = [
  '7.0',
  '6.0',
  '5.0',
  '4.4',
  '4.2'
];

const REDIS_VERSIONS = [
  '7.2',
  '7.0',
  '6.2',
  '6.0',
  '5.0'
];

export default function CreateContainerModal({ show, handleClose, handleCreate, isCreating, remainingLimits }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'mongodb',
    version: '7.0' // default version
  });

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData({
      ...formData,
      type,
      version: type === 'mongodb' ? '7.0' : '7.2' // Set default version based on type
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(formData);
    setFormData({ name: '', type: 'mongodb', version: '7.0' }); // reset form
  };

  const getTypeHelpText = (type) => {
    const remaining = remainingLimits?.[type] || 0;
    if (remaining <= 0) {
      return <span className="text-danger">You've reached the free tier limit for {type} containers</span>;
    }
    return <span className="text-muted">{remaining} free {type} container remaining</span>;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton={!isCreating}>
        <Modal.Title>Create New Container</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Free tier includes 1 MongoDB and 1 Redis container
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label>Container Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter container name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isCreating}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Container Type</Form.Label>
            <Form.Select
              value={formData.type}
              onChange={handleTypeChange}
              disabled={isCreating}
            >
              <option value="mongodb">MongoDB</option>
              <option value="redis">Redis</option>
            </Form.Select>
            <Form.Text>{getTypeHelpText(formData.type)}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {formData.type === 'mongodb' ? 'MongoDB' : 'Redis'} Version
            </Form.Label>
            <Form.Select
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              disabled={isCreating}
            >
              {(formData.type === 'mongodb' ? MONGODB_VERSIONS : REDIS_VERSIONS).map(version => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isCreating || remainingLimits?.[formData.type] <= 0}
          >
            {isCreating ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creating...
              </>
            ) : (
              'Create Container'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
} 