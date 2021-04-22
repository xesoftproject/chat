const {hostname} = require('os');

const EC2_HOSTNAME = 'ip-172-31-36-240';

function running_on_ec2() {
    return hostname() === EC2_HOSTNAME;
}

if (running_on_ec2()) module.exports = require('./aws');
else module.exports = require('./local');
