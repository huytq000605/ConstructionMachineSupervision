import { Connection, IDatabaseDriver, EntityManager } from "@mikro-orm/core";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext, Response, PaginatedResponse } from "@root/types";
import { Device } from "@root/entities/Device";
import { DeviceTemperature } from "@root/entities/DeviceTemperature";
import { query } from "express";

//@ts-ignore
@ObjectType()
//@ts-ignore
class TemperatureResponse extends Response(DeviceTemperature) {}
// @ts-ignore
@ObjectType()
// @ts-ignore
class TemperatureTableResponse extends PaginatedResponse(DeviceTemperature) {}

@InputType()
class temperatureInput {
  @Field({ nullable: true })
  deviceUdi: string;
  @Field({ nullable: true })
  floatData: number;
}
@Resolver()
export class TemperatureResolver {
  @Mutation(() => TemperatureResponse)
  async updateTemperatureOfDevice(
    @Ctx() em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
    @Arg("inputs", { nullable: true }) inputFromMqtt?: temperatureInput
  ) {
    if (!inputFromMqtt)
      return {
        errors: [
          {
            message: "Không có dữ liệu!",
          },
        ],
      };
    const device = await em.findOne(Device, { udi: inputFromMqtt.deviceUdi });
    if (!device) {
      console.log("Không có thiết bị này!");
      return {
        errors: [
          {
            message: "Không có thiết bị này!",
          },
        ],
      };
    }

    console.log("Du lieu nhan duoc:");
    console.log(inputFromMqtt.deviceUdi);
    console.log(inputFromMqtt.floatData);

    let temperature = em.create(DeviceTemperature, {
      temperature: inputFromMqtt.floatData,
    });
    temperature.by = device;
    em.persist(temperature);
    try {
      await em.flush();
    } catch (error) {
      console.log(">>> ERROR:");
      console.log(error);
      console.log(
        "================================================================="
      );
      return {
        errors: [
          {
            message: "error",
          },
        ],
      };
    }
    return {
      result: temperature,
    };
  }
  @Query(() => TemperatureTableResponse)
  async getTemperatureOfDevice(
    @Ctx() { em }: MyContext,
    @Arg("inputs", { nullable: true }) deviceUdi?: string
  ) {
    const device = await em.findOne(Device, { udi: deviceUdi });
    if (!device)
      return {
        errors: [
          {
            message: "Không tìm thấy Device!",
          },
        ],
      };
    console.log("Có device!");
    console.log(device.id);
    let temperatureList: DeviceTemperature[] = [];
    for (const token of device.temperatures) {
      console.log("check!");
      temperatureList.push(token);
    }
    temperatureList.reverse();
    return {
      result: {
        total: temperatureList.length,
        list_data: temperatureList,
      },
    };
  } /*
      @Query(()=>TemperatureTableResponse)
      async getAllTemperature(
          @Ctx() { em }: MyContext,
          @Arg("inputs", {nullable:true}) deviceUdi?: string
      ) {*/
}
