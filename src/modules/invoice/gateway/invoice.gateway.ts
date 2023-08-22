import Invoice from "../domain/entity/invoice";

export default interface InvoiceGateway {
  save(input: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
