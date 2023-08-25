import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { migrator } from "../../config-migrations/migrator";
import { Umzug } from "umzug";

let sequelize: Sequelize;
let migration: Umzug<any>;

describe("E2E test for client", () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });    
   
    sequelize.addModels([      
      ClientModel
    ]);
  
    migration = migrator(sequelize)
    await migration.up()
  });  

  it("should create a client", async () => {
    const response = await request(app)
      .post("/client")
      .send({
        id: "111",
        name: "client 1",
        email: "client@email.com",
        document: "123",
        address: {
          street: "street1",
          number: "number1",
          complement: "complement1",
          city: "city1",
          state: "state1",
          zipCode: "00000000"
        }
      });  

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("111");    
    expect(response.body.name).toBe("client 1");    
    expect(response.body.email).toBe("client@email.com");    
    expect(response.body.document).toBe("123");    
    expect(response.body.address.street).toBe("street1");
    expect(response.body.address.number).toBe("number1");
    expect(response.body.address.complement).toBe("complement1");
    expect(response.body.address.city).toBe("city1");
    expect(response.body.address.state).toBe("state1");
    expect(response.body.address.zipCode).toBe("00000000");   
  });
});
