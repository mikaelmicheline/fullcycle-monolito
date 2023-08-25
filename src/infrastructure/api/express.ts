import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientRoute } from "./routes/client.route";
import { productRoute } from "./routes/product.route";
import { checkoutRoute } from "./routes/checkout.route";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-items.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { ProductModel as AdmProductModel } from "../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import { invoiceRoute } from "./routes/invoice.route";
import { Umzug } from "umzug"
import { migrator } from "../config-migrations/migrator";

export const app: Express = express();

app.use(express.json());

app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;
let migration: Umzug<any>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });    
 
  sequelize.addModels([      
    ClientModel,
    AdmProductModel,
    StoreCatalogProductModel,
    OrderModel, 
    OrderItemModel,
    InvoiceModel, 
    InvoiceItemModel,
    TransactionModel
  ]);

  migration = migrator(sequelize)
  await migration.up()
}

setupDb();
