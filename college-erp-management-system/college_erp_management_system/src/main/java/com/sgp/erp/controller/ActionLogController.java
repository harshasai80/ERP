package com.sgp.erp.controller;

import com.sgp.erp.model.ActionLog;
import com.sgp.erp.repository.ActionLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class ActionLogController {

    @Autowired
    private ActionLogRepository logRepo;

    @GetMapping("/all")
    public List<ActionLog> getAllLogs() {
        return logRepo.findAllByOrderByTimestampDesc();
    }
}
