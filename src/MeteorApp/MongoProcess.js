const maxAttempts = 40;

export default class MongoProcess {
  constructor(mongod) {
    this.mongod = mongod;
    process.on('exit', () => this.kill());
  }

  kill() {
    if (this.killed) return;
    this.killed = true;

    let attempts = 1;
    let interval = null;

    const onInterval = () => {
      if (attempts <= maxAttempts) {
        const signal = attempts < maxAttempts / 2 ? 'SIGTERM' : 'SIGKILL';

        if (this.mongod.dead == null) {
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
      }
      clearInterval(interval);
      this.emit('error');
    };

    onInterval();
    interval = setInterval(onInterval, 100);
  }
}
