import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice";
import InvoiceItem from "../domain/entity/invoice-item";
import Address from "../domain/value-object/address";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {  
  async save(input: Invoice): Promise<Invoice> {

    await InvoiceModel.create({
      id: input.id.id,      
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode, 
      items: input.items.map(item => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
          invoiceId: input.id.id
        }
      }),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    },
    {
      include: [
        {
          model: InvoiceItemModel
        }
      ]
    });

    return new Invoice({
      id: input.id,
      name: input.name,
      document: input.document,
      address: input.address,
      items: input.items,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  async find(id: string): Promise<Invoice> {   
  
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel]
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    const address = new Address({
      street: invoice.street,
      number: invoice.number,
      complement: invoice.complement,
      city: invoice.city,
      state: invoice.state,
      zipCode: invoice.zipCode
    })

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address,
      items: invoice.items.map(item => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price
        })
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
