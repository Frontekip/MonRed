'use client';

import { Modal, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';

export default function ContainerLogsModal({ show, handleClose, container }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (show && container) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000); // Her 5 saniyede bir güncelle
      return () => clearInterval(interval);
    }
  }, [show, container]);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const fetchLogs = async () => {
    if (!container) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/containers/${container._id}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError('Failed to load container logs');
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-terminal me-2"></i>
          Container Logs: {container?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div 
          className="logs-container" 
          style={{ 
            backgroundColor: '#1e1e1e',
            color: '#fff',
            fontFamily: 'monospace',
            padding: '1rem',
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          {isLoading && !logs.length && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="light" />
              <p className="mt-2 text-light">Loading logs...</p>
            </div>
          )}

          {error && (
            <div className="text-danger p-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {logs.map((log, index) => (
            <div key={index} className="log-line mb-1">
              <span className="text-muted">{log.timestamp}</span>
              <span className="ms-3">{log.message}</span>
            </div>
          ))}

          <div ref={logsEndRef} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={fetchLogs}
          disabled={isLoading}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Refresh Logs
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 