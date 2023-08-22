import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice";
import InvoiceModel from "./invoice.model";
import InvoiceRepostiory from "./invoice.repository";
import InvoiceItemModel from "./invoice-item.model";
import Address from "../domain/value-object/address";
import InvoiceItem from "../domain/entity/invoice-item";

describe("InvoiceRepository test", () => {
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

  it("should save a invoice", async () => {
    const address = new Address({
      street: "street",
      number: "500",
      complement: "none",
      city: "Alfenas",
      state: "MG",
      zipCode: "55555555"
    })

    const invoiceItem1 = new InvoiceItem({
      name: "invoiceItem1",
      price: 850
    })

    const invoiceItem2 = new InvoiceItem({
      name: "invoiceItem2",
      price: 420
    })

    const invoice = new Invoice({
      id: new Id("1"),
      name: "name",
      document: "document",
      address,
      items: [invoiceItem1, invoiceItem2]
    });

    const repository = new InvoiceRepostiory();
    const result = await repository.save(invoice);

    expect(result.id.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);

    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);    

    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id.id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
  });

  it("should find a invoice", async () => {
    const address = new Address({
      street: "street",
      number: "500",
      complement: "none",
      city: "Alfenas",
      state: "MG",
      zipCode: "55555555"
    })

    const invoiceItem1 = new InvoiceItem({
      name: "invoiceItem1",
      price: 850
    })

    const invoiceItem2 = new InvoiceItem({
      name: "invoiceItem2",
      price: 420
    })

    const invoice = new Invoice({
      name: "name",
      document: "document",
      address,
      items: [invoiceItem1, invoiceItem2]
    });

    const repository = new InvoiceRepostiory();
    await repository.save(invoice);

    const foundInvoice = await repository.find(invoice.id.id)

    expect(foundInvoice.id.id).toBe(invoice.id.id);
    expect(foundInvoice.name).toBe(invoice.name);
    expect(foundInvoice.document).toBe(invoice.document);

    expect(foundInvoice.address.city).toBe(invoice.address.city);
    expect(foundInvoice.address.complement).toBe(invoice.address.complement);
    expect(foundInvoice.address.number).toBe(invoice.address.number);
    expect(foundInvoice.address.state).toBe(invoice.address.state);
    expect(foundInvoice.address.street).toBe(invoice.address.street);
    expect(foundInvoice.address.zipCode).toBe(invoice.address.zipCode);    

    expect(foundInvoice.items.length).toBe(2);
    expect(foundInvoice.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(foundInvoice.items[0].name).toBe(invoice.items[0].name);
    expect(foundInvoice.items[0].price).toBe(invoice.items[0].price);
    expect(foundInvoice.items[1].id.id).toBe(invoice.items[1].id.id);
    expect(foundInvoice.items[1].name).toBe(invoice.items[1].name);
    expect(foundInvoice.items[1].price).toBe(invoice.items[1].price);
  });
});

    