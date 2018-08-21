package fr.darkwood.uniflow.models;

import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.project.Project;

import java.util.ArrayList;

public class Phpstorm {
    private AnActionEvent event;

    public Phpstorm(AnActionEvent event) {
        this.event = event;
    }

    public void log(Object argument)
    {
        System.out.println("Phpstorm log : " + argument);
    }

    public int[] getEditorSelection()
    {
        final Project project = this.event.getProject();
        final Editor editor = event.getRequiredData(CommonDataKeys.EDITOR);
        //Access document, caret, and selection
        final Document document = editor.getDocument();
        final SelectionModel selectionModel = editor.getSelectionModel();
        final int start = selectionModel.getSelectionStart();
        final int end = selectionModel.getSelectionEnd();

        return new int[]{
            start, end
        };
    }
}
