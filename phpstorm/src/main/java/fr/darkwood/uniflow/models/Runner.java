package fr.darkwood.uniflow.models;

import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.util.io.StreamUtil;
import com.intellij.openapi.command.WriteCommandAction;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.project.Project;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import fr.darkwood.uniflow.components.Javascript;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import java.util.Iterator;

public class Runner {
    public void run(JsonArray stack, AnActionEvent event) {
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

        Execute execute = new Execute();

        for (int i = 0; i < stack.size(); i++) {
            JsonObject item = stack.get(i).getAsJsonObject();

            String componentClass = item.get("component").getAsString();

            if(componentClass.equals("javascript")) {
                String data = item.get("data").getAsString();
                Javascript component = new Javascript();
                component.deserialise(data);
                component.onExecute(execute);
            }
        }

        try {
            ScriptEngineManager engineManager = new ScriptEngineManager();
            ScriptEngine engine = engineManager.getEngineByName("nashorn");
            ScriptContext context = engine.getContext();
            context.setAttribute("phpstorm", new Phpstorm(event), ScriptContext.ENGINE_SCOPE);

            for (Iterator<String> it = execute.getCommands().iterator(); it.hasNext(); ) {
                String code = it.next();
                engine.eval(code);
            }
        } catch (ScriptException exception) {
            exception.printStackTrace();
        }
    }
}
