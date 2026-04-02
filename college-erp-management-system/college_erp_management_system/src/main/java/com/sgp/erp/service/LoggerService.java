package com.sgp.erp.service;

import com.sgp.erp.model.ActionLog;
import com.sgp.erp.repository.ActionLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class LoggerService {

    @Autowired
    private ActionLogRepository logRepo;

    @Async
    public void log(String actor, String action, String desc) {
        ActionLog logEntry = new ActionLog();
        logEntry.setActorEmail(actor);
        logEntry.setActionType(action);
        logEntry.setDescription(desc);
        logRepo.save(logEntry);
    }
}
