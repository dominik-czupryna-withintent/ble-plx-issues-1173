import {
  BleManager,
  Device,
  ScanOptions,
  State as BluetoothState,
  Subscription,
  UUID,
} from 'react-native-ble-plx';
import {PermissionsAndroid, Platform} from 'react-native';

const bleManager = new BleManager();
let subscription: Subscription | null = null;

const useBLE = (onDeviceFound: (device: Device) => void) => {
  const initializeBLEAndScan = () => {
    if (subscription) {
      subscription.remove();
    }
    subscription = bleManager.onStateChange(async state => {
      console.log(state);
      switch (state) {
        case BluetoothState.Unauthorized:
          await requestBluetoothPermission();
          break;
        case BluetoothState.Unsupported:
        case BluetoothState.PoweredOff:
          console.error('Init error');
          break;
        case BluetoothState.PoweredOn:
          scanDevices();
          break;
        default:
          console.error('Unsupported state: ', state);
      }
    }, true);
  };

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    if (
      Platform.OS === 'android' &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    return false;
  };

  const scanDevices = async (
    UUIDs: UUID[] | null = null,
    options: ScanOptions | null = null,
  ) =>
    bleManager.startDeviceScan(UUIDs, options, (error, device) => {
      if (error) {
        console.error(error.message);
        bleManager.stopDeviceScan();
        return;
      }
      if (device) {
        onDeviceFound(device);
      }
    });

  return {initializeBLEAndScan};
};

export default useBLE;
