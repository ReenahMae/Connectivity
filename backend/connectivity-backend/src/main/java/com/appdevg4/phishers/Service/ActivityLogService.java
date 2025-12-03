package com.appdevg4.phishers.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg4.phishers.Entity.ActivityLogEntity;
import com.appdevg4.phishers.Repository.ActivityLogRepository;

@Service
public class ActivityLogService {
    @Autowired
    ActivityLogRepository actlogrepo;

    public ActivityLogService(){
        super();
    }

     public ActivityLogEntity saveActivityLog(ActivityLogEntity activityLog){
        activityLog.setTimestamp(LocalDateTime.now());
        return actlogrepo.save(activityLog);
    }

    public List<ActivityLogEntity> getAllActivityLog(){
        return actlogrepo.findAll();
    }

    public ActivityLogEntity updateActivityLog(int log_id, ActivityLogEntity newActivityLog){
        ActivityLogEntity activityLog = new ActivityLogEntity();
        try{
            activityLog = actlogrepo.findById(log_id).get();

            activityLog.setActivityType(newActivityLog.getActivityType());
            activityLog.setTimestamp(newActivityLog.getTimestamp());
        }catch(NoSuchElementException ex){
            throw new NoSuchElementException("Activity Log " + log_id + " does not exist!");
        }
            return actlogrepo.save(activityLog);
        }

    public String deleteActivityLog(int log_id){
        String msg = "";

        if(actlogrepo.findById(log_id) != null){
            actlogrepo.deleteById(log_id);
            msg = "Activity Log " + log_id + " is successfully deleted!";
        } else {
            msg = "Activity Log " + log_id + " does not exist!";
        }
        return msg;
    }
}