'use client';

import { Modal, Button, Table } from 'react-bootstrap';
import { useState } from 'react';

export default function ContainerDetailModal({ show, handleClose, container }) {
  const [showCredentials, setShowCredentials] = useState(false);

  if (!container) return null;

  const renderMongoDetails = () => (
    <Table striped bordered>
      <tbody>
        <tr>
          <td><strong>Container Name</strong></td>
          <td>{container.containerName}</td>
        </tr>
        <tr>
          <td><strong>Status</strong></td>
          <td><span className={`badge bg-${container.status === 'running' ? 'success' : 'warning'}`}>{container.status}</span></td>
        </tr>
        <tr>
          <td><strong>Version</strong></td>
          <td>{container.version}</td>
        </tr>
        <tr>
          <td><strong>Port</strong></td>
          <td>{container.port}</td>
        </tr>
        <tr>
          <td><strong>Database Name</strong></td>
          <td>{container.database}</td>
        </tr>
        <tr>
          <td><strong>Username</strong></td>
          <td>{showCredentials ? container.username : '••••••••'}</td>
        </tr>
        <tr>
          <td><strong>Password</strong></td>
          <td>{showCredentials ? container.password : '••••••••'}</td>
        </tr>
        <tr>
          <td><strong>Connection String</strong></td>
          <td>
            <code className="small">
              {showCredentials ? container.connectionString : container.connectionString.replace(/\/\/.*@/, '//<hidden>@')}
            </code>
          </td>
        </tr>
      </tbody>
    </Table>
  );

  const renderRedisDetails = () => (
    <Table striped bordered>
      <tbody>
        <tr>
          <td><strong>Container Name</strong></td>
          <td>{container.containerName}</td>
        </tr>
        <tr>
          <td><strong>Status</strong></td>
          <td><span className={`badge bg-${container.status === 'running' ? 'success' : 'warning'}`}>{container.status}</span></td>
        </tr>
        <tr>
          <td><strong>Port</strong></td>
          <td>{container.port}</td>
        </tr>
        <tr>
          <td><strong>Password</strong></td>
          <td>{showCredentials ? container.password : '••••••••'}</td>
        </tr>
        <tr>
          <td><strong>Connection String</strong></td>
          <td>
            <code className="small">
              {showCredentials ? container.connectionString : container.connectionString.replace(/\/\/.*@/, '//<hidden>@')}
            </code>
          </td>
        </tr>
      </tbody>
    </Table>
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Container Details: {container.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Button 
            variant={showCredentials ? "warning" : "primary"} 
            onClick={() => setShowCredentials(!showCredentials)}
            size="sm"
          >
            {showCredentials ? "Hide Credentials" : "Show Credentials"}
          </Button>
        </div>
        {container.type === 'mongodb' ? renderMongoDetails() : renderRedisDetails()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 