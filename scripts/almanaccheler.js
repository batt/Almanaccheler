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

  var room = "fernandello_test"

  var CronJob = require('cron').CronJob;
  var job = new CronJob('00 30 09 * * 1-5', function() {
      var img_list = robot.brain.get('img_list') || null;
      if (img_list === null) {
        return;
      }

      var idx = robot.brain.get('img_idx');
      var max_idx= robot.brain.get('img_cnt');

      robot.messageRoom(room, img_list[idx]);
      idx++;
      if (idx >= max_idx) {
        idx = 0;
      }
      robot.brain.set('img_idx', idx);
    }, function () {
      /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    "Europe/Rome" /* Time zone of this job. */
  );
  job.start();

  var shuffle = function(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
  }

  robot.respond(/load (.*)/i, function (res) {
    var url = res.match[1].trim()
    robot.http(url)
      .get()(function(err, resp, body) {
        if (err) {
          res.reply(err);
        }
        else {
          var img = body.split('\n');
          img = shuffle(img);
          robot.brain.set('img_list', img);
          robot.brain.set('img_idx', 0);
          robot.brain.set('img_cnt', img.length);
          res.reply("Caricate " + img.length + " immagini:\n" + img.join('\n'));
        }
      });
  });

  var randomImg = function(res) {
    var img_list = robot.brain.get('img_list') || null;
    if (img_list === null) {
      res.reply("Immagini non impostate!");
      return;
    }
    var rnd = Math.floor(Math.random()*img_list.length);
    res.reply(img_list[rnd]);
  }
  

  robot.respond(/pug bomb/i, function (res) {
    randomImg(res);
  });

  robot.respond(/pug me/i, function (res) {
    randomImg(res);
  });

  robot.respond(/ciao/i, function (res) {
    randomImg(res);
  });

  robot.respond(/dici (.*)/i, function (res) {
    if (res.message.user.name == "batt") {
      robot.messageRoom(room, res.match[1].trim());
    }
  });
};