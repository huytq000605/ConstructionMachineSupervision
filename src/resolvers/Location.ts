import {
    Connection,
    IDatabaseDriver,
    EntityManager,
  } from "@mikro-orm/core";
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
  import { MyContext, Response, PaginatedResponse} from "@root/types";
  import { Device } from "@root/entities/Device";
  import { Location } from "@root/entities/Location"
  
  //@ts-ignore
  @ObjectType()
  //@ts-ignore
  class LocationResponse extends Response(Location) {}
  // @ts-ignore
  @ObjectType()
  // @ts-ignore
  class LocationTableResponse extends PaginatedResponse(Location) {}
  
  @InputType()
  class locationInput{
      @Field({nullable:true})
      deviceUdi: string;
      @Field({nullable:true})
      jsonData: string
  }
  @Resolver()
  export class LocationResolver{
      @Mutation(()=>LocationResponse)
      async updateLocationOfDevice(
          @Ctx() em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
          @Arg("inputs", {nullable:true}) inputFromMqtt?: locationInput
      ) {
          if (!inputFromMqtt)
              return {
                  errors: [
                      {
                          message: "Không có dữ liệu!",
                      },
                  ],
              };
          const device = await em.findOne(Device, {udi: inputFromMqtt.deviceUdi});
          if (!device){
              console.log("Không có thiết bị này!");
              return {
                  errors: [
                      {
                          message: "Không có thiết bị này!",
                      },
                  ],
              };
          }
          const locationData = JSON.parse(inputFromMqtt.jsonData);
  
          console.log("Du lieu nhan duoc:");
          console.log(inputFromMqtt.deviceUdi);
          console.log(inputFromMqtt.jsonData);
          
          let location = em.create(Location, locationData);
          location.by = device;
          em.persist(location);
          try {
              await em.flush();
          } catch (error) {
              console.log(error);
              return {
                  errors: [
                      {
                          message: "error",
                      },
                  ],
              };
          }
          return {
              result: location,
          };
      }
      @Query(()=>LocationTableResponse)
      async getLocationOfDevice(
          @Ctx() { em }: MyContext,
          @Arg("inputs", {nullable:true}) deviceUdi?: string
      ) {
          const device = await em.findOne(Device, {udi: deviceUdi});
          if (!device)
              return {
                  errors: [
                      {
                          message: "Không tìm thấy Device!",
                      },
                  ],
              };
          let locationList: Location[] = [];
          for (let token of device.locations)
              locationList.push(token);
          locationList.reverse();
          return {
              result: {
                  total: locationList.length,
                  list_data: locationList
              }
          }
      }
  }
  