package fr.darkwood.uniflow.models.phpstorm;

import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.actionSystem.DataConstants;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VirtualFile;

public class Event {
    private AnActionEvent event;

    public Event(AnActionEvent event) {
        this.event = event;
    }

    public Project getProject()
    {
        return this.event.getProject();
    }

    public Editor getEditor()
    {
        return event.getRequiredData(CommonDataKeys.EDITOR);
    }

    public String getCurrentFilePath() {
        VirtualFile file = (VirtualFile) this.event.getDataContext().getData(DataConstants.VIRTUAL_FILE);

        return file.getPath();
    }
}
