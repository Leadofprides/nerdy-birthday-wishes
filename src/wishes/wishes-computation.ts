import * as crypto from 'crypto';
import { workerData, parentPort, threadId } from 'worker_threads';
import { WishesCreateDto } from './dto/wishes-create.dto';

const computeHashWithNonce = (
  wishes_body: WishesCreateDto,
  pow_nonce: number,
): string => {
  const data = JSON.stringify({ ...wishes_body, pow_nonce });
  return crypto.createHash('sha256').update(data).digest('hex');
};

const computation_started_at = new Date();
let pow_nonce = 0;
while (true) {
  const hash = computeHashWithNonce(workerData, pow_nonce);
  if (hash.startsWith('00')) {
    const computation_finished_at = new Date();
    parentPort.postMessage({
      pow_nonce,
      hash,
      computation_started_at,
      computation_finished_at,
      thread_id: threadId,
    });
    break;
  }
  pow_nonce++;
}
