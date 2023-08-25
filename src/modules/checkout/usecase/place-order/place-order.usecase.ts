import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import { PaymentFacadeOutputDto } from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Order from "../../domain/order.entity";
import OrderItem from "../../domain/order-item.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import InvoiceFacadeInterface from "../../../invoice/facade/facade.interface";

export default class PlaceOrderUseCase implements UseCaseInterface {

  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _checkoutRepository: CheckoutGateway;

  constructor(
    clientFacade: ClientAdmFacadeInterface, 
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface, 
    paymentFacade: PaymentFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface, 
    checkoutRepository: CheckoutGateway) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._paymentFacade = paymentFacade;
    this._invoiceFacade = invoiceFacade;
    this._checkoutRepository = checkoutRepository;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {   
    const findClientFacadeOutputDto = await this._clientFacade.find({ id: input.clientId });
    if (!findClientFacadeOutputDto) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products: OrderItem[] = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );
    
    const clientId = findClientFacadeOutputDto.id;

    const order: Order = new Order({
      clientId: clientId,
      items: products,
    });

    const payment: PaymentFacadeOutputDto = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });
    
    let invoice = null;
    if (payment.status === "approved") {
      invoice = await this._invoiceFacade.generate({
        name: findClientFacadeOutputDto.name,
        document: findClientFacadeOutputDto.document,
        street: findClientFacadeOutputDto.address.street,
        number: findClientFacadeOutputDto.address.number,
        complement: findClientFacadeOutputDto.address.complement,
        city: findClientFacadeOutputDto.address.city,
        state: findClientFacadeOutputDto.address.state,
        zipCode: findClientFacadeOutputDto.address.zipCode,
        items: products.map((p) => {
          return {
            id: p.id.id,
            name: p.name,
            price: p.salesPrice,
          };
        }),
      });

      order.invoiceId = invoice.id;
    }

    payment.status === "approved" && order.approve();

    await this._checkoutRepository.addOrder(order);

    return {
      id: order.id.id,
      clientId,
      invoiceId: payment.status === "approved" ? order.invoiceId : null,
      status: order.status,
      total: order.total,
      products: order.items.map((p) => {
        return {
          productId: p.productId,
        };
      }),
    };  
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });

      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<OrderItem> {
    const productFound = await this._catalogFacade.find({ id: productId });

    if (!productFound) {
      throw new Error("Product not found");
    }

    return new OrderItem({
      id: new Id(),
      name: productFound.name,
      description: productFound.description,
      salesPrice: productFound.salesPrice,
      productId: productFound.id,
    });
  }
}