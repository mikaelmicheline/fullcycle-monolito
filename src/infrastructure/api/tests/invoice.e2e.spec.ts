import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import InvoiceItem from "../../../modules/invoice/domain/entity/invoice-item";
import Invoice from "../../../modules/invoice/domain/entity/invoice";
import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";
import GenerateInvoiceUseCase from "../../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";
import Address from "../../../modules/invoice/domain/value-object/address";
import { Umzug } from "umzug";
import { migrator } from "../../config-migrations/migrator";

let sequelize: Sequelize;
let migration: Umzug<any>;

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });    
   
    sequelize.addModels([ 
      InvoiceModel, 
      InvoiceItemModel
    ]);
  
    migration = migrator(sequelize)
    await migration.up()
  });  

  it("should get an invoice", async () => {
    const invoiceItem1 = new InvoiceItem({
      id: new Id("111"),
      name: "item1",
      price: 40,
    })
    
    const invoiceItem2 = new InvoiceItem({
      id: new Id("222"),
      name: "item2",
      price: 60,
    })
    
    const address = new Address({
      street: "street",
      number: "10",
      complement: "complement",  
      city: "city",
      state: "state",
      zipCode: "00000000"
    })
    
    const invoice = new Invoice({
      name: "name",
      document: "doc",
      address,
      items: [invoiceItem1, invoiceItem2]
    });

    const invoiceRepository = new InvoiceRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input = {
      name: "name",
      document: "doc",
      street: "street",
      number: "10",
      complement: "complement",  
      city: "city",
      state: "state",
      zipCode: "00000000",
      items: [
        {
          id: "111",
          name: "item1",
          price: 40
        },
        {
          id: "222",
          name: "item2",
          price: 60
        }
      ]
    };

    const result = await usecase.execute(input);
    const id = result.id;

    const response = await request(app)
      .get(`/invoice/${id}`);  

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);    
    expect(response.body.name).toBe(input.name);    
    expect(response.body.document).toBe(input.document);        
    expect(response.body.total).toBe(100);        
    expect(response.body.address.street).toBe(input.street);
    expect(response.body.address.number).toBe(input.number);
    expect(response.body.address.complement).toBe(input.complement);
    expect(response.body.address.city).toBe(input.city);
    expect(response.body.address.state).toBe(input.state);
    expect(response.body.address.zipCode).toBe(input.zipCode);   
    expect(response.body.items.length).toBe(2);   
  });
});
