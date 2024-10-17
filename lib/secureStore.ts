import * as SecureStore from 'expo-secure-store';

export const setSecureStore = async (
  key: string,
  value: any,
  options?: SecureStore.SecureStoreOptions,
) => {
  if (!options) {
    return await SecureStore.setItemAsync(key, JSON.stringify(value));
  }
  return await SecureStore.setItemAsync(key, JSON.stringify(value), options);
};

export const getSecureStore = async <T extends any>(
  key: string,
  options?: SecureStore.SecureStoreOptions,
) => {
  let result: any;
  if (!options) {
    result = await SecureStore.getItemAsync(key);
  }
  result = await SecureStore.getItemAsync(key, options);

  return JSON.parse(result) as T;
};

export const deleteSecureStore = async (
  key: string,
  options?: SecureStore.SecureStoreOptions,
) => {
  try {
    if (options) {
      await SecureStore.deleteItemAsync(key, options);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    // do nothing
    console.log(error.message);
  }
};
