const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const Driver = mongoose.model('driver');
const app= require('../../app');

describe('Drivers controller test',()=>{
  it('POST request to /api/drivers to create a new driver',done=>{
      Driver.count().then(count=>{
          request(app)
          .post('/api/drivers')
          .send({email:'2@test.net'})
          .end((err,response)=>{
              Driver.count().then(newCount=>{
                assert(newCount === count + 1);
              });
              done();
          });
      });
  });

  it('PUT request to /api/drivers/id edit a driver',done=>{
      const driver = new Driver({email:'a@a.com',driving:false});
      driver.save()
      .then(()=>{
          request(app)
          .put('/api/drivers/' + driver._id)
          .send({driving:true})
          .end(()=>{
              Driver.findOne({email:'a@a.com'})
              .then((driver)=>{
                // console.log(driver);
                assert(driver.driving == true);
                done();
              })
          });
      });
  });

  it('DELETE to /api/drivers/id to delte a driver record',done => {
        const driver = new Driver({email:'111'});

        driver.save().then(()=>{
          request(app)
            .delete('/api/drivers/'+driver._id)
            .end(()=>{
              Driver.findOne({email:'111'})
                .then((driver)=>{

                  assert(driver === null);
                  done();
                })
            });
        });
  });

//NYC: 40.7128° N, 74.0060° W
//SF: 37.7749° N, 122.4194° W
  it('GET to /api/drivers to find drivers in a location', done=>{

    const nycdriver = new Driver({
      email:'nyc@muber.com',
      geometry:{type:'Point',coordinates:[-74.0060, 40.7128]}
    });

    const sfdriver = new Driver({
      email:'sf@muber.com',
      geometry:{type:'Point',coordinates:[-122.4194, 37.7749]}
    });

    Promise.all([nycdriver.save(),sfdriver.save()])
    .then(()=>{
      request(app)
        .get('/api/drivers?lng=-74&lat=40')
        .end((err,response)=>{
          console.log(response);
          assert(response.body.length === 1);
          assert(response.body[0].obj.email === 'nyc@muber.com');
          done();
        });
    });
  });


});
