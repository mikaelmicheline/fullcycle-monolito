import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

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

    const output = await facade.generate(input);

    expect(output.name).toBe(input.name);    
    expect(output.document).toBe(input.document);
    expect(output.total).toBe(100);

    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);

    expect(output.items[0].id).toBe(input.items[0].id);    
    expect(output.items[0].name).toBe(input.items[0].name);    
    expect(output.items[0].price).toBe(input.items[0].price); 
    
    expect(output.items[1].id).toBe(input.items[1].id);    
    expect(output.items[1].name).toBe(input.items[1].name);    
    expect(output.items[1].price).toBe(input.items[1].price); 
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const inputGenerate = {
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

    const id = (await facade.generate(inputGenerate)).id;

    const inputFind = {
      id
    };

    const output = await facade.find(inputFind);
   
    expect(output.id).toBe(id);    
    expect(output.name).toBe(inputGenerate.name);    
    expect(output.document).toBe(inputGenerate.document);
    expect(output.total).toBe(100);

    expect(output.address.street).toBe(inputGenerate.street);
    expect(output.address.number).toBe(inputGenerate.number);
    expect(output.address.complement).toBe(inputGenerate.complement);
    expect(output.address.city).toBe(inputGenerate.city);
    expect(output.address.state).toBe(inputGenerate.state);
    expect(output.address.zipCode).toBe(inputGenerate.zipCode);

    expect(output.items[0].id).toBe(inputGenerate.items[0].id);    
    expect(output.items[0].name).toBe(inputGenerate.items[0].name);    
    expect(output.items[0].price).toBe(inputGenerate.items[0].price); 
    
    expect(output.items[1].id).toBe(inputGenerate.items[1].id);    
    expect(output.items[1].name).toBe(inputGenerate.items[1].name);    
    expect(output.items[1].price).toBe(inputGenerate.items[1].price); 
  });
});
