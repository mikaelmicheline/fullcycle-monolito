import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import Address from "../../domain/value-object/address";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode
    })

    const invoice = new Invoice({
      name: input.name,
      document: input.document,      
      address,
      items: input.items.map(item => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price
        })
      })
    });

    const persistInvoice = await this.invoiceRepository.save(
      invoice
    );

    return {
      id: persistInvoice.id.id,
      name: persistInvoice.name,
      document: persistInvoice.document,
      total: persistInvoice.total,
      street: persistInvoice.address.street,
      number: persistInvoice.address.number,
      complement: persistInvoice.address.complement,
      city: persistInvoice.address.city,
      state: persistInvoice.address.state,
      zipCode: persistInvoice.address.zipCode,
      items: persistInvoice.items.map(item => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price
        }
      })
    };
  }
}

