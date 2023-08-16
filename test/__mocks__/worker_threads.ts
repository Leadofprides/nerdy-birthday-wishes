interface WorkerMessage {
  type: string;
  pow_nonce: number;
  hash: string;
  computation_finished_at: Date;
  thread_id: number;
}

interface WorkerMock {
  on(event: string, callback: (message: WorkerMessage) => void): void;
}

const mockWorker: WorkerMock = {
  on: (event, callback) => {
    if (event === 'message') {
      callback({
        type: 'COMPLETE',
        pow_nonce: 160,
        hash: '005b136e779ae112f85f0620312059ee7d4222143635bfecaee28dc4f7d87d73',
        computation_finished_at: new Date(),
        thread_id: 1,
      });
    }
  },
};

export const Worker = jest.fn().mockImplementation(() => mockWorker);
