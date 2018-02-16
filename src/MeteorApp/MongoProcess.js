import { EventEmitter } from 'events';

const maxAttempts = 40;

export default class MongoProcess extends EventEmitter {
  constructor(mongod) {
    super();
    this.mongod = mongod;
  }

  kill() {
    if (this.killed) return;
    this.killed = true;

    let attempts = 1;
    let interval = null;

    const onInterval = () => {
      if (attempts <= maxAttempts) {
        const signal = attempts < maxAttempts / 2 ? 'SIGTERM' : 'SIGKILL';

        if (!this.mongod.dead) {
          try {
            process.kill(this.mongod.pid, signal);
          } catch (e) {
            this.mongod.dead = true;
          }
        }

        if (this.mongod.dead) {
          clearInterval(interval);
          this.emit('killed');
        }
        attempts += 1;
      } else {
        clearInterval(interval);
        this.emit('error');
      }
    };

    onInterval();
    interval = setInterval(onInterval, 100);
  }
}
