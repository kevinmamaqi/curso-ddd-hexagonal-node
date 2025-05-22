export interface AppConfig {
  port: number;
  databaseUrl: string;
  rabbitUrl: string;
}

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL!,
  rabbitUrl: process.env.RABBITMQ_URL!,
};
