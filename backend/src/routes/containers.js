import express from 'express';
import { Container } from '../models/Container.js';
import { auth } from '../middleware/auth.js';
import DockerService from '../services/DockerService.js';
import Docker from 'dockerode';
import { User } from '../models/User.js';

const router = express.Router();
const docker = new Docker();

// Get user's containers
router.get('/', auth, async (req, res) => {
  try {
    const containers = await Container.find({ userId: req.user.userId });
    res.json(containers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new container
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, version } = req.body;
    
    // Create container in Docker
    let dockerContainer;
    if (type === 'mongodb') {
      dockerContainer = await DockerService.createMongoContainer(name, version);
    } else if (type === 'redis') {
      dockerContainer = await DockerService.createRedisContainer(name, version);
    }

    // Save container info to database
    const container = new Container({
      name,
      containerName: dockerContainer.containerName,
      type,
      version: dockerContainer.version,
      userId: req.user.userId,
      status: 'running',
      containerId: dockerContainer.containerId,
      port: dockerContainer.port,
      username: dockerContainer.username,
      password: dockerContainer.password,
      database: dockerContainer.database,
      connectionString: dockerContainer.connectionString,
      storage: dockerContainer.storage,
      memory: dockerContainer.memory,
      volumeName: dockerContainer.volumeName
    });

    await container.save();
    res.status(201).json(container);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete container
router.delete('/:id', auth, async (req, res) => {
  try {
    const container = await Container.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    // Try to delete from Docker if containerId exists
    if (container.containerId) {
      try {
        await DockerService.deleteContainer(container.containerId, container.volumeName);
      } catch (dockerErr) {
        console.error('Docker container delete error:', dockerErr);
        // Continue with database deletion even if Docker deletion fails
      }
    }

    // Delete from database using deleteOne
    await Container.deleteOne({ _id: req.params.id });

    res.json({ message: 'Container deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get container stats
router.get('/stats', auth, async (req, res) => {
  try {
    const containers = await Container.find({ userId: req.user.userId });
    
    // Remaining limits for each type
    const remainingLimits = {
      mongodb: 1 - containers.filter(c => c.type === 'mongodb').length,
      redis: 1 - containers.filter(c => c.type === 'redis').length
    };

    let totalStorage = 0;
    let usedStorage = 0;
    let totalMemory = 0;
    let maxMemory = 0;

    for (const container of containers) {
      // Memory calculation
      const memoryValue = parseInt(container.memory);
      if (!isNaN(memoryValue)) {
        totalMemory += memoryValue;
        maxMemory += container.type === 'mongodb' ? 256 : 512;
      }

      // Storage calculation
      if (container.type === 'mongodb') {
        totalStorage += 250; // Each MongoDB has 250MB total storage
        
        try {
          // Check container disk usage
          const dockerContainer = docker.getContainer(container.containerId);
          const stats = await dockerContainer.stats({ stream: false });
          
          // Calculate disk usage in MB
          const usedBytes = stats.storage_stats?.usage || 0;
          usedStorage += Math.round(usedBytes / (1024 * 1024));
        } catch (err) {
          console.error(`Error getting stats for container ${container.containerId}:`, err);
        }
      }
    }

    res.json({
      totalStorage: `${totalStorage}MB`,
      usedStorage: `${usedStorage}MB`,
      storageUsagePercentage: totalStorage > 0 ? Math.round((usedStorage / totalStorage) * 100) : 0,
      usedMemory: `${totalMemory}MB`,
      maxMemory: `${maxMemory}MB`,
      resourceUsagePercentage: maxMemory > 0 ? Math.round((totalMemory / maxMemory) * 100) : 0,
      remainingLimits
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Container actions (start, stop, restart)
router.post('/:id/action', auth, async (req, res) => {
  try {
    const { action } = req.body; // action: 'start', 'stop', 'restart'
    const container = await Container.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    const dockerContainer = docker.getContainer(container.containerId);

    switch (action) {
      case 'start':
        await dockerContainer.start();
        container.status = 'running';
        break;
      case 'stop':
        await dockerContainer.stop();
        container.status = 'stopped';
        break;
      case 'restart':
        await dockerContainer.restart();
        container.status = 'running';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await container.save();
    res.json({ message: `Container ${action}ed successfully`, status: container.status });
  } catch (err) {
    res.status(500).json({ message: `Failed to ${req.body.action} container: ${err.message}` });
  }
});

// Transfer container to another user
router.post('/:id/transfer', auth, async (req, res) => {
  try {
    const { targetEmail } = req.body;

    // Find target user
    const targetUser = await User.findOne({ email: targetEmail });
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Find container and check ownership
    const container = await Container.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    // Transfer container
    container.userId = targetUser._id;
    await container.save();

    res.json({ 
      message: `Container successfully transferred to ${targetEmail}`,
      newOwnerId: targetUser._id
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to transfer container: ${err.message}` });
  }
});

// Get container logs
router.get('/:id/logs', auth, async (req, res) => {
  try {
    const container = await Container.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    const dockerContainer = docker.getContainer(container.containerId);
    const logs = await dockerContainer.logs({
      stdout: true,
      stderr: true,
      tail: 100,  // Son 100 log satırı
      timestamps: true
    });

    // Buffer'ı string'e çevir ve satırlara ayır
    const logsString = logs.toString('utf8');
    const logLines = logsString.split('\n')
      .filter(line => line.trim()) // Boş satırları filtrele
      .map(line => {
        // Timestamp'i ayır ve formatla
        const timestamp = line.slice(0, 30);
        const message = line.slice(30);
        return {
          timestamp: new Date(timestamp).toLocaleString(),
          message: message.trim()
        };
      });

    res.json(logLines);
  } catch (err) {
    res.status(500).json({ message: `Failed to get container logs: ${err.message}` });
  }
});

export default router; 