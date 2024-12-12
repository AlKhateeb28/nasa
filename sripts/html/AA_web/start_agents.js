function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

var agentId = 7419255387363809706;
var loggerName = "aa_web_7419255387363809706";

try {
    tools.start_agent(7413654006667034412);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}