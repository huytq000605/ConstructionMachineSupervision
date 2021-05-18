import mqtt from "mqtt";
import { MQTT_BRAND, MQTT_BROKER } from "@root/config";
import {
  Connection,
  IDatabaseDriver,
  EntityManager,
  wrap,
} from "@mikro-orm/core";
import { logger } from "@root/utils/logger";
import { Device } from "@root/entities/Device";
import { orm } from "@root/index";
import { LocationResolver } from "@root/resolvers/Location";
import { TemperatureResolver } from "@root/resolvers/Temperature";
import { TopicRegex } from "@cvs/common";

const DEVICE_TOPIC = `${MQTT_BRAND}/+/+`;
const NODE_TOPIC = `${MQTT_BRAND}/+/+/+`;
const PROPERTY_TOPIC = `${MQTT_BRAND}/+/+/+/#`;
const DEVICE_ID_REGEX = new RegExp(`(?<=${MQTT_BRAND}/).*(?=/)`);
const DEVICE_STATE_TOPIC_REGEX = new RegExp(`(?<=${MQTT_BRAND}/.*/)\\$state$`);
const DEVICE_TEMPERATURE_FREQ_SETTING_TOPIC_REGEX = new RegExp(
  `(?<=${MQTT_BRAND}/.*/device/temperature/)\\$freq$`
);

export const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on(
  "connect",
  (
    connectionAck: mqtt.Packet & {
      retain: boolean;
      qos: 0 | 1 | 2;
      dup: boolean;
      topic: string | null;
      payload: string | null;
      sessionPresent: boolean;
      returnCode: number;
    }
  ) => {
    logger.info(`Connected to MQTT Broker: ${MQTT_BROKER}`);

    if (!connectionAck.sessionPresent) {
      mqttClient?.subscribe(DEVICE_TOPIC, { qos: 2 }, (error, response) => {
        if (error) {
          logger.error(`Subscribe DEVICE_TOPIC error: ${error}`);
        } else {
          response.forEach(({ topic }) => {
            logger.info(`Subscribe DEVICE_TOPIC successfully: ${topic}`);
          });
        }
      });

      mqttClient?.subscribe(NODE_TOPIC, { qos: 2 }, (error, response) => {
        if (error) {
          logger.error(`Subscribe NODE_TOPIC error: ${error}`);
        } else {
          response.forEach(({ topic }) => {
            logger.info(`Subscribe NODE_TOPIC successfully: ${topic}`);
          });
        }
      });

      mqttClient?.subscribe(PROPERTY_TOPIC, { qos: 2 }, (error, response) => {
        if (error) {
          logger.error(`Subscribe PROPERTY_TOPIC error: ${error}`);
        } else {
          response.forEach(({ topic }) => {
            logger.info(`Subscribe PROPERTY_TOPIC successfully: ${topic}`);
          });
        }
      });
    }
  }
);

mqttClient.on("reconnect", () => {
  logger.info(`Reconnect to MQTT Broker ${MQTT_BROKER}`);
});

mqttClient.on("disconnect", () => {
  logger.info("Disconnect to MQTT Broker");
});

mqttClient.on("offline", () => {
  logger.info("MQTT Client offline");
});

mqttClient.on("error", (error) => {
  logger.error("Connect MQTT Broker error: ", error);
});

mqttClient.on("end", () => {
  logger.info("MQTT client end");
});

mqttClient.on("packetsend", () => {
  // logger.debug("MQTT client send packet");
});

mqttClient.on("packetreceive", () => {
  // logger.debug("MQTT client receive packet");
});

mqttClient.on("message", async (topic, payload) => {
  // const deviceId = topic.match(DEVICE_ID_REGEX)?.[0];
  // const data = String(payload);
  // const existingDevice = await orm.em.findOne(Device, {
  //   udi: String(deviceId),
  // });
  // if (!existingDevice) {
  //   logger.error("Device does not exist!");
  // }
  // // Check if topic is Location
  // const LOCATION_REGEX = new RegExp(`(location)(?!/.)`);
  // const isLocationTopic = LOCATION_REGEX.test(topic);
  // if (isLocationTopic) {
  //   let locationResolver = new LocationResolver();
  //   locationResolver.updateLocationOfDevice(orm.em, {
  //     deviceUdi: String(deviceId),
  //     jsonData: data,
  //   });
  // }
  // // Check if topic is Temperature
  // console.log("Device temp!");
  // const TEMPERATURE_REGEX = new RegExp(
  //   `(?<!(environment/))(temperature)(?!/.)`
  // ); //no match .../environment/temperature
  // const isTemperatureTopic = TEMPERATURE_REGEX.test(topic);
  // if (isTemperatureTopic) {
  //   console.log("topic matched!");
  //   let temperatureResolver = new TemperatureResolver();
  //   temperatureResolver.updateTemperatureOfDevice(orm.em, {
  //     deviceUdi: String(deviceId),
  //     floatData: parseFloat(data),
  //   });
  // }
});

export const handleMqttMessage = (
  db: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
) => {
  mqttClient.on("message", async (topic, payload) => {
    const topicRegex = new TopicRegex(topic);
    logger.info(`Received message at topic: ${topic} with payload ${payload}`);
    const deviceId = topic.match(DEVICE_ID_REGEX)?.[0];
    // if (DEVICE_STATE_TOPIC_REGEX.test(topic)) {
    if (topicRegex.isDeviceStateTopic()) {
      const state = String(payload);
      let existingDevice = await db.findOne(Device, { udi: String(deviceId) });
      if (!existingDevice) {
        existingDevice = db.create(Device, { udi: deviceId, state });
      } else {
        wrap(existingDevice).assign({ state });
      }
      try {
        await db.persistAndFlush(existingDevice);
      } catch (error) {
        logger.error(error);
      }
    }
    if (DEVICE_TEMPERATURE_FREQ_SETTING_TOPIC_REGEX.test(topic)) {
      const freq = Number(payload);
      console.log(freq);
      let existingDevice = await db.findOne(Device, { udi: String(deviceId) });
      if (!existingDevice) {
        existingDevice = db.create(Device, {
          udi: deviceId,
          settings: {
            deviceTemperatureFreq: freq,
          },
        });
      } else {
        wrap(existingDevice).assign({
          settings: {
            deviceTemperatureFreq: freq,
          },
        });
      }
      try {
        await db.persistAndFlush(existingDevice);
      } catch (error) {
        logger.error(error);
      }
    }
  });
};
