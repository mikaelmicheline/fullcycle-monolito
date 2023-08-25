import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../../modules/checkout/repository/order-items.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { ProductModel as AdmProductModel } from "../../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";
import { Umzug } from "umzug"
import { migrator } from "../../config-migrations/migrator";

let sequelize: Sequelize;
let migration: Umzug<any>;

describe("E2E test for checkout", () => {
  beforeEach(async () => {
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
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should place an order", async () => {    

    const clientRepository = new ClientRepository()
    const addClientUseCase = new AddClientUseCase(clientRepository)
    await addClientUseCase.execute({
      id: "111",
      name: "name 1",
      email: "email@email.com",
      document: "123",
      address: {
        street: "address 1",
        number: "number1",
        complement: "complement1",
        city: "city1",
        state: "state1",
        zipCode: "0000000",
      },
    });

    const productRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productRepository);
    await addProductUseCase.execute({
      id: "ABC",
      name: "product1",
      description: "description1",
      purchasePrice: 20,
      salesPrice: 40,
      stock: 40,
    });
    await addProductUseCase.execute({
      id: "DEF",
      name: "product2",
      description: "description2",
      purchasePrice: 40,
      salesPrice: 80,
      stock: 100,
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "111",
        products: [
          {
            productId: 'ABC'
          },
          {
            productId: 'DEF'
          }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();   
    expect(response.body.clientId).toBe("111");   
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(120);
    expect(response.body.products.length).toBe(2);
  });
});
