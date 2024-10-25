import { ConsentState } from './ConsentListEntry'
import { ConversationSendPayload, MessagesOptions } from './types'
import { DefaultContentTypes } from './types/DefaultContentType'
import * as XMTP from '../index'
import { DecodedMessage } from '../index'

export enum ConversationVersion {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  DM = 'DM',
}

export interface ConversationContainer<
  ContentTypes extends DefaultContentTypes,
> {
  client: XMTP.Client<ContentTypes>
  createdAt: number
  topic: string
  version: ConversationVersion
  id: string
  state: ConsentState
  lastMessage?: DecodedMessage<ContentTypes>
}

export interface ConversationFunctions<
  ContentTypes extends DefaultContentTypes,
> {
  send<SendContentTypes extends DefaultContentTypes = ContentTypes>(
    content: ConversationSendPayload<SendContentTypes>
  ): Promise<string>
  prepareMessage<SendContentTypes extends DefaultContentTypes = ContentTypes>(
    content: ConversationSendPayload<SendContentTypes>
  ): Promise<string>
  sync()
  messages(opts?: MessagesOptions): Promise<DecodedMessage<ContentTypes>[]>
  streamMessages(
    callback: (message: DecodedMessage<ContentTypes>) => Promise<void>
  ): Promise<() => void>
  consentState(): Promise<ConsentState>
  updateConsent(state: ConsentState): Promise<void>
  processMessage(
    encryptedMessage: string
  ): Promise<DecodedMessage<ContentTypes>>
}
