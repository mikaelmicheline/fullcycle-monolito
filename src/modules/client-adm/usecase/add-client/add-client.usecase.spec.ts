import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client Usecase unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUseCase(repository);

    const input = {
      id: "111",
      name: "name 1",
      email: "email@email.com",
      document: "123",
      address: {
        street: "address 1",
        number: "number1",
        complement: "complement1",
        city: "city1",
        state: "state1",
        zipCode: "0000000",
      },
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.document).toEqual(input.document);
    expect(result.address.street).toEqual(input.address.street);
    expect(result.address.number).toEqual(input.address.number);
    expect(result.address.complement).toEqual(input.address.complement);
    expect(result.address.state).toEqual(input.address.state);
    expect(result.address.zipCode).toEqual(input.address.zipCode);
  });
});
