# MonRed - MongoDB & Redis Cloud Platform

MonRed is a self-hosted platform that allows you to deploy and manage MongoDB and Redis instances with ease. It provides a simple web interface to create, monitor, and manage your database containers.

![MonRed Dashboard](screenshots/dashboard.png)

## Features

- 🚀 **Quick Deployment**: Deploy MongoDB and Redis instances in seconds
- 🔒 **Secure by Default**: Automatic security configuration for all databases
- 📊 **Real-time Monitoring**: Monitor resource usage and performance metrics
- 📝 **Live Logs**: View real-time container logs
- 🔄 **Container Management**: Start, stop, restart, and delete containers
- 👥 **User Management**: Transfer containers between users
- 🔐 **Authentication**: JWT-based authentication system

## Prerequisites

- Node.js (v18 or higher)
- Docker
- MongoDB (for MonRed's own database)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/monred.git
cd monred
```

2. Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:

Create a `.env` file in the backend directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/monred
JWT_SECRET=your_jwt_secret_here
```

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Set up a production MongoDB instance

3. Configure environment variables for production

4. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start backend/src/index.js --name monred-backend
```

5. Set up a reverse proxy (nginx recommended) to serve the frontend build and proxy API requests

## API Documentation

The API provides the following main endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/containers` - List user's containers
- `POST /api/containers` - Create new container
- `DELETE /api/containers/:id` - Delete container
- `POST /api/containers/:id/action` - Container actions (start/stop/restart)
- `GET /api/containers/:id/logs` - Get container logs
- `POST /api/containers/:id/transfer` - Transfer container to another user

## Security Considerations

- All database containers are created with random strong passwords
- Each container runs in its own isolated network
- JWT tokens are used for API authentication
- Container resources are limited to prevent abuse
- All sensitive data is encrypted

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Support

If you encounter any problems or have suggestions, please open an issue in the GitHub repository.

## Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## Acknowledgments

- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/) 