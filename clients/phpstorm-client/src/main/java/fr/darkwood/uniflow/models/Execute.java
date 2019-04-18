package fr.darkwood.uniflow.models;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import fr.darkwood.uniflow.components.Javascript;

import java.util.ArrayList;

public class Execute {
    ArrayList<String> commands;


    public Execute() {
        this.commands = new ArrayList<String>();
    }

    public ArrayList<String> getCommands() {
        return commands;
    }

    public void eval(String code) {
        this.commands.add(code);
    }
}
