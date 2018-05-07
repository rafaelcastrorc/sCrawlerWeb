/**
 * Developed by Rafael Castro
 * Handles everything related to the maintenance of the server
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const options = {
  host: 'sql9.freemysqlhosting.net',
  port: '3306',
  user: 'sql9214195',
  password: '2ddXZXDT3m',
  database: 'sql9214195'
};
const connection = mysql.createConnection(options);
const DateDiff = require('date-diff');


router.get('/', function (req, res) {
  res.send('Maintenance API  works!');
});


//Check connection to scrawler db
connection.connect(function (error) {
  if (!error) {
    console.log('Connected to DB scrawlers!')
  } else {
    console.log('There was an error connecting to the database');
  }
});


/**
 * Gets the last time the db was maintained
 */
router.get('/last_maintenance', function (req, res) {

  console.log('SELECT last_maintenance FROM versions ');
  connection.query('SELECT last_maintenance FROM versions', function (err, rows) {
    if (err) console.log('There was an error ' + err);
    else {
      //If result is empty
      if (rows.length === 0) {
        res.json();
      }
      else {
        //Return the number of times it failed to load
        res.json({'last_maintenance': rows[0].last_maintenance});
      }
    }
  });
});


/**
 * Cleans the proxies table by removing locked proxies and failures to load
 */
let cleanProxiesTable = function (callback) {
  //Marks all the proxies that are currently locked, but that have more than 1 failure to load (aka they were
  // unlocked at one point) as unlock and resets failures to load to 1
  connection.query('UPDATE proxies SET unlocked = 1, failed_to_load = 1 WHERE cookies = "" AND unlocked = 0 AND ' +
    'failed_to_load > 0', function (err, results, fields) {
    if (err) {
      callback(false);
    }
    else {

      //Reset counter of unlocked proxies to 1 for all the proxies that are unlocked and have more than 2 failures
      connection.query('UPDATE proxies SET unlocked = 1, failed_to_load = 1 WHERE unlocked = 1 AND ' +
        'failed_to_load > 1', function (err, results, fields) {
        if (err) {
          callback(false);
        }
        else {
          callback(true);
        }
      });
    }
  });
};

/**
 * Updates the last time the db was maintained
 */
let updateMaintenanceTime = function (callback) {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  connection.query('UPDATE versions SET last_maintenance = ? ', [currentDate], function (err, results, fields) {
    if (err) {
      callback(false);
    }
    else {
      callback(true);
    }
  });
};


/**
 * Manually removes an instance from the db
 * @param id
 * @param callback
 */
let removeInstance = function (id, callback) {

  connection.query('SELECT ip, port FROM scrawler_to_proxy WHERE scrawler_id = ? ', [id], function (err, rows) {
    if (err) {
      console.log('There was an error getting all previously unlocked proxies' + err);
      callback(false);
    }
    else {
      //Decrease counter of each proxy
      for (var i = 0; i < rows.length; i++) {
        connection.query('UPDATE proxies SET num_of_instances = num_of_instances - 1 WHERE ip = ?  ' +
          'AND port = ? AND num_of_instances > 0', [rows[i].ip, rows[i].port], function (err, rows) {
          if (err) {
            console.log('There was an error decreasing counter ' + err);
            callback(false);
          }
          else {
            console.log('Decreased counter for proxy : ' + i);
          }
        });
      }
      //Remove instance
      connection.query('DELETE FROM scrawlers WHERE id = (?)', [id], function (err, result) {
        if (err) {
          console.log('There was an error removing instance counter ' + err);
          callback(false);
        }
        else {
          console.log('Instance deleted : ' + id);
          callback(true);
        }
      });
    }
  })
};


/**
 * Resets an instance that is not workign
 */
