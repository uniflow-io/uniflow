package fr.darkwood.uniflow.models;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import fr.darkwood.uniflow.components.Javascript;

import java.util.Iterator;

public class Runner {
    public void run(JsonArray stack) {
        for (int i = 0; i < stack.size(); i++) {
            JsonObject item = stack.get(i).getAsJsonObject();

            String componentClass = item.get("component").getAsString();

            if(componentClass.equals("javascript")) {
                String data = item.get("data").getAsString();
                Javascript component = new Javascript();
                component.deserialise(data);
                component.onExecute();
            }
        }
    }
}
