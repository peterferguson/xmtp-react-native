import { Platform } from 'expo-modules-core'
import { Client, GroupUpdatedCodec, Group } from 'xmtp-react-native-sdk'

export type Test = {
  name: string
  run: () => Promise<boolean>
}

export function isIos() {
  return Platform.OS === 'ios'
}

export async function delayToPropogate(milliseconds = 100): Promise<void> {
  // delay avoid clobbering
  return new Promise((r) => setTimeout(r, milliseconds))
}

export function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg)
  }
}

export async function createClients(numClients: number): Promise<Client[]> {
  const clients = []
  for (let i = 0; i < numClients; i++) {
    const keyBytes = new Uint8Array([
      233, 120, 198, 96, 154, 65, 132, 17, 132, 96, 250, 40, 103, 35, 125, 64,
      166, 83, 208, 224, 254, 44, 205, 227, 175, 49, 234, 129, 74, 252, 135,
      145,
    ])
    const client = await Client.createRandom({
      env: 'local',
      enableV3: true,
      dbEncryptionKey: keyBytes,
    })
    client.register(new GroupUpdatedCodec())
    clients.push(client)
  }
  return clients
}

export async function createV3Clients(numClients: number): Promise<Client[]> {
  const clients = []
  for (let i = 0; i < numClients; i++) {
    const keyBytes = new Uint8Array([
      233, 120, 198, 96, 154, 65, 132, 17, 132, 96, 250, 40, 103, 35, 125, 64,
      166, 83, 208, 224, 254, 44, 205, 227, 175, 49, 234, 129, 74, 252, 135,
      145,
    ])
    const client = await Client.createRandomV3({
      env: 'local',
      enableV3: true,
      dbEncryptionKey: keyBytes,
    })
    client.register(new GroupUpdatedCodec())
    clients.push(client)
  }
  return clients
}

export async function createV3TestingClients(): Promise<Client[]> {
  const clients = []
  const keyBytes = new Uint8Array([
    233, 120, 198, 96, 154, 65, 132, 17, 132, 96, 250, 40, 103, 35, 125, 64,
    166, 83, 208, 224, 254, 44, 205, 227, 175, 49, 234, 129, 74, 252, 135, 145,
  ])
  const alix = await Client.createRandom({
    env: 'local',
  })
  const bo = await Client.createRandomV3({
    env: 'local',
    enableV3: true,
    dbEncryptionKey: keyBytes,
  })
  const caro = await Client.createRandom({
    env: 'local',
    enableV3: true,
    dbEncryptionKey: keyBytes,
  })
  bo.register(new GroupUpdatedCodec())
  caro.register(new GroupUpdatedCodec())

  clients.push(alix, bo, caro)
  return clients
}

export async function createGroups(
  client: Client,
  peers: Client[],
  numGroups: number
): Promise<Group[]> {
  const groups = []
  const addresses: string[] = peers.map((client) => client.address)
  for (let i = 0; i < numGroups; i++) {
    const group = await client.conversations.newGroup(addresses, {
      name: `group ${i}`,
      imageUrlSquare: `www.group${i}.com`,
      description: `group ${i}`,
    })
    groups.push(group)
  }
  return groups
}
