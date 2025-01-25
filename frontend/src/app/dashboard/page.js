'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import CreateContainerModal from '../components/CreateContainerModal';
import ContainerDetailModal from '../components/ContainerDetailModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import TransferContainerModal from '../components/TransferContainerModal';
import ContainerLogsModal from '../components/ContainerLogsModal';
import React from 'react';

// Custom Dropdown Toggle komponenti
const ActionToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    ref={ref}
    variant="outline-secondary"
    size="sm"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <i className="fas fa-ellipsis-v"></i>
  </Button>
));

ActionToggle.displayName = 'ActionToggle';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState({
    totalStorage: '0MB',
    usedMemory: '0MB',
    maxMemory: '0MB',
    resourceUsagePercentage: 0,
    usedStorage: '0MB',
    storageUsagePercentage: 0,
    remainingLimits: {
      mongodb: 1,
      redis: 1
    }
  });
  const [isActionLoading, setIsActionLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [containerToTransfer, setContainerToTransfer] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user data from token
    const userData = JSON.parse(atob(token.split('.')[1]));
    setUser(userData);
    
    // Fetch user's containers
    fetchContainers();
    if (token) {
      fetchStats();
    }
  }, [router]);

  const fetchContainers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/containers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setContainers(data);
    } catch (err) {
      console.error('Error fetching containers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/containers/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateContainer = async (containerData) => {
    setIsCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/containers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(containerData)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create container');
      }

      setShowModal(false);
      await fetchContainers();
      await fetchStats();
    } catch (err) {
      console.error('Error creating container:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContainer = async (containerId) => {
    setIsDeleting(containerId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/containers/${containerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete container');
      }

      await fetchContainers();
      await fetchStats();
    } catch (err) {
      console.error('Error deleting container:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleShowDetails = (container) => {
    setSelectedContainer(container);
    setShowDetailModal(true);
  };

  const handleContainerAction = async (containerId, action) => {
    setIsActionLoading({ id: containerId, action });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/containers/${containerId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (!res.ok) {
        throw new Error(`Failed to ${action} container`);
      }

      await fetchContainers();
    } catch (err) {
      console.error(`Error ${action}ing container:`, err);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteClick = (container) => {
    setContainerToDelete(container);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (containerToDelete) {
      await handleDeleteContainer(containerToDelete._id);
      setShowDeleteModal(false);
      setContainerToDelete(null);
    }
  };

  const handleTransferClick = (container) => {
    setContainerToTransfer(container);
    setShowTransferModal(true);
  };

  const handleTransfer = async (targetEmail) => {
    if (!containerToTransfer) return;

    setIsTransferring(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/containers/${containerToTransfer._id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetEmail })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to transfer container');
      }

      await fetchContainers();
      setShowTransferModal(false);
      setContainerToTransfer(null);
    } catch (err) {
      throw err;
    } finally {
      setIsTransferring(false);
    }
  };

  const handleShowLogs = (container) => {
    setSelectedContainer(container);
    setShowLogsModal(true);
  };

  if (!user) return null;

  return (
    <div>
      <Header />
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Welcome to Your Dashboard</h1>
            <p className="text-muted">Manage your cloud containers</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Create Container
          </Button>
        </div>

        <Row className="mb-5">
          <Col md={6} className="mx-auto">
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-muted mb-1">Total Containers</h6>
                    <h3 className="mb-0">{containers.length}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <i className="fas fa-cube text-primary fs-4"></i>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <small>
                      <i className="fas fa-database me-1 text-muted"></i>
                      MongoDB
                    </small>
                    <small>{containers.filter(c => c.type === 'mongodb').length} containers</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small>
                      <i className="fas fa-server me-1 text-muted"></i>
                      Redis
                    </small>
                    <small>{containers.filter(c => c.type === 'redis').length} containers</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <h2 className="mb-4">Your Containers</h2>
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading containers...</p>
              </div>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Port</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {containers.map((container) => (
                    <tr key={container._id}>
                      <td>{container.name}</td>
                      <td>{container.type}</td>
                      <td>{container.version || '-'}</td>
                      <td>
                        <span className={`badge bg-${container.status === 'running' ? 'success' : 'warning'}`}>
                          {container.status}
                        </span>
                      </td>
                      <td>{container.port}</td>
                      <td>{new Date(container.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleShowDetails(container)}
                            disabled={isDeleting === container._id || isActionLoading?.id === container._id}
                          >
                            <i className="fas fa-info-circle me-1"></i>
                            Details
                          </Button>

                          {container.status === 'running' ? (
                            <>
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => handleContainerAction(container._id, 'stop')}
                                disabled={isDeleting === container._id || isActionLoading?.id === container._id}
                              >
                                {isActionLoading?.id === container._id && isActionLoading?.action === 'stop' ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                      className="me-1"
                                    />
                                    Stopping...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-stop me-1"></i>
                                    Stop
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => handleContainerAction(container._id, 'restart')}
                                disabled={isDeleting === container._id || isActionLoading?.id === container._id}
                              >
                                {isActionLoading?.id === container._id && isActionLoading?.action === 'restart' ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                      className="me-1"
                                    />
                                    Restarting...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-sync-alt me-1"></i>
                                    Restart
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleContainerAction(container._id, 'start')}
                              disabled={isDeleting === container._id || isActionLoading?.id === container._id}
                            >
                              {isActionLoading?.id === container._id && isActionLoading?.action === 'start' ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-1"
                                  />
                                  Starting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-play me-1"></i>
                                  Start
                                </>
                              )}
                            </Button>
                          )}

                          <Dropdown>
                            <Dropdown.Toggle 
                              as={ActionToggle}
                              id={`dropdown-${container._id}`}
                              disabled={isDeleting === container._id || isActionLoading?.id === container._id}
                            />

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleShowLogs(container)}>
                                <i className="fas fa-terminal me-2"></i>
                                View Logs
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleTransferClick(container)}>
                                <i className="fas fa-exchange-alt me-2"></i>
                                Transfer Container
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger"
                                onClick={() => handleDeleteClick(container)}
                              >
                                <i className="fas fa-trash-alt me-2"></i>
                                Delete Container
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <CreateContainerModal
          show={showModal}
          handleClose={() => !isCreating && setShowModal(false)}
          handleCreate={handleCreateContainer}
          isCreating={isCreating}
          remainingLimits={stats.remainingLimits}
        />

        <ContainerDetailModal
          show={showDetailModal}
          handleClose={() => setShowDetailModal(false)}
          container={selectedContainer}
        />

        <DeleteConfirmationModal
          show={showDeleteModal}
          handleClose={() => {
            if (!isDeleting) {
              setShowDeleteModal(false);
              setContainerToDelete(null);
            }
          }}
          handleConfirm={handleDeleteConfirm}
          containerName={containerToDelete?.name}
          isDeleting={isDeleting === containerToDelete?._id}
        />

        <TransferContainerModal
          show={showTransferModal}
          handleClose={() => {
            if (!isTransferring) {
              setShowTransferModal(false);
              setContainerToTransfer(null);
            }
          }}
          handleTransfer={handleTransfer}
          containerName={containerToTransfer?.name}
          isTransferring={isTransferring}
        />

        <ContainerLogsModal
          show={showLogsModal}
          handleClose={() => setShowLogsModal(false)}
          container={selectedContainer}
        />
      </Container>
    </div>
  );
} 