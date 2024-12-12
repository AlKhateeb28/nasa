function createAgent(innerAgent) {
    const agent = new Agent(innerAgent.id);

    agent.setType(innerAgent.type);
    agent.setLoggerName(innerAgent.loggerName);
    agent.setName(innerAgent.name);
    agent.setUserId(innerAgent.userId);
    agent.setUserName(innerAgent.userName);
    agent.setState(innerAgent.state);
    agent.setTotal(innerAgent.total);
    agent.setProcessed(innerAgent.processed);
    agent.setSkipped(innerAgent.skipped);
    agent.setSaved(innerAgent.saved);
    agent.setNotFound(innerAgent.notFound);
    agent.setMessage(innerAgent.message);
    agent.setErrorMessage(innerAgent.errorMessage);
    agent.setFetchTime(innerAgent.fetchTime);
    agent.setHandlingTime(innerAgent.handlingTime);
    agent.setSavingTime(innerAgent.savingTime);
    agent.setRefreshChart(innerAgent.refreshChart);
    agent.setMsPerRow(innerAgent.msPerRow);
    agent.setMinMsPerRow(innerAgent.minMsPerRow);
    agent.setMaxMsPerRow(innerAgent.maxMsPerRow);
    agent.setMessageDate(innerAgent.messageDate);

    if(innerAgent.optionalData !== undefined) {
        agent.setOptionalData(new OptionalData());

        if(innerAgent.optionalData.name1 !== undefined) {
            agent.getOptionalData().setName1(innerAgent.optionalData.name1)
        }

        if(innerAgent.optionalData.value1 !== undefined) {
            agent.getOptionalData().setValue1(innerAgent.optionalData.value1)
        }

        if(innerAgent.optionalData.name2 !== undefined) {
            agent.getOptionalData().setName2(innerAgent.optionalData.name2)
        }

        if(innerAgent.optionalData.value2 !== undefined) {
            agent.getOptionalData().setValue2(innerAgent.optionalData.value2)
        }
    }

    return agent;
}

class OptionalData extends Object {
    constructor() {
        super();
    }

    getName1 = () => this.name1;
    setName1 = (name1) => this.name1 = name1;

    getValue1 = () => this.value1;
    setValue1 = (value1) => this.value1 = value1;

    getName2 = () => this.name2;
    setName2 = (name2) => this.name2 = name2;

    getValue2 = () => this.value2;
    setValue2 = (value2) => this.value2 = value2;
}

class Agent extends Object {
    constructor(id) {
        super();
        this.id = id;
    }

    getId = () => this.id;
    setId = (id) => this.id = id;

    getOriginalId = () => this.originalId === undefined ? "" : this.originalId;
    setOriginalId = (originalId) => this.originalId = originalId;

    getType = () => this.type === undefined ? "" : this.type;
    setType = (type) => this.type = type;

    getLoggerName = () => this.loggerName === undefined ? "" : this.loggerName;
    setLoggerName = (loggerName) => this.loggerName = loggerName;

    getName = () => this.name === undefined ? "" : this.name;
    setName = (name) => this.name = name;

    getUserId = () => this.userId === undefined ? 0 : this.userId;
    setUserId = (userId) => this.userId = userId;

    getUserName = () => this.userName === undefined ? "" : this.userName;
    setUserName = (userName) => this.userName = userName;

    getState = () => this.state === undefined ? 0 : this.state;
    setState = (state) => this.state = state;

    getTotal = () => this.total === undefined ? "--" : this.total;
    setTotal = (total) => this.total = total;

    getProcessed = () => this.processed === undefined ? "--" : this.processed;
    setProcessed = (processed) => this.processed = processed;

    getSkipped = () => this.skipped === undefined ? "--" : this.skipped;
    setSkipped = (skipped) => this.skipped = skipped;

    getSaved = () => this.saved === undefined ? "--" : this.saved;
    setSaved = (saved) => this.saved = saved;

    getNotFound = () => this.notFound === undefined ? "--" : this.notFound;
    setNotFound = (notFound) => this.notFound = notFound;

    getMessage = () => this.message === undefined ? "" : this.message;
    setMessage = (message) => this.message = message;

    getErrorMessage = () => this.errorMessage === undefined ? "" : this.errorMessage;
    setErrorMessage = (errorMessage) => this.errorMessage = errorMessage;

    getFetchTime = () => this.fetchTime === undefined ? 0 : this.fetchTime;
    setFetchTime = (fetchTime) => this.fetchTime = fetchTime;

    getHandlingTime = () => this.handlingTime === undefined ? 0 : this.handlingTime;
    setHandlingTime = (handlingTime) => this.handlingTime = handlingTime;

    getSavingTime = () => this.savingTime === undefined ? 0 : this.savingTime;
    setSavingTime = (savingTime) => this.savingTime = savingTime;

    getRefreshChart = () => this.refreshChart === undefined ? 0 : this.refreshChart;
    setRefreshChart = (refreshChart) => this.refreshChart = refreshChart;

    getMsPerRow = () => this.msPerRow === undefined ? 0 : this.msPerRow;
    setMsPerRow = (msPerRow) => this.msPerRow = msPerRow;

    getMinMsPerRow = () => this.minMsPerRow === undefined ? 999999 : this.minMsPerRow;
    setMinMsPerRow = (minMsPerRow) => this.minMsPerRow = minMsPerRow;

    getMaxMsPerRow = () => this.maxMsPerRow === undefined ? 0 : this.maxMsPerRow;
    setMaxMsPerRow = (maxMsPerRow) => this.maxMsPerRow = maxMsPerRow;

    getMessageDate = () => this.messageDate === undefined ? 0 : this.messageDate;
    setMessageDate = (messageDate) => this.messageDate = messageDate;

    getStartDateTime = () => this.startDateTime === undefined ? 0 : this.startDateTime;
    setStartDateTime = (startDateTime) => this.startDateTime = startDateTime;

    getOptionalData = () => this.optionalData === undefined ? undefined : this.optionalData;
    setOptionalData = (optionalData) => this.optionalData = optionalData;

    getValueAsPercent = (value) => {
        const totalTime = this.fetchTime + this.handlingTime + this.savingTime;

        if (totalTime === 0) {
            return 0;
        }

        return Math.round(value * 100 / totalTime);
    }
}

const random = () => {
    return Date.now() + Math.random();
}

function createMismatchTask(innerTask) {
    const mismatchTask = new Mismatch(random());

    mismatchTask.setType(innerTask.type);
    mismatchTask.setState(innerTask.state);
    mismatchTask.setMismatchType(innerTask.mismatchType);
    mismatchTask.setDateTime(innerTask.dateTime);
    mismatchTask.setCount(innerTask.count);

    return mismatchTask;
}

class Mismatch extends Object {
    constructor(id) {
        super();
        this.id = id;
    }

    getId = () => this.id;
    setId = (id) => this.id = id;

    getType = () => this.type === undefined ? "" : this.type;
    setType = (type) => this.type = type;

    getState = () => this.state === undefined ? "" : this.state;
    setState = (state) => this.state = state;

    getMismatchType = () => this.mismatchType === undefined ? "" : this.mismatchType;
    setMismatchType = (mismatchType) => this.mismatchType = mismatchType;

    getDateTime = () => this.dateTime === undefined ? "" : this.dateTime;
    setDateTime = (dateTime) => this.dateTime = dateTime;

    getCount = () => this.count === undefined ? 0 : this.count;
    setCount = (count) => this.count = count;
}