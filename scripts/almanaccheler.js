// Description:
//   Script per inviare carte del mercante in fiera
//
// Commands:
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   batt

module.exports = function (robot) {

  var list_url = "https://dl.dropboxusercontent.com/s/7ebi7gcuvc98loy/list.txt"
  var room = "fernandello_test"

  var CronJob = require('cron').CronJob;
  var job = new CronJob('00 41 16 * * *', function() {
    robot.http(list_url).get()(function(err, resp, body) {
        if (err) {
          robot.messageRoom(room, err);
        }
        else {
          var img = body.split('\n');
          var rnd = Math.floor(Math.random() * img.length);
          robot.messageRoom(room, img[rnd]);
        }
      });
    }, function () {
      /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    "Europe/Rome" /* Time zone of this job. */
  );
  job.start();


  robot.respond(/http (.*)/i, function (res) {
    var url = res.match[1].trim()
    robot.http(url)
      .get()(function(err, resp, body) {
        if (err) {
          res.reply(err);
        }
        else
          res.reply(body);
      });
  });

  robot.respond(/pug bomb/i, function (res) {
    res.reply(res.random(frasi));
  });

  robot.respond(/pug me/i, function (res) {
    res.reply(res.random(frasi));
  });

  robot.respond(/ciao/i, function (res) {
    res.reply("wewe");
  });

  robot.respond(/dici (.*)/i, function (res) {
    if (res.message.user.name == "batt") {
      robot.messageRoom(room, res.match[1].trim());
    }
  });
};