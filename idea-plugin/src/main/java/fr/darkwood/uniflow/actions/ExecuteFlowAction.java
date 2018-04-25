package fr.darkwood.uniflow.actions;

import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.command.WriteCommandAction;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.project.Project;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public class ExecuteFlowAction extends AnAction {
    public ExecuteFlowAction() {
        super("Execute Flow");
    }

    @Override
    public void update(AnActionEvent e) {
        //Get required data keys
        final Project project = e.getProject();
        final Editor editor = e.getData(CommonDataKeys.EDITOR);
        //Set visibility only in case of existing project and editor
        e.getPresentation().setVisible(project != null && editor != null &&
                editor.getSelectionModel().hasSelection());
    }

    @Override
    public void actionPerformed(AnActionEvent e) {
        //Get all the required data from data keys
        final Editor editor = e.getRequiredData(CommonDataKeys.EDITOR);
        final Project project = e.getProject();
        //Access document, caret, and selection
        final Document document = editor.getDocument();
        final SelectionModel selectionModel = editor.getSelectionModel();
        final int start = selectionModel.getSelectionStart();
        final int end = selectionModel.getSelectionEnd();

        WriteCommandAction.runWriteCommandAction(project, () -> {
            Context cx = Context.enter();
            try {
                Scriptable scope = cx.initStandardObjects();

                String s = "var i = 'coucou_' + 1; i";
                Object result = cx.evaluateString(scope, s, "<cmd>", 1, null);
                String text = Context.toString(result);
                document.replaceString(start, end, text);
            } finally {
                // Exit from the context.
                Context.exit();
            }
        });
        selectionModel.removeSelection();
    }
}
