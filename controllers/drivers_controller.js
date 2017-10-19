const Driver = require('../models/driver');
module.exports = {
  greeting(req,res){
    res.send({hi:'there'});
  },

//maxDistance unit is meter(m)
  index(req,res,next){
    console.log('In the index function');

    const {lng,lat} = req.query;

    Driver.geoNear(
      {type:'Point',coordinates:[parseFloat(lng),parseFloat(lat)]},
      {spherical:true, maxDistance: 200000}
    )
      .then(drivers => res.send(drivers))
      .catch(next);
  },

  create(req,res,next){

      const driverProps = req.body;

      Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next);
  },

  edit(req,res,next){
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate({_id:driverId},driverProps)
    .then(()=>Driver.findById({_id:driverId}))
    .then(driver => res.send(driver))
    .catch(next);

    // Driver.findOneAndUpdate(
    //  { _id: driverId },
    //  { $set: driverProps },
    //  { new: true, multi: true }
    //  ).then((driver) => res.send({ driver }))
    //  .catch(next);
    //   };
  },

  delete(req,res,next){
    const driverId = req.params.id;
    Driver.findByIdAndRemove({_id:driverId})
    .then(driver => res.status(204).send(driver))
    .catch(next);
  }
};
