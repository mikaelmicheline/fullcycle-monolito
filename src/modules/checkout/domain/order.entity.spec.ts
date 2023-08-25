import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "./order.entity";
import OrderItem from "./order-item.entity";

const clientId = "123";

const product1 = new OrderItem({
  id: new Id("123"),
  name: "product1",
  description: "description1",
  salesPrice: 200,
  productId: "111",
});

const product2 = new OrderItem({
  id: new Id("456"),
  name: "product2",
  description: "description2",
  salesPrice: 100,
  productId: "222",
});

const products = [product1, product2];

describe("Order entity unit tests", () => {

  it("should create an order", () => {
    const order = new Order({
      clientId: clientId,
      items: products,
    });

    expect(order.id).toBeDefined();
    expect(order.status).toBe("pending");
    expect(order.items).toBe(products);
    expect(order.items.length).toBe(2);
    expect(order.clientId).toBe(clientId);
    expect(order.total).toBe(300);
    expect(order.items[0].productId).toBe("111");
    expect(order.items[1].productId).toBe("222");
    expect(order.createdAt).not.toBeNull();
  });

  it("should approve an order", () => {
    const order = new Order({
      clientId: clientId,
      items: products,
    });
    order.approve();
    expect(order.status).toBe("approved");
  });

});