import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import Address from "../../domain/value-object/address";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

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

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn()
  };
};

describe("Generate invoice usecase unit test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
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

    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(result.name).toBe(invoice.name);    
    expect(result.document).toBe(invoice.document);
    expect(result.total).toBe(100);

    expect(result.street).toBe(address.street);
    expect(result.number).toBe(address.number);
    expect(result.complement).toBe(address.complement);
    expect(result.city).toBe(address.city);
    expect(result.state).toBe(address.state);
    expect(result.zipCode).toBe(address.zipCode);

    expect(result.items[0].id).toBe(invoice.items[0].id.id);    
    expect(result.items[0].name).toBe(invoice.items[0].name);    
    expect(result.items[0].price).toBe(invoice.items[0].price); 
    
    expect(result.items[1].id).toBe(invoice.items[1].id.id);    
    expect(result.items[1].name).toBe(invoice.items[1].name);    
    expect(result.items[1].price).toBe(invoice.items[1].price); 
  });
});
