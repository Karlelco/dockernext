import type { Readable } from 'node:stream'
// import type { chainStreams as nodeChainStreams } from './stream-utils.node'
// import type { chainStreams as edgeChainStreams } from './stream-utils.edge'
// export type chainStreams = typeof nodeChainStreams | typeof edgeChainStreams

export * from './stream-utils.edge'

// Errors with: Module './stream-utils.edge' has already exported a member named 'chainStreams'. Consider explicitly re-exporting to resolve the ambiguity.
// export * from './stream-utils.node'

export function chainStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T>
export function chainStreams(...streams: Readable[]): Readable
