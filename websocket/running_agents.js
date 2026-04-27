<%
// 7267390278950955499

var result = {};
result.errorMessage = "";
result.message = "";

result.agents = [];

try {
	runningAgentList = tools.spxml_unibridge.Object.provider.PeekMessagesFromQueue('ag_running');
	
	if(runningAgentList != undefined) {
		runningCount = 0;
		for(runningAgentId in runningAgentList) {
			agentJsonData=tools.spxml_unibridge.Object.provider.GetUserData('ag_info_'+runningAgentId);
			
			runningAgent = tools.read_object(agentJsonData);
			
			
			result.agents.push(runningAgent.GetOptProperty('id'));
		}
	}
   
    Response.Write(EncodeJson(result));
} catch (e) {
    result.errorMessage = "#" + e;

    Response.Write(EncodeJson(result));
}
%>