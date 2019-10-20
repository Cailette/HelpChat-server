module.exports = (io) => {
  var visitorSocket = io.of('/visitor');
  var agentSocket = io.of('/agent');
  
  require('./visitorSocket')(visitorSocket, agentSocket);
  require('./agentSocket')(agentSocket, visitorSocket);
}