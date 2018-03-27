const moment = require('moment');

let generateMessage = (from , content)=>{
  return{
    from,
    content,
    createdAt: moment() // default to the current date {not formatted yet}
  }
}

module.exports = { generateMessage };
