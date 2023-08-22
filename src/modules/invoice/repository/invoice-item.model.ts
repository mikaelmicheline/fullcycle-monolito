import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoiceitems",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false,  })  
  price: number;  

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel

  @Column({ allowNull: false })
  @ForeignKey(() => InvoiceModel)
  declare invoiceId: string;
}

