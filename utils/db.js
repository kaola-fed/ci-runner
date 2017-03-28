const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1/ci';
mongoose.connect(DB_URI);

const CIScheme = new mongoose.Schema({
  isPassed: Boolean,
  task: mongoose.Schema.Types.Mixed,
}, { timestamps: {} });

const CI = mongoose.model('CI', CIScheme);

module.exports = {
  add: async (task, isPassed) => {
    const ci = new CI({ task, isPassed });
    await ci.save();
  },

  get: async () => {
    await CI.find({})
  },
}
