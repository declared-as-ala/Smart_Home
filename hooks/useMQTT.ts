import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import mqtt, { MqttClient } from 'mqtt';

// Type for the sensor reading
export interface Reading {
  temperature: number;
  humidity: number;
  gas: number;
  updated: string;
}

// Interface (without null)
export interface GasAlert {
  text: string;
  time: string;
}

// MQTT URL based on platform
const URL =
  Platform.OS === 'web'
    ? 'wss://mqtt.eclipseprojects.io/mqtt'
    : 'mqtt://mqtt.eclipseprojects.io:1883';

export function useMQTT() {
  const [client, setClient] = useState<MqttClient>();
  const [online, setOnline] = useState(false);
  const [reading, setReading] = useState<Reading>({
    temperature: 0,
    humidity: 0,
    gas: 0,
    updated: '',
  });
  const [alert, setAlert] = useState<GasAlert | null>(null);

  useEffect(() => {
    const c = mqtt.connect(URL, { reconnectPeriod: 4000 });
    setClient(c);

    c.on('connect', () => {
      setOnline(true);
      c.subscribe([
        'maison/capteurs/all',
        'maison/capteurs/temperature',
        'maison/capteurs/humidite',
        'maison/capteurs/gaz',
        'maison/alerte/gaz',
        'maison/status',
      ]);
    });

    c.on('reconnect', () => setOnline(false));
    c.on('offline', () => setOnline(false));
    c.on('error', () => setOnline(false));

    c.on('message', (topic, buf) => {
      const msg = buf.toString();
      const now = new Date().toISOString();

      if (topic === 'maison/status') {
        setOnline(msg === 'ONLINE');
      }

      if (topic === 'maison/capteurs/all') {
        try {
          const j = JSON.parse(msg);
          setReading({
            temperature: +j.temperature,
            humidity: +j.humidity,
            gas: +j.gas,
            updated: now,
          });
          return;
        } catch {
          // Ignore invalid JSON
        }
      }

      if (topic.endsWith('/temperature'))
        setReading((p) => ({ ...p, temperature: +msg, updated: now }));
      if (topic.endsWith('/humidite'))
        setReading((p) => ({ ...p, humidity: +msg, updated: now }));
      if (topic.endsWith('/gaz'))
        setReading((p) => ({ ...p, gas: +msg, updated: now }));

      if (topic === 'maison/alerte/gaz') {
        setAlert({ text: msg, time: now });
      }
    });

    return () => {
      c.end(true); // Cleanup
    };
  }, []);

  const publish = useCallback(
    (topic: string, message: string) => {
      client?.publish(topic, message);
    },
    [client]
  );

  const subscribe = useCallback(
    (topic: string | string[]) => {
      client?.subscribe(topic);
    },
    [client]
  );

  return { online, reading, alert, publish, subscribe };
}
