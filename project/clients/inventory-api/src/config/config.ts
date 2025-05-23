export const config = {
  port: Number(process.env.PORT) || 4000,
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL!,
  orderServiceUrl: process.env.ORDER_SERVICE_URL!,
};

type AppConfig = typeof config;

export type { AppConfig };
