'use strict';

/**
 * Node Class
 * @class Node
 */
class Node {
  constructor(value, next){
    this.value = value;
    this.next = next;
  }
}
/**
   * Queue Class
   * @class Queue
   */
class Queue {
  constructor(){
    this.front = null;
    this.back = null;
    this.length = 0;
  }
  /**
     *  Adds node to the back of the queue
     * @param {*} value
     * @method enqueue
     * @memberof Queue
     */
  enqueue(value){
    let newNode = new Node(value);
    if(!this.front){
      this.front = newNode;
      this.back = newNode;
    }
    this.back.next = newNode;
    this.back = newNode;
    this.back.next = null;
    this.length++;
  }
  /**
     * Removes a node from the fron of the queue and returns the value
     * @method dequeue
     * @memberof Queue
     */
  dequeue(){
    let tempNode;
    let val = this.front;
  
    if(this.front === null){
      return null;
    }
    tempNode = this.front;
    this.front = this.front.next;
    tempNode.next = null;
    this.length--;
    return val.value;
  }
  /**
     * Returns the value fo the node at the front of the queue
     * @method peek
     * @memberof Queue
     */
  peek(){
    if(this.front === null){
      return null;
    }
    else{
      return this.front.value;
    }
  }
  /**
     * Returns a boolean whether or not the queue is empty
     * @method isEmpty
     * @memberof Queue
     */
  isEmpty(){
    if(this.front === null){
      return true;
    }
    else{
      return false;
    }
  }
}

module.exports = Queue;