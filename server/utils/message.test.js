var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', function (){
  it('should generate correct message object', function(){
    var from = 'jen',
        text = 'some message',
        message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toInclude({from, text});
  });
});
