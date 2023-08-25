import { app } from "../express";
import request from "supertest";
import { ProductModel as AdmProductModel } from "../../../modules/product-adm/repository/product.model";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../config-migrations/migrator";

let sequelize: Sequelize;
let migration: Umzug<any>;

describe("E2E test for product", () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });    
   
    sequelize.addModels([      
      AdmProductModel
    ]);
  
    migration = migrator(sequelize)
    await migration.up()
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        id: "111",
        name: "product 1",
        description: "description 1",
        purchasePrice: 100,
        stock: 10
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("111");    
    expect(response.body.name).toBe("product 1");    
    expect(response.body.description).toBe("description 1");    
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);    
  });
});
