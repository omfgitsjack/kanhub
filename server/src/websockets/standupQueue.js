
import _ from 'lodash';

const Queue = function(client, { key, users }) {
    this.client = client;
    this.key = key
    this.setKey = key + '/set';
    this.queueKey = key + '/queue';

    // Set is initially empty
    this.client.del(key)
}

Queue.prototype.enqueue = function(user) {
    // make sure it's not in the set yet
    this.client.rpush(this.queueKey, user);
}

Queue.prototype.dequeue = function() {
    return this.client.lpopAsync(this.queueKey)
}

Queue.prototype.removeAll = function() {
    return this.client.del(this.key);
}

export default Queue