import React from 'react';
import {Text, View} from 'react-native';

export type DevicePropertyProps = {
  name: string;
  value?: number | string | null;
};

export function DeviceProperty({name, value}: DevicePropertyProps) {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      <Text>{name}:</Text>
      <Text>{value || '-'}</Text>
    </View>
  );
}
