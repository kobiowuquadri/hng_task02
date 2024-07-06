import { Model, Column, DataType } from "drizzle-orm";


class User extends Model {
  static tableName = 'users';

  @Column({
    type: DataType.STRING,
    primaryKey: true,
    unique: true
  })
  userId;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  firstName;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  lastName;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  email;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password;

  @Column({
    type: DataType.STRING,
  })
  phoneNumber;

}


export default User