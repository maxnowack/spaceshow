import { EventEmitter } from 'events';
import path from 'path';
import ps from 'psext';
import childProcess from 'child_process';
import MongoProcess from './MongoProcess';

const getSettingsString = (settings) => {
  if (settings.indexOf('{') > -1) return `"${settings.replace(/"/, '\\"')}"`;
  return settings;
};

const getMongoProcess = meteorPid => new Promise((resolve, reject) => {
  ps.lookup({
    command: 'mongod',
    psargs: '-l',
    ppid: meteorPid,
  }, (err, results) => {
    if (err) {
      reject(err);
      return;
    }
    if (results.length > 1) console.warn('Multiple mongo child processes started!'); // eslint-disable-line no-console
    resolve(new MongoProcess(results[0]));
  });
});

const hasStartedMongoDBText = buffer => buffer.lastIndexOf('Started MongoDB') !== -1;
const hasErrorText = buffer => buffer.lastIndexOf('Waiting for file change.') !== -1;
const hasReadyText = buffer => buffer.lastIndexOf('=> App running at:') !== -1;

export default class MeteorApp extends EventEmitter {
  constructor(options) {
    super();
    this.args = options.args || [];
    this.appDir = options.appDir;
    this.port = options.port;
    this.settings = options.settings;
    this.meteorPath = options.meteorPath || path.basename('meteor');

    this.buffer = {
      stdout: '',
      stderr: '',
    };

    process.on('exit', () => this.kill());
  }

  getArgs() {
    const args = [];
    args.push('run');
    args.push('--port', this.port);
    if (this.settings) args.push(`--settings=${getSettingsString(this.settings)}`);
    this.args.forEach(arg => args.push(arg));
    return args;
  }


  launch() {
    if (!this.launchPromise) {
      this.launchPromise = new Promise((resolve, reject) => {
        const args = this.getArgs();
        this.childProcess = childProcess.spawn(this.meteorPath, args, {
          cwd: this.appDir,
          detached: false,
        });

        this.childProcess.on('exit', (code, signal) => {
          this.emit('exit', code, signal);
        });

        this.childProcess.stdout.on('data', (data) => {
          this.buffer.stdout += data;
          this.emit('stdout', data);

          if (hasStartedMongoDBText(data)) {
            getMongoProcess(this.childProcess.pid).then((p) => {
              this.mongoProcess = p;
            });
            this.emit('mongodb_started');
          }

          if (hasErrorText(data)) {
            this.emit('error', data);
            reject(data);
          }

          if (hasReadyText(data)) {
            this.emit('started');
            resolve(this);
          }
        });

        this.childProcess.stderr.on('data', (data) => {
          this.buffer.stderr += data;
          this.emit('stderr', data);

          if (hasErrorText(data)) {
            this.emit('error', this.buffer.stderr);
            reject(data);
          }
        });
      });
    }
    return this.launchPromise;
  }

  kill(signal = 'SIGTERM') {
    if (this.childProcess) this.childProcess.kill(signal);
    if (this.mongoProcess) this.mongoProcess.kill();
  }
}
