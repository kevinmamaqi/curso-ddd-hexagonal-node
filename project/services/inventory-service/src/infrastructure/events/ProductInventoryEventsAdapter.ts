import { ProductInventoryEventsPort } from "../../domain/ports/ProductInventoryEventsPort";
import { Quantity } from "../../domain/value-objects/Quantity";
import { SKU } from "../../domain/value-objects/SKU";

export class ProductInventoryEventsAdapter
  implements ProductInventoryEventsPort
{
  async emitProductInventoryReserved(sku: SKU, qty: Quantity): Promise<void> {
    console.log(
      `Product inventory reserved: ${sku.toString()} - ${qty.toNumber()}`
    );
  }
}
