package fr.darkwood.uniflow.components;

import fr.darkwood.uniflow.models.Execute;

public class Javascript {
    private String javascript;

    public void deserialise(String javascript) {
        this.javascript = javascript;
    }

    public void onExecute(Execute execute) {
        execute.eval(this.javascript);
    }
}
