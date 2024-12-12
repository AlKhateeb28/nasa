CREATE TABLE cc_agent_monitor_event(
    id BIGINT NOT NULL PRIMARY KEY IDENTITY (1,1),
    type VARCHAR(50) NOT NULL,
    agent_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    state SMALLINT NOT NULL,
    total VARCHAR(50),
    processed VARCHAR(50),
    skipped VARCHAR(50),
    saved VARCHAR(50),
    not_found VARCHAR(50),
    logger_name VARCHAR(100),
    error_message VARCHAR(2000),
    start_date DATETIME NOT NULL,
    finish_date DATETIME
)