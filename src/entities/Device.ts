import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { Base } from "./Base";
import { BatteryVoltage } from "./BatteryVoltage";
import { Environment } from "./Enviroment";
import { Speed } from "./Speed";
import { DeviceTemperature } from "./DeviceTemperature";
import { Vehicle } from "./Vehicle";
import { Location } from "./Location";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";

export enum DeviceState {
  INIT = "init",
  READY = "ready",
  DISCONNECTED = "disconnected",
  SLEEPING = "sleeping",
  LOST = "lost",
  ALERT = "alert",
}

@InputType("DeviceSettingInput")
@ObjectType()
export class DeviceSetting {
  @Field()
  deviceTemperatureFreq: number;
}

registerEnumType(DeviceState, {
  name: "DeviceState", // this one is mandatory
  description: "Trạng thái thiết bị", // this one is optional
});

@ObjectType()
@Entity()
@InputType("DeviceInput")
export class Device extends Base {
  @Property({ unique: true })
  @Field({ description: "Unique Device Identification" })
  udi: string;
  @Property({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Enum({ nullable: true, items: () => DeviceState })
  @Field((type) => DeviceState, { nullable: true })
  state?: DeviceState;

  @Property({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @Property({ nullable: true, type: "jsonb" })
  @Field({ nullable: true })
  settings: DeviceSetting;

  @OneToOne(() => Vehicle, undefined, { nullable: true })
  @Field(() => Vehicle, { nullable: true })
  vehicle: Vehicle;

  @OneToMany(() => DeviceTemperature, (temperature) => temperature.device, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [DeviceTemperature])
  temperatures = new Collection<DeviceTemperature>(this);

  @OneToMany(() => Environment, (environment) => environment.device, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [Environment])
  enviroments = new Collection<Environment>(this);

  @OneToMany(() => Speed, (speed) => speed.by, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [Speed])
  speeds = new Collection<Speed>(this);

  @OneToMany(() => BatteryVoltage, (batteryVoltage) => batteryVoltage.by, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [BatteryVoltage])
  batteryVoltages = new Collection<Speed>(this);

  @OneToMany(() => Location, (location) => location.by, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => [Location])
  locations = new Collection<Location>(this);
}
