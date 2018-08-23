package fr.darkwood.uniflow.models;

import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.diagnostic.Logger;

import java.util.ArrayList;

public class Phpstorm {
    private AnActionEvent event;

    private static final Logger log = Logger.getInstance(Phpstorm.class);

    public Phpstorm(AnActionEvent event) {
        this.event = event;
    }

    public void log(Object argument)
    {
        Phpstorm.log.info(argument.toString());

        System.out.println(argument);
    }

    public Project getProject()
    {
        return this.event.getProject();
    }

    public Editor getEditor()
    {
        return event.getRequiredData(CommonDataKeys.EDITOR);
    }
}
