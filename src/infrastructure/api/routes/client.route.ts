import express, { Request, Response } from "express";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());  
  
  try {
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        complement: req.body.address.complement,
        city: req.body.address.city,
        state: req.body.address.state,
        zipCode: req.body.address.zipCode
      }
    };

    const output = await usecase.execute(clientDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

