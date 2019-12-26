package io.uniflow.models;

import com.eclipsesource.v8.V8Object;
import com.intellij.openapi.actionSystem.AnActionEvent;

import com.eclipsesource.v8.V8;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.uniflow.bridges.Console;
import io.uniflow.bridges.Filesystem;
import io.uniflow.bridges.Jetbrains;
import io.uniflow.bridges.TextPrompt;

public class Runner {
    public void run(JsonArray rail, AnActionEvent event) {
        V8 vm = V8.createV8Runtime();

        // console bridge
        Console console = new Console();
        V8Object v8Console = new V8Object(vm);
        vm.add("console", v8Console);
        v8Console.registerJavaMethod(console, "log", "log", new Class<?>[] { String.class });
        v8Console.registerJavaMethod(console, "error", "error", new Class<?>[] { String.class });
        v8Console.release();

        // jetbrains bridge
        Jetbrains jetbrains = new Jetbrains(event);
        V8Object v8Jetbrains = new V8Object(vm);
        vm.add("jetbrains", v8Jetbrains);
        v8Jetbrains.registerJavaMethod(jetbrains, "getCurrentFilePath", "getCurrentFilePath", new Class<?>[] {});
        v8Jetbrains.release();

        // filesystem bridge
        Filesystem filesystem = new Filesystem();
        V8Object v8Filesystem = new V8Object(vm);
        vm.add("filesystem", v8Filesystem);
        v8Filesystem.registerJavaMethod(filesystem, "read", "read", new Class<?>[] { String.class });
        v8Filesystem.release();

        // filesystem bridge
        TextPrompt textPrompt = new TextPrompt(event);
        V8Object v8TextPrompt = new V8Object(vm);
        vm.add("prompt", v8TextPrompt);
        v8TextPrompt.registerJavaMethod(textPrompt.text(), "text");
        v8TextPrompt.release();

        for (int i = 0; i < rail.size(); i++) {
            JsonObject flow = rail.get(i).getAsJsonObject();
            String code = flow.get("codes").getAsJsonObject().get("jetbrains").getAsString();
            vm.executeScript(code);
        }

        vm.release(true);
    }
}
