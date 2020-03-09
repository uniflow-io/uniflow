package io.uniflow.models;

import com.eclipsesource.v8.ReferenceHandler;
import com.eclipsesource.v8.V8Object;
import com.eclipsesource.v8.V8Value;
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

        /**
         * @// TODO: 14/01/2020
         * - search for memory leak
         * - then remove vmObjects
         * - then make vm.release(true)
         */
        ArrayList<V8Value> vmObjects = new ArrayList<>();
        vm.addReferenceHandler(new ReferenceHandler() {
            @Override
            public void v8HandleCreated(V8Value object) {
                vmObjects.add(object);
            }

            @Override
            public void v8HandleDisposed(V8Value object) {
                vmObjects.remove(object);
            }
        });

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

        for (V8Value vmObject : vmObjects) {
            vmObject.release();
        }

        //vm.release(true);
        vm.release(false);
    }
}
