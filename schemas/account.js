var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    uid: {
        unique: true,
        type: String
    },
    upwd: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    fullname: String,
    sex: {
        type: Number,
        enum: [0, 1]
    },
    age: {
        type: Number,
        min: 1,
        max: 120
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    enable: {
        type: Boolean,
        default: true
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: Date
    }
});

AccountSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

AccountSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb);
    }
};

module.exports = AccountSchema;