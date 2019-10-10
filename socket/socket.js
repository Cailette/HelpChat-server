module.exports = (io) => {
  var agentSocket = io.of('/agent');
  var visitorSocket = io.of('/visitor');
  
  require('./agentSocket')(agentSocket);
  require('./visitorSocket')(visitorSocket);
}