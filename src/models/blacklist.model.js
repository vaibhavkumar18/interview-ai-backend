const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required to be added to blacklist']
    },

}, {
    timestamps: true
});

const tokenBlacklistModel = mongoose.model('BlacklistToken', blacklistSchema);

module.exports = tokenBlacklistModel;