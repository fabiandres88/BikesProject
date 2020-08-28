var mongoose = require ('mongoose');
var moment = require ('moment');
var Schema = mongoose.Schema;

var reserveSchema = new Schema ({
    from: Date,
    to: Date,
    bike: { type: mongoose.Schema.Types.ObjectId, ref: 'bike'},
    user: { type:mongoose.Schema.Types.ObjectId, ref: 'user'},
});

reserveSchema.methods.daysOfReserve = function () {
    return moment(this.to).diff(moment(this.from),'days') + 1;
};

module.exports= mongoose.model('reserve', reserveSchema);