let cleanScrawlers = function (callback) {
  //Get all the instances
  connection.query('SELECT id, last_updated, socket_id, effectiveness_rate ' +
    'FROM scrawlers JOIN user_to_instance ON ' +
    'user_to_instance.instance = scrawlers.id', function (err, results, fields) {
    if (err) {
      console.log(err);
      callback(false);
    }
    else {
      let queryAns = [];
      for (var i = 0; i < results.length; i++) {
        //If they have no time, it means that they have not started downloading yet so we ignore them
        if (results[i].last_updated === null) continue;
        const date1 = new Date();
        const date2 = new Date();

        //Convert MYSQL time stamp to javascript date
        date2.setTime(results[i].last_updated);
        const diff = new DateDiff(date1, date2);
        console.log('current date ' + date1.toUTCString());
        console.log('db date ' + date2.toUTCString());

        //Get all instances that have more than 1 hour without updating

        if (diff.days > 0 ||  diff.hours() > 2) {
          let instance = {
            'id': results[i].id,
            'last_updated': results[i].last_updated,
            'socket_id': results[i].socket_id,
            'effectiveness_rate': results[i].effectiveness_rate,
          };
          queryAns.push(instance);
        }
      }

      //Reset all the instances in the array by sending socket message
      for (i = 0; i < queryAns.length; i++) {
        if (queryAns[i].effectiveness_rate === 0) {
          app.io.to(queryAns[i].socket_id).emit('operation', 'close');
        } else {
          app.io.to(queryAns[i].socket_id).emit('operation', 'restart');
        }
      }
      console.log('Cleaned ' + queryAns.length + ' instances');
      //Wait for 2 minutes
      setTimeout(function () {
        console.log('Checking if there is any instance that needs to be manually cleaned');
        connection.query('SELECT id, last_updated FROM scrawlers', function (err, results, fields) {
          if (err) {
            callback(false);
          }
          else {
            let i;
            //Perform check again to see if there are certain instances that are stuck or that have not been deleted
            let queryAns = [];
            for (i = 0; i < results.length; i++) {
              //If they have no time, it means that they have not started downloading yet so we ignore them
              if (results[i].last_updated === null) continue;
              const date1 = new Date();
              const date2 = new Date();

              //Convert MYSQL time stamp to javascript date
              date2.setTime(results[i].last_updated);
              const diff = new DateDiff(date1, date2);
              //Get all instances that have more than 1 hour without updating
              if (diff.days > 0 ||  diff.hours() > 2) {
                let instance = {'id': results[i].id, 'last_updated': results[i].last_updated};
                queryAns.push(instance);
              }
            }
            //Manually remove them from the db
            for (i = 0; i < queryAns.length; i++) {
              var curr = queryAns[i].id;
              console.log('Instance to be manually removed ' + curr);
              removeInstance(curr, function (removed) {
                if (!removed) {
                  callback(false);
                }
              });
            }
            //Once we are done return true
            console.log('Manually cleaned ' + queryAns.length + ' instances');
            callback(true);
          }
        });
      }, 1000 * 60 * 2);

    }
  });
};


// /**
//  * Reset any instance that is not working every hour
//  */
// setInterval(function () {
//   console.log('Cleaning sCrawler');
//   // Clean proxies table
//   cleanScrawlers(function (cleaned) {
//     if (cleaned) {
//       console.log('All current sCrawlers are working');
//     }
//   });
// }, 1000 * 60 * 1);


/**
 * Execute an automatic maintenance of the db every 24 hours.
 */
setInterval(function () {
  // Clean proxies table
  cleanProxiesTable(function (cleaned) {
    if (cleaned) {
      console.log('Proxies table has been cleaned!');
      //Update maintenance time
      updateMaintenanceTime(function (updated) {
        if (updated) {
          console.log('Maintenance time has been updated!');
        }
      })
    }
  });
}, 1000 * 60 * 60 * 24);

// /**
//  * Execute a system wide maintenance. Cleans the proxies table completely and restarts every instance
//  */
// setInterval(function () {
//   // Clean proxies table
//   cleanProxiesTable(function (cleaned) {
//     if (cleaned) {
//       console.log('Proxies table has been cleaned!');
//       //Update maintenance time
//       updateMaintenanceTime(function (updated) {
//         if (updated) {
//           console.log('Maintenance time has been updated!');
//         }
//       })
//     }
//   });
// }, 1000 * 60 * 60 * 24);

module.exports = router;
