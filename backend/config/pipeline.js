// config/pipeline.js — The stages of the sales pipeline, in order.
//
// To rename a stage, change its label. To add one, add a line in the spot you
// want it to appear. Don't change a stage's "key" once deals are using it —
// the key is what's saved in the database.

const STAGES = [
  // Same stages as the GoHighLevel "Marketing Pipeline", plus Checkout Started
  // (someone who began signing up on the website but hasn't paid yet).
  // GoHighLevel's "Closed" stage is split into Won and Lost here.
  { key: 'new',         label: 'New Lead' },
  { key: 'contacted',   label: 'Contacted' },
  { key: 'qualified',   label: 'Qualified' },
  { key: 'proposal',    label: 'Proposal Sent' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'checkout',    label: 'Checkout Started' },
  { key: 'won',         label: 'Won',  closed: true },
  { key: 'lost',        label: 'Lost', closed: true },
];

const STAGE_KEYS = STAGES.map(s => s.key);
const OPEN_STAGE_KEYS = STAGES.filter(s => !s.closed).map(s => s.key);
const stageLabel = key => (STAGES.find(s => s.key === key) || {}).label || key;

module.exports = { STAGES, STAGE_KEYS, OPEN_STAGE_KEYS, stageLabel };
