import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.API_PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV,
}));
