// config/pipeline.js — The stages of the sales pipeline, in order.
//
// To rename a stage, change its label. To add one, add a line in the spot you
// want it to appear. Don't change a stage's "key" once deals are using it —
// the key is what's saved in the database.

const STAGES = [
  { key: 'new',         label: 'New lead' },
  { key: 'contacted',   label: 'Contacted' },
  { key: 'call_booked', label: 'Call booked' },
  { key: 'proposal',    label: 'Proposal sent' },
  { key: 'checkout',    label: 'Checkout started' },
  { key: 'won',         label: 'Won',  closed: true },
  { key: 'lost',        label: 'Lost', closed: true },
];

const STAGE_KEYS = STAGES.map(s => s.key);
const OPEN_STAGE_KEYS = STAGES.filter(s => !s.closed).map(s => s.key);
const stageLabel = key => (STAGES.find(s => s.key === key) || {}).label || key;

module.exports = { STAGES, STAGE_KEYS, OPEN_STAGE_KEYS, stageLabel };
