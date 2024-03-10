import React, {useMemo, useState} from 'react';
import {Button, FlatList, SafeAreaView} from 'react-native';
import useBLE from './src/hooks/useBLE.ts';
import {Device} from 'react-native-ble-plx';
import {BleDevice} from './src/components/BleDevice/BleDevice.tsx';

function App(): React.JSX.Element {
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);

  const addDevice = (device: Device) =>
    setFoundDevices(prevState => {
      const foundIndex = prevState.findIndex(
        currentDevice => device.id === currentDevice.id,
      );
      if (foundIndex === -1) {
        return prevState.concat(device);
      } else {
        return prevState;
      }
    });

  const {initializeBLEAndScan} = useBLE(addDevice);

  const deviceRender = (device: Device) => (
    <BleDevice onPress={console.log} key={device.id} device={device} />
  );

  const header = useMemo(
    () => (
      <>
        <Button title="Initialize and scan" onPress={initializeBLEAndScan} />
        <Button title="Clear devices" onPress={() => setFoundDevices([])} />
      </>
    ),
    [initializeBLEAndScan, setFoundDevices],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={header}
        style={{flex: 1}}
        data={foundDevices}
        renderItem={({item}) => deviceRender(item)}
        keyExtractor={device => device.id}
      />
    </SafeAreaView>
  );
}

export default App;
