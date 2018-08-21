package fr.darkwood.uniflow.actions;

import com.google.common.io.Files;
import com.google.gson.JsonArray;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.util.io.StreamUtil;
import com.intellij.openapi.command.WriteCommandAction;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.project.Project;

import fr.darkwood.uniflow.models.Api;
import fr.darkwood.uniflow.models.History;
import fr.darkwood.uniflow.models.Runner;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.io.InputStream;

public class ExecuteFlowAction extends AnAction {
    private Api api;
    private History history;

    public ExecuteFlowAction(Api api, History history) {
        super(history.getTitle());

        this.api = api;
        this.history = history;
    }

    @Override
    public void actionPerformed(AnActionEvent e) {
        try {
            String data = api.getHistoryData(this.history.getId());
            this.history.setData(data);
            JsonArray stack = this.history.deserialiseFlowData();

            Runner runner = new Runner();
            runner.run(stack);
        } catch (IOException exception) {
            exception.printStackTrace();
        }

        //Get all the required data from data keys
        /*final Editor editor = e.getRequiredData(CommonDataKeys.EDITOR);
        final Project project = e.getProject();
        //Access document, caret, and selection
        final Document document = editor.getDocument();
        final SelectionModel selectionModel = editor.getSelectionModel();
        final int start = selectionModel.getSelectionStart();
        final int end = selectionModel.getSelectionEnd();

        WriteCommandAction.runWriteCommandAction(project, () -> {
            try {
                String path = "/js/bundle.js";
                String javascript = getFileTemplateContent(path);
                Code javaObj = new Code();

                ScriptEngineManager engineManager = new ScriptEngineManager();
                ScriptEngine engine = engineManager.getEngineByName("nashorn");
                ScriptContext context = engine.getContext();
                context.setAttribute("javaObj", javaObj, ScriptContext.ENGINE_SCOPE);

                Object result = engine.eval(javascript);
                String text = result.toString();
                document.replaceString(start, end, text);
            } catch (ScriptException | IOException exception) {
                exception.printStackTrace();
            }
        });
        selectionModel.removeSelection();*/
    }

    @Nullable
    private String getFileTemplateContent(@NotNull String filename) throws IOException {
        InputStream in = this.getClass().getResourceAsStream(filename);

        return StreamUtil.readText(this.getClass().getResourceAsStream(filename), "UTF-8");
    }
}
