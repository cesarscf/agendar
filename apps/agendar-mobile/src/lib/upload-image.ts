import storage from "@react-native-firebase/storage"
import uuid from "react-native-uuid"

export enum StorageEntity {
  Establishment = "establishments",
  Service = "services",
  Employee = "employees",
  Package = "packages",
}

export async function uploadImageToFirebase(
  uri: string,
  entity: StorageEntity
): Promise<string> {
  const randomId = uuid.v4()

  const filename = `${randomId}.jpg`

  const path = `${entity}/${filename}`

  const reference = storage().ref(path)

  await reference.putFile(uri)

  const downloadURL = await reference.getDownloadURL()

  return downloadURL
}
