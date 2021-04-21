'use strict';

const moment = require('moment-timezone');

const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'none' ];

module.exports = class Logger {
    constructor(options) {
        this.options = Object.create(options || {});
        this.options.timestamp = this.options.timestamp !== false;
        this.options.timezone = this.options.timezone || false;
        this.options.level = (this.options.level || 'debug').toLowerCase();
        this.options.common = this.options.common || [];

        this.timestamp = () => this.options.timezone
            ? moment.tz(this.options.timezone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            : moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        this.writeln = $object => console.log(JSON.stringify($object));

        this.head = this.options.timestamp
            ? level => ({ timestamp: this.timestamp(), level: level })
            : level => ({ level: level });


        this.getLogLevel = () => {
            return this.options.level;
        }

        this.setLogLevel = newLevel => {
            this.options.level = newLevel || "";
            this.options.level = this.options.level.toLowerCase();
            
            this.trace = this.debug = this.info = this.warn = this.error = this.fatal = () => { };
            const level = levels.includes(this.options.level) ? this.options.level : 'debug';
            switch (level) {
                case 'trace':
                    this.trace = function () { this.output('trace', Array.from(arguments)) };
                case 'debug':
                    this.debug = function () { this.output('debug', Array.from(arguments)) };
                case 'info':
                    this.info = function () { this.output('info', Array.from(arguments)) };
                case 'warn':
                    this.warn = function () { this.output('warn', Array.from(arguments)) };
                case 'error':
                    this.error = function () { this.output('error', Array.from(arguments)) };
                case 'fatal':
                    this.fatal = function () { this.output('fatal', Array.from(arguments)) };
            }
        }
        
        this.setLogLevel(this.options.level);
    }

    output(level, $arguments) {
        const head = this.head(level);
        const common = this.options.common;
        const $object = {};
        let i = 0;
        ([head].concat($arguments).concat([head]).concat(common)).forEach(_ => {
            if (typeof _ === 'string') {
                $object[`message${i == 0 ? '' : i}`] = _;
                i++;
            }
            else {
                Object.assign($object, _);
            }
        });
        this.writeln($object);
    }
};
