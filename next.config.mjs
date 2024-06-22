/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      DB_PASSWD: '1234',
      DB_HOST: 'localhost',
      DB_USER: 'root',
      DB_PORT: '3306',
      DB_NAME: 'prolab2',
      NEXTAUTH_URL:'http://localhost:3000',
      NEXTAUTH_SECRET:'zSEZnTVrLA/lJCCkSst9LVuXoQTZzG2EnX3+M4+0FGs=', //openssl rand -base64 32
    }
};

export default nextConfig;
