package com.appdevg4.phishers.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg4.phishers.Entity.FolderEntity;
import com.appdevg4.phishers.Repository.FolderRepository;

@Service
public class FolderService {
    @Autowired
    FolderRepository folderrepo;

    public FolderService(){
       super();
    }

     public FolderEntity saveFolder(FolderEntity folder){
        return folderrepo.save(folder);
    }

    public List<FolderEntity> getAllFolder(){
        return folderrepo.findAll();
    }

    public FolderEntity getFolderById(int folder_id){
        return folderrepo.findById(folder_id)
        .orElseThrow(() -> new NoSuchElementException("Folder" + folder_id + "does not exist!"));
    }

    public FolderEntity updateFolder(int folder_id, FolderEntity newFolder){
        FolderEntity folder = new FolderEntity();

        try{
            folder = folderrepo.findById(folder_id).get();

        folder.setFolderName(newFolder.getFolderName());
        } catch(NoSuchElementException ex){
            throw new NoSuchElementException("Folder " + folder_id + " does not exist!");
        }
        return folderrepo.save(folder);
    }

    public String deleteFolder(int folder_id){
        String msg = "";

        if(folderrepo.findById(folder_id) != null){
            folderrepo.deleteById(folder_id);
            msg = "Folder " + folder_id + " is successfully deleted.";
        } else{
            msg = "Folder " + folder_id + " does not exist!";
        }
       return msg;
    }

}
