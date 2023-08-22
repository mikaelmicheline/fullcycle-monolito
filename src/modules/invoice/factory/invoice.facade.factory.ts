import InvoiceFacadeInterface from "../facade/facade.interface";
import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepostiory from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacadeInterface {
    const repository = new InvoiceRepostiory();
    const generateInvoiceUsecase = new GenerateInvoiceUseCase(repository);
    const findInvoiceUsecase = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade(generateInvoiceUsecase, findInvoiceUsecase);
    return facade;
  }
}
