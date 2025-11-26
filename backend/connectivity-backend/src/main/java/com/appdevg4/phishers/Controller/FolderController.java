package com.appdevg4.phishers.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.appdevg4.phishers.Entity.FolderEntity;
import com.appdevg4.phishers.Service.FolderService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/folders")
public class FolderController {
    
    @Autowired
    FolderService folderserv;

    public FolderController(FolderService folderService){
        this.folderserv = folderService;
    }

    @GetMapping
    public List<FolderEntity> getAllFolder(){
        return folderserv.getAllFolder();
    }

    @PostMapping
    public FolderEntity addFolder(@RequestBody FolderEntity folder){
        return folderserv.saveFolder(folder);
    }

    @PutMapping("/updateFolder")
    public FolderEntity updateFolder(@RequestHeader int folder_id, @RequestBody FolderEntity folder){
        return folderserv.updateFolder(folder_id, folder);
    }

    @DeleteMapping("/deleteFolder/{folder_id}")
    public String deleteFolder(@PathVariable int folder_id){
        return folderserv.deleteFolder(folder_id);
    }
}
