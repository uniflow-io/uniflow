package fr.darkwood.uniflow.models;

import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.actionSystem.DataConstants;
import com.intellij.openapi.actionSystem.DataKey;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.diagnostic.Logger;
import com.intellij.openapi.vfs.VirtualFile;
import fr.darkwood.uniflow.models.phpstorm.Event;
import fr.darkwood.uniflow.models.phpstorm.Filesystem;

import java.util.ArrayList;

public class Phpstorm {
    private Event event;
    private Filesystem filesystem;

    private static final Logger log = Logger.getInstance(Phpstorm.class);

    public Phpstorm(AnActionEvent event) {
        this.event = new Event(event);
        this.filesystem = new Filesystem();
    }

    public Event getEvent() {
        return this.event;
    }

    public Filesystem getFilesystem() {
        return this.filesystem;
    }

    public void log(Object argument)
    {
        Phpstorm.log.info(argument.toString());

        System.out.println(argument);
    }
}
