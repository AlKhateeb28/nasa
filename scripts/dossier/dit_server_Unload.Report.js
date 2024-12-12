// 7260016733638312977
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function addLogResultMessage(loggerName,message,total,processed,saved,skipped){EnableLog(loggerName, true);try{result="";if(message!=null){result=message+" ";}if(total!=null){result=result+total+" ";}if(processed!=null){result=result+processed+" ";}if(saved!=null){result=result+saved;}if(skipped!=null){result=result+skipped;}LogEvent(loggerName,result);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}function getDurationMessage(duration) {try{var durationMessage=" sec";if(duration>=60&&duration<3600){duration=duration/60;durationMessage=" min";}if(duration>=3600){duration=duration/3600;durationMessage=" hour";}return StrReal(duration,1)+durationMessage;}catch(e){throw new Error(e);}}function getWebsocketClient(){try {return new WebSocketClient("ws://192.168.0.96:3000/");} catch (e) {}}function getAgentInstance(agentId, userId,  loggerName){agentDoc=tools.open_doc(agentId);userDoc=tools.open_doc(userId);userDocTE=userDoc.TopElem;agent={};agent.type="AGENT";agent.loggerName=loggerName;agent.id=agentId;agent.name=agentDoc.TopElem.name;agent.userId=userId;agent.userName=userDocTE.lastname+" "+userDocTE.firstname+" "+userDocTE.middlename;agent.state=0;agent.total="--";agent.processed="--";agent.skipped="--";agent.saved="--";agent.notFound="--";agent.message="";agent.errorMessage="";agent.fetchTime=0;agent.handlingTime=0;agent.savingTime=0;agent.refreshChart=0;agent.msPerRow=0;agent.minMsPerRow=999999;agent.maxMsPerRow=0;return agent;}function sendMessageToWebsocket(ws, agent){try {try {ws.Send("#" + EncodeJson(agent));agent.refreshChart = 0;} catch (e) {addLogMessage(agent.loggerName, "[agent.id: " + agent.id + "] Reconnect to websocket");ws = getWebsocketClient();}return ws;}catch(e){return null;}}function refreshMsPerRow(agent,startDate,total){try {if (total > 0) {agent.msPerRow = eval((DateToRawSeconds(Date()) - DateToRawSeconds(startDate)) + ".0 / " + total);} else {agent.msPerRow = 0;}}catch(e){}}function saveMonitorAgents(agent,startDate){try {monitorAgent=tools.new_doc_by_name("cc_agent_monitor_event",false);monitorAgent.BindToDb(DefaultDb);monitorAgentTE=monitorAgent.TopElem;monitorAgentTE.type=agent.type;monitorAgentTE.agent_id=agent.id;monitorAgentTE.user_id=agent.userId;monitorAgentTE.state=agent.state;monitorAgentTE.total=agent.total;monitorAgentTE.processed=agent.processed;monitorAgentTE.skipped=agent.skipped;monitorAgentTE.saved=agent.saved;monitorAgentTE.not_found=agent.notFound;monitorAgentTE.logger_name=agent.loggerName;monitorAgentTE.error_message=agent.errorMessage;monitorAgentTE.start_date=startDate;monitorAgentTE.finish_date=Date();monitorAgent.Save();} catch (e) {}}

if(!LdsIsServer) {
    var agentId = 7260016733638312977;
    var userId = curUserID;
    var msPerRecord = 0.001;

    var startDate = Date();
    var prevDate;
    var loggerName = "agent_7260016733638312977";
    var ws = getWebsocketClient();
    var agent = getAgentInstance(agentId, userId, loggerName);

    var total = 0;
    var processed = 0;
    var saved = 0;
    var notFound = 0;

    agent.message = "Получение данных...";
    ws = sendMessageToWebsocket(ws, agent);
    prevDate = new Date();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    try {
        excel_url = Screen.AskFileOpen('', "Выбери файл *.xls*");
        excel_object = new ActiveXObject("Excel.Application");
        excel_file = excel_object.Workbooks.Open(excel_url);
        excel_sheet = excel_file.Worksheets(1);
        x = 0;

        cur_row = 2;

        xq_str = "for $elem in cc_trainers_for_reports return $elem";

        found_tren = ArraySelectAll(XQuery(xq_str));

        total = ArrayCount(found_tren);

        agent.refreshChart = 1;
        agent.total = total;
        agent.fetchTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        agent.message = "Обработка данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }
        prevDate = new Date();

        for (xtren in found_tren) {
            tren = tools.open_doc(Int(xtren.id)).TopElem;

            if(tren == undefined) {
                continue;
            }

            if (tren.trainer_fullname != undefined) {
                excel_sheet.Cells(cur_row, 1).Value = tren.trainer_fullname;
            }
            if (tren.position_trainer != undefined) {
                excel_sheet.Cells(cur_row, 2).Value = tren.position_trainer;
            }
            if (tren.organization_name != undefined) {
                excel_sheet.Cells(cur_row, 3).Value = tren.organization_name;
            } // Название организации
            if (tren.organization_inn != undefined) {
                excel_sheet.Cells(cur_row, 4).Value = ("'" + tren.organization_inn);
            } // ИНН по организации
            if (tren.region_organization != undefined) {
                excel_sheet.Cells(cur_row, 5).Value = tren.region_organization;
            } // Регион тренера/ИБП
            if (tren.region_in_reporting != undefined) {
                excel_sheet.Cells(cur_row, 6).Value = tren.region_in_reporting;
            } // Регион в отчетности
            if (tren.email != undefined) {
                excel_sheet.Cells(cur_row, 7).Value = tren.email;
            } // Электронная почта
            if (tren.phone != undefined) {
                excel_sheet.Cells(cur_row, 8).Value = tren.phone;
            } //Номер телефона
            if (tren.trainer_type != undefined) {
                excel_sheet.Cells(cur_row, 9).Value = tren.trainer_type == 'не установлено' ? '' : tren.trainer_type;
            }  //Вид тренера
            if (tren.basic_training_program != undefined) {
                excel_sheet.Cells(cur_row, 10).Value = tren.basic_training_program == 'не установлено' ? '' : tren.basic_training_program;
            } //Основная программа подготовки
            if (tren.support_format != undefined) {
                excel_sheet.Cells(cur_row, 11).Value = tren.support_format == 'не установлено' ? '' : tren.support_format;
            }  //Формат поддержки
            if (tren.curator_fullname != undefined) {
                excel_sheet.Cells(cur_row, 12).Value = tren.curator_fullname;
            }//ФИО контактного лица/ФИО тренера РЦК
            if (tren.curator_email != undefined) {
                excel_sheet.Cells(cur_row, 13).Value = tren.curator_email;
            } //e-mail контактного лица/e-mail тренера РЦК
            if (tren.date_selection != undefined) {
                (excel_sheet.Cells(cur_row, 14).Value) = tren.date_selection;
            } //Дата отбора
            if (tren.result_selection != undefined) {
                excel_sheet.Cells(cur_row, 15).Value = tren.result_selection == 'не установлено' ? '' : tren.result_selection;
            }  //Результат очного отбора
            if (tren.ibp_wave_number != undefined) {
                excel_sheet.Cells(cur_row, 16).Value = tren.ibp_wave_number;
            } //Номер группы ВТ/Номер волны ИБП
            if (tren.date_start_module_1 != undefined) {
                (excel_sheet.Cells(cur_row, 17).Value) = tren.date_start_module_1;
            } //Дата начала модуль 1
            if (tren.date_finish_module_1 != undefined) {
                (excel_sheet.Cells(cur_row, 18).Value) = tren.date_finish_module_1;
            }//Дата завершения модуль 1
            if (tren.fact_trained != undefined) {
                excel_sheet.Cells(cur_row, 19).Value = tren.fact_trained == 'не установлено' ? '' : tren.fact_trained;
            }   //ПРОШЕЛ ПОДГОТОВКУ
            if (tren.date_certification_module_1 != undefined) {
                (excel_sheet.Cells(cur_row, 20).Value) = tren.date_certification_module_1;
            }//Дата сертификации модуль 1
            if (tren.prog_result_obp != undefined) {
                excel_sheet.Cells(cur_row, 21).Value = tren.prog_result_obp == 'не установлено' ? '' : tren.prog_result_obp;
            }  //Программа "Основы бережливого производства"
            if (tren.prog_date_obp != undefined) {
                (excel_sheet.Cells(cur_row, 22).Value) = tren.prog_date_obp;
            }//Программа "Основы бережливого производства" дата
            if (tren.number_sertificate_obp != undefined) {
                excel_sheet.Cells(cur_row, 23).Value = tren.number_sertificate_obp;
            }//Сертификат
            if (tren.prog_result_rpu != undefined) {
                excel_sheet.Cells(cur_row, 24).Value = tren.prog_result_rpu == 'не установлено' ? '' : tren.prog_result_rpu;
            }  //Программа "Реализация проекта по улучшениям"результат
            if (tren.prog_date_rpu != undefined) {
                (excel_sheet.Cells(cur_row, 25).Value) = tren.prog_date_rpu;
            } //Программа "Реализация проекта по улучшениям" дата
            if (tren.number_sertificate_rpu != undefined) {
                excel_sheet.Cells(cur_row, 26).Value = tren.number_sertificate_rpu;
            } //Сертификат РПУ
            if (tren.prog_result_5c != undefined) {
                excel_sheet.Cells(cur_row, 27).Value = tren.prog_result_5c == 'не установлено' ? '' : tren.prog_result_5c;
            }  //Программа "5С на производстве" результат
            if (tren.prog_date_5c != undefined) {
                (excel_sheet.Cells(cur_row, 28).Value) = tren.prog_date_5c;
            } //Сертификат РПУ дата
            if (tren.number_sertificate_5c != undefined) {
                excel_sheet.Cells(cur_row, 29).Value = tren.number_sertificate_5c;
            } //Сертификат РПУ номер
            if (tren.prog_result_pa != undefined) {
                excel_sheet.Cells(cur_row, 30).Value = tren.prog_result_pa == 'не установлено' ? '' : tren.prog_result_pa;
            }  //Программа "Производственный анализ" результат
            if (tren.prog_date_pa != undefined) {
                (excel_sheet.Cells(cur_row, 31).Value) = tren.prog_date_pa;
            } //
            if (tren.number_sertificate_pa != undefined) {
                excel_sheet.Cells(cur_row, 32).Value = tren.number_sertificate_pa;
            } //
            if (tren.prog_result_kart != undefined) {
                excel_sheet.Cells(cur_row, 33).Value = tren.prog_result_kart == 'не установлено' ? '' : tren.prog_result_kart;
            }  // Программа "Картирование" результат
            if (tren.prog_date_kart != undefined) {
                (excel_sheet.Cells(cur_row, 34).Value) = tren.prog_date_kart;
            } //
            if (tren.number_sertificate_kart != undefined) {
                excel_sheet.Cells(cur_row, 35).Value = tren.number_sertificate_kart;
            }//
            if (tren.date_start_module_2 != undefined) {
                (excel_sheet.Cells(cur_row, 36).Value) = tren.date_start_module_2;
            }//
            if (tren.date_finish_module_2 != undefined) {
                (excel_sheet.Cells(cur_row, 37).Value) = tren.date_finish_module_2;
            } //
            if (tren.date_certification_module_2 != undefined) {
                (excel_sheet.Cells(cur_row, 38).Value) = tren.date_certification_module_2;
            } //
            if (tren.prog_result_sr != undefined) {
                excel_sheet.Cells(cur_row, 39).Value = tren.prog_result_sr == 'не установлено' ? '' : tren.prog_result_sr;
            }  // Программа "Стандартизированная работа" результат
            if (tren.prog_date_sr != undefined) {
                (excel_sheet.Cells(cur_row, 40).Value) = tren.prog_date_sr;
            } //
            if (tren.number_sertificate_sr != undefined) {
                excel_sheet.Cells(cur_row, 41).Value = tren.number_sertificate_sr;
            } //
            if (tren.prog_result_smed != undefined) {
                excel_sheet.Cells(cur_row, 42).Value = tren.prog_result_smed == 'не установлено' ? '' : tren.prog_result_smed;
            }  // Программа "Быстрая переналадка SMED" результат
            if (tren.prog_date_smed != undefined) {
                (excel_sheet.Cells(cur_row, 43).Value) = tren.prog_date_smed;
            } //
            if (tren.number_sertificate_smed != undefined) {
                excel_sheet.Cells(cur_row, 44).Value = tren.number_sertificate_smed;
            } //
            if (tren.prog_result_ao != undefined) {
                excel_sheet.Cells(cur_row, 45).Value = tren.prog_result_ao == 'не установлено' ? '' : tren.prog_result_ao;
            }  // Программа "Автономное обслуживание" результат
            if (tren.prog_date_ao != undefined) {
                (excel_sheet.Cells(cur_row, 46).Value) = tren.prog_date_ao;
            }//
            if (tren.number_sertificate_ao != undefined) {
                excel_sheet.Cells(cur_row, 47).Value = tren.number_sertificate_ao;
            }//
            if (tren.prog_result_oee != undefined) {
                excel_sheet.Cells(cur_row, 48).Value = tren.prog_result_oee == 'не установлено' ? '' : tren.prog_result_oee;
            }  // Программа "Общая эффективность оборудования" результат
            if (tren.prog_date_oee != undefined) {
                (excel_sheet.Cells(cur_row, 49).Value) = tren.prog_date_oee;
            }//
            if (tren.number_sertificate_oee != undefined) {
                excel_sheet.Cells(cur_row, 50).Value = tren.number_sertificate_oee;
            }//
            if (tren.date_start_module_3 != undefined) {
                (excel_sheet.Cells(cur_row, 51).Value) = tren.date_start_module_3;
            }//
            if (tren.date_finish_module_3) {
                (excel_sheet.Cells(cur_row, 52).Value) = tren.date_finish_module_3;
            }//
            if (tren.date_certification_module_3 != undefined) {
                excel_sheet.Cells(cur_row, 53).Value = tren.date_certification_module_3;
            }//
            if (tren.prog_result_mrp != undefined) {
                excel_sheet.Cells(cur_row, 54).Value = tren.prog_result_mrp == 'не установлено' ? '' : tren.prog_result_mrp;
            }  // Программа "Методика решения проблем" результат
            if (tren.prog_date_mrp != undefined) {
                (excel_sheet.Cells(cur_row, 55).Value) = tren.prog_date_mrp;
            }//
            if (tren.number_sertificate_mrp != undefined) {
                excel_sheet.Cells(cur_row, 56).Value = tren.number_sertificate_mrp;
            }//
            if (tren.prog_result_iz != undefined) {
                excel_sheet.Cells(cur_row, 57).Value = tren.prog_result_iz == 'не установлено' ? '' : tren.prog_result_iz;
            } // Программа "Эффективный инфоцентр" результат
            if (tren.prog_date_iz != undefined) {
                (excel_sheet.Cells(cur_row, 58).Value) = tren.prog_date_iz;
            }//
            if (tren.number_sertificate_iz != undefined) {
                excel_sheet.Cells(cur_row, 59).Value = tren.number_sertificate_iz;
            } //
            if (tren.status_trainer != undefined) {
                excel_sheet.Cells(cur_row, 60).Value = tren.status_trainer == 'не установлено' ? '' : tren.status_trainer;
            }  // Статус тренера
            if (tren.prog_result_7vidpoter != undefined) {
                excel_sheet.Cells(cur_row, 61).Value = tren.prog_result_7vidpoter == 'не установлено' ? '' : tren.prog_result_7vidpoter;
            }  // Программа «7 видов потерь» Результат
            if (tren.prog_date_7vidpoter != undefined) {
                (excel_sheet.Cells(cur_row, 62).Value) = tren.prog_date_7vidpoter;
            }//
            if (tren.sertificate_7vidpoter != undefined) {
                excel_sheet.Cells(cur_row, 63).Value = tren.sertificate_7vidpoter;
            } //
            if (tren.prog_result_5coffice != undefined) {
                excel_sheet.Cells(cur_row, 64).Value = tren.prog_result_5coffice == 'не установлено' ? '' : tren.prog_result_5coffice;
            }  // Программа «Система 5С в офисе» результат
            if (tren.prog_date_5coffice != undefined) {
                (excel_sheet.Cells(cur_row, 65).Value) = tren.prog_date_5coffice;
            } //
            if (tren.number_sertificate_5coffice != undefined) {
                excel_sheet.Cells(cur_row, 66).Value = tren.number_sertificate_5coffice;
            } //
            if (tren.prog_result_kartoffice != undefined) {
                excel_sheet.Cells(cur_row, 67).Value = tren.prog_result_kartoffice == 'не установлено' ? '' : tren.prog_result_kartoffice;
            }  // Программа «Картирование офисных процессов» результат
            if (tren.prog_date_kartcoffice != undefined) {
                (excel_sheet.Cells(cur_row, 68).Value) = tren.prog_date_kartcoffice;
            }//
            if (tren.number_sertificate_kartcoffice != undefined) {
                excel_sheet.Cells(cur_row, 69).Value = tren.number_sertificate_kartcoffice;
            } // +
            if (tren.prog_result_ui != undefined) {
                excel_sheet.Cells(cur_row, 70).Value = tren.prog_result_ui == 'не установлено' ? '' : tren.prog_result_ui;
            }  // Программа «Управление изменениями» результат
            if (tren.prog_date_ui != undefined) {
                (excel_sheet.Cells(cur_row, 71).Value) = tren.prog_date_ui;
            }//
            if (tren.number_sertificate_ui != undefined) {
                excel_sheet.Cells(cur_row, 72).Value = tren.number_sertificate_ui;
            }//
            excel_sheet.Cells(cur_row, 78).Value = ("'" + tren.id);
            excel_sheet.Cells(cur_row, 79).Value = ("'" + tren.comments);
            if (tren.trainer_id != null) {

                if (tren.trainer_id != undefined) {
                    excel_sheet.Cells(cur_row, 73).Value = (tren.trainer_id + ' ');
                    trener = tools.open_doc(Int(tren.trainer_id)).TopElem;
                    if (trener != undefined) {
                        excel_sheet.Cells(cur_row, 74).Value = trener.fullname;

                        excel_sheet.Cells(cur_row, 76).Value = trener.org_name;

                        if (trener.org_id != undefined) {
                            org_ = tools.open_doc(Int(trener.org_id)).TopElem;

                            if(org_ != undefined) {
                                excel_sheet.Cells(cur_row, 75).Value = ("'" + org_.code);
                            }

                            reg_ = tools.open_doc(Int(org_.region_id)).TopElem;

                            if(reg_ != undefined) {
                                excel_sheet.Cells(cur_row, 77).Value = reg_.name;
                            }
                        }
                    }
                }
            } else {
                excel_sheet.Cells(cur_row, 74).Value = '';
            }

            cur_row++;
            x++;
            //if (x >= 3000) break;

            processed++;

            if (processed % 20 == 0) {
                agent.processed = processed;
                if (ws != null) {
                    ws = sendMessageToWebsocket(ws, agent);
                }
            }
            if(processed % 1000 == 0) {
                addLogMessage(
                    loggerName,
                    "[agent.id: " + agentId + "] Remaining time: " + getDurationMessage( (total - processed) * msPerRecord )
                );
            }
        }

        agent.processed = processed;
        agent.handlingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Сохранение данных...";
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        excel_file.Save()

        agent.state = 1;
        agent.processed = processed;
        agent.savingTime = DateToRawSeconds(Date()) - DateToRawSeconds(prevDate);
        refreshMsPerRow(agent, startDate, total);
        duration = getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate));
        agent.message = "Сервер | Закончено. Продолжительность " + duration;
        if (ws != null) {
            ws = sendMessageToWebsocket(ws, agent);
        }

        addLogResultMessage(
            loggerName,
            "[agent.id: " + agentId + "]",
            total + " total, ",
            processed  + " processed",
            saved + " saved",
            null
        );

        addLogMessage(
            loggerName,
            "[agent.id: " + agentId + "] Duration: " + getDurationMessage(DateToRawSeconds(Date()) - DateToRawSeconds(startDate))
        );

        excel_object.Application.Quit();
    } catch (e) {
        agent.state = 2;
        agent.errorMessage = e;
        sendMessageToWebsocket(ws, agent);

        addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

        excel_object.Application.Quit();
    }

    saveMonitorAgents(agent, startDate);

    try {
        ws.Send("close");
    } catch (e) {}
} else {
    Screen.MsgBox("Запустите агент на стороне клиента!", ms_tools.get_const('c_info'), 'info', 'ok');
}