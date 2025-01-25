'use client';

import { Modal, Button } from 'react-bootstrap';

export default function DeleteConfirmationModal({ show, handleClose, handleConfirm, containerName, isDeleting }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton={!isDeleting}>
        <Modal.Title className="text-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Delete Container
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete <strong>{containerName}</strong>?</p>
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-circle me-2"></i>
          <strong>Warning:</strong> This action cannot be undone.
        </div>
        <ul className="text-muted">
          <li>All data stored in this container will be permanently deleted</li>
          <li>The container and its volume will be removed</li>
          <li>Connection strings will no longer be valid</li>
          <li>You'll need to create a new container if you want to restore the service</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={handleClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Deleting...
            </>
          ) : (
            <>
              <i className="fas fa-trash-alt me-2"></i>
              Delete Container
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 