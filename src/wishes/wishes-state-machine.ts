import { Machine } from 'xstate';

export const wishesStateMachine = Machine({
  id: 'wish',
  initial: 'AWAITING_CPU',
  context: {
    computation_started_at: null,
    computation_finished_at: null,
    done_by_worker_id: null,
  },
  states: {
    AWAITING_CPU: {
      on: {
        START: 'ONGOING',
      },
    },
    ONGOING: {
      on: {
        COMPLETE: 'COMPLETED',
      },
    },
    COMPLETED: {
      type: 'final',
    },
  },
});
