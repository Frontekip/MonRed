import Docker from 'dockerode';
import { generateContainerName, generateCredentials, generateRandomString } from '../utils/randomGenerator.js';

const docker = new Docker();

class DockerService {
  async pullImage(imageName, version) {
    try {
      console.log(`Pulling image ${imageName}:${version}...`);
      await new Promise((resolve, reject) => {
        docker.pull(`${imageName}:${version}`, (err, stream) => {
          if (err) return reject(err);
          
          docker.modem.followProgress(stream, (err, output) => {
            if (err) return reject(err);
            resolve(output);
          });
        });
      });
      console.log(`Successfully pulled ${imageName}:${version}`);
    } catch (err) {
      throw new Error(`Failed to pull image: ${err.message}`);
    }
  }

  async createVolume(name) {
    try {
      return await docker.createVolume({
        Name: name,
        Driver: 'local'
      });
    } catch (err) {
      throw new Error(`Failed to create volume: ${err.message}`);
    }
  }

  async createMongoContainer(name, version) {
    try {
      // Pull MongoDB image if not exists
      await this.pullImage('mongo', version);

      const containerName = generateContainerName('mongo');
      const volumeName = `mongo_data_${generateRandomString(6)}`;
      const credentials = generateCredentials();

      // Create a volume for MongoDB data
      await this.createVolume(volumeName);

      const container = await docker.createContainer({
        Image: `mongo:${version}`,
        name: containerName,
        ExposedPorts: {
          '27017/tcp': {}
        },
        HostConfig: {
          PortBindings: {
            '27017/tcp': [{ HostPort: '0' }]
          },
          Memory: 256 * 1024 * 1024,
          MemoryReservation: 128 * 1024 * 1024,
          Binds: [
            `${volumeName}:/data/db` // Mount volume to MongoDB data directory
          ]
        },
        Env: [
          `MONGO_INITDB_ROOT_USERNAME=${credentials.username}`,
          `MONGO_INITDB_ROOT_PASSWORD=${credentials.password}`,
          `MONGO_INITDB_DATABASE=${credentials.database}`,
          'wiredTigerCacheSizeGB=0.25',
          'MONGO_STORAGE_ENGINE=wiredTiger',
          'MONGO_WIREDTIGER_MAX_CACHE_SIZE=256M',
          'MONGO_WIREDTIGER_DIRECTORY_FOR_INDEXES=true'
        ]
      });

      await container.start();
      
      const containerInfo = await container.inspect();
      const port = containerInfo.NetworkSettings.Ports['27017/tcp'][0].HostPort;
      
      return {
        containerId: containerInfo.Id,
        containerName: containerName,
        volumeName: volumeName,
        port: port,
        version: version,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database,
        connectionString: `mongodb://${credentials.username}:${credentials.password}@localhost:${port}/${credentials.database}`,
        storage: '250MB (soft limit)',
        memory: '256MB'
      };
    } catch (err) {
      throw new Error(`Failed to create MongoDB container: ${err.message}`);
    }
  }

  async createRedisContainer(name, version = 'latest') {
    try {
      // Pull Redis image if not exists
      await this.pullImage('redis', version);

      const containerName = generateContainerName('redis');
      const volumeName = `redis_data_${generateRandomString(6)}`;
      const password = generateRandomString(12);

      // Create a volume for Redis data
      await this.createVolume(volumeName);

      const container = await docker.createContainer({
        Image: `redis:${version}`,
        name: containerName,
        ExposedPorts: {
          '6379/tcp': {}
        },
        HostConfig: {
          PortBindings: {
            '6379/tcp': [{ HostPort: '0' }]
          },
          Memory: 512 * 1024 * 1024,
          MemoryReservation: 256 * 1024 * 1024,
          Binds: [
            `${volumeName}:/data`
          ]
        },
        Cmd: [
          'redis-server',
          '--requirepass', password,
          '--maxmemory', '512mb',
          '--maxmemory-policy', 'allkeys-lru',
          '--appendonly', 'yes'
        ]
      });

      await container.start();
      
      const containerInfo = await container.inspect();
      const port = containerInfo.NetworkSettings.Ports['6379/tcp'][0].HostPort;
      
      return {
        containerId: containerInfo.Id,
        containerName: containerName,
        volumeName: volumeName,
        port: port,
        version: version,
        password: password,
        connectionString: `redis://default:${password}@localhost:${port}`,
        memory: '512MB'
      };
    } catch (err) {
      throw new Error(`Failed to create Redis container: ${err.message}`);
    }
  }

  async deleteContainer(containerId, volumeName) {
    try {
      // Stop and remove container
      const container = docker.getContainer(containerId);
      await container.stop();
      await container.remove({ force: true });

      // Remove associated volume
      if (volumeName) {
        const volume = docker.getVolume(volumeName);
        await volume.remove();
      }
    } catch (err) {
      throw new Error(`Failed to delete container: ${err.message}`);
    }
  }
}

export default new DockerService(); 