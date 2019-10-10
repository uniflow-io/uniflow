package fr.darkwood.uniflow.models;

import com.eclipsesource.v8.V8Object;
import com.intellij.openapi.actionSystem.AnActionEvent;

import com.eclipsesource.v8.V8;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import fr.darkwood.uniflow.bridges.Console;
import fr.darkwood.uniflow.bridges.Phpstorm;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

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
        selectionModel.removeSelection();

        // bridge-phpstorm = new Phpstorm(event)
        */

        V8 vm = V8.createV8Runtime();

        //console bridge
        Console console = new Console();
        V8Object v8Console = new V8Object(vm);
        vm.add("console", v8Console);
        v8Console.registerJavaMethod(console, "log", "log", new Class<?>[] { String.class });
        v8Console.registerJavaMethod(console, "error", "error", new Class<?>[] { String.class });
        v8Console.release();

        for (int i = 0; i < stack.size(); i++) {
            JsonObject flow = stack.get(i).getAsJsonObject();
            String code = flow.get("code").getAsString();
            vm.executeScript(code);
        }

        vm.release(true);
    }
}
