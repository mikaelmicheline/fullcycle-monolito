import { SequelizeStorage, Umzug } from "umzug"
import { Sequelize } from "sequelize"

export const migrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: {
      glob: '**/migrations/*.ts',
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console
  })
}