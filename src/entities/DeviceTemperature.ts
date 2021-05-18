import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "./Device";
@Entity()
@ObjectType()
@InputType("TemperatureInput")
export class DeviceTemperature extends Base {
  @ManyToOne(() => Device, { nullable: true })
  @Field(() => Device)
  device: Device;

  @Property()
  @Field()
  temperature: number;

  @ManyToOne(() => Device)
  @Field(() => Device)
  by: Device;
}
