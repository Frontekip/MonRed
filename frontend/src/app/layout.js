import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapClient from './components/BootstrapClient';

export const metadata = {
  title: 'MonRed - MongoDB & Redis Cloud Platform',
  description: 'Deploy and manage MongoDB and Redis instances with ease.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
      </head>
      <body>
        <BootstrapClient />
        <main className="min-vh-100 d-flex flex-column">
          {children}
        </main>
      </body>
    </html>
  );
}
