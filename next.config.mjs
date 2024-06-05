/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      DB_PASSWD: '1234',
      DB_HOSTNAME: 'localhost',
      DB_USER: 'root',
      DB_PORT: '3306',
      DB_NAME: 'prolab2'
    }
};

export default nextConfig;
