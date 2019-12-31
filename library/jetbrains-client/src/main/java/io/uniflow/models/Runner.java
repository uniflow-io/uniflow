package io.uniflow.models;

import com.eclipsesource.v8.V8Object;
import com.intellij.openapi.actionSystem.AnActionEvent;

import com.eclipsesource.v8.V8;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.uniflow.bridges.*;

import java.util.ArrayList;
import java.util.Iterator;

public class Runner {
    public void run(JsonArray rail, AnActionEvent event) {
        ArrayList<Bridge> bridges = new ArrayList<>() {{
            add(new Console());
            add(new Jetbrains(event));
            add(new Filesystem());
            add(new TextPrompt(event));
        }};

        V8 vm = V8.createV8Runtime();
        for (Bridge bridge : bridges) {
            bridge.register(vm);
        }

        for (int i = 0; i < rail.size(); i++) {
            JsonObject flow = rail.get(i).getAsJsonObject();
            String code = flow.get("codes").getAsJsonObject().get("jetbrains").getAsString();
            vm.executeScript(code);
        }

        for (Bridge bridge : bridges) {
            bridge.release();
        }
        vm.release(true);
    }
}
