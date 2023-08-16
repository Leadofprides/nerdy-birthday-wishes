import * as crypto from 'crypto';
import { workerData, parentPort, threadId } from 'worker_threads';

const computeHashWithNonce = (wishes_body, pow_nonce) => {
  const data = JSON.stringify({ ...wishes_body, pow_nonce });
  return crypto.createHash('sha256').update(data).digest('hex');
};

parentPort.postMessage({
  type: 'START',
  computation_started_at: new Date(),
});

let pow_nonce = 0;
while (true) {
  const hash = computeHashWithNonce(workerData, pow_nonce);
  if (hash.startsWith('00')) {
    parentPort.postMessage({
      type: 'COMPLETE',
      pow_nonce,
      hash,
      computation_finished_at: new Date(),
      thread_id: threadId,
    });
    break;
  }
  pow_nonce++;
}
