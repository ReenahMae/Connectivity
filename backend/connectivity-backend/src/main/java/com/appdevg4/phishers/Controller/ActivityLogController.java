package com.appdevg4.phishers.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdevg4.phishers.Entity.ActivityLogEntity;
import com.appdevg4.phishers.Service.ActivityLogService;

@RestController
@RequestMapping("/api/activity")
public class ActivityLogController {
    @Autowired
    ActivityLogService actlogserv;

    @PostMapping
    public ActivityLogEntity postActivityLog(@RequestBody ActivityLogEntity activityLog){
        return actlogserv.saveActivityLog(activityLog);
    }

     @GetMapping
    public List<ActivityLogEntity> getAllActivityLog(){
        return actlogserv.getAllActivityLog();
    }

    @PutMapping("/{log_id}")
    public ActivityLogEntity updateActivityLog(@PathVariable int log_id,@RequestBody ActivityLogEntity newActivityLog){
        return actlogserv.updateActivityLog(log_id, newActivityLog);
    }

    @DeleteMapping("/{log_id}")    
    public String deleteActivityLog(@PathVariable int log_id){
        return actlogserv.deleteActivityLog(log_id);
    }
}
