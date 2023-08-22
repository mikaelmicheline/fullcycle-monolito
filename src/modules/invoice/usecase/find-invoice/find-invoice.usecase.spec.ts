import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import Address from "../../domain/value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

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
    save: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe(invoice.id.id);    
    expect(result.name).toBe(invoice.name);    
    expect(result.document).toBe(invoice.document);
    expect(result.total).toBe(100);
    expect(result.createdAt).toBe(invoice.createdAt);

    expect(result.address.street).toBe(address.street);
    expect(result.address.number).toBe(address.number);
    expect(result.address.complement).toBe(address.complement);
    expect(result.address.city).toBe(address.city);
    expect(result.address.state).toBe(address.state);
    expect(result.address.zipCode).toBe(address.zipCode);

    expect(result.items[0].id).toBe(invoice.items[0].id.id);    
    expect(result.items[0].name).toBe(invoice.items[0].name);    
    expect(result.items[0].price).toBe(invoice.items[0].price); 
    
    expect(result.items[1].id).toBe(invoice.items[1].id.id);    
    expect(result.items[1].name).toBe(invoice.items[1].name);    
    expect(result.items[1].price).toBe(invoice.items[1].price); 
  });
});
