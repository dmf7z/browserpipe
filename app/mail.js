var mailer = require("nodemailer");

var jade = require('jade'),
    path = __dirname + '/views/email/bookmark.jade',
    str = require('fs').readFileSync(path, 'utf8'),
    render = jade.compile(str, { filename: path, pretty: true });

var logger = require('rufus').getLogger('app.mailer');

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "no-reply@browserpipe.com",
    pass: "dendanpipe"
  }
});

exports.sendBookmarkEmail = function(user, item) {
  var mail = {
    from: "Browserpipe <no-reply@browserpipe.com>",
    to: user.email,
    subject: "Browserpipe - " + item.title,
    html: render({  
      url: item.url,
      cache: item.url, 
      title: item.title,
      screenshot: "http://www.websitescreenshots.com/images/example-club977.jpg" //item.screenshot
    })
  }
  smtpTransport.sendMail(mail, function(error, response){
    if(error)
      logger.error('Error sending to %s for url "%s": %s', user.name, item.url, error.toString());
    else
      logger.debug('Email sent to %s for url "%s"', user.name, item.url);
    smtpTransport.close();
  });
}
