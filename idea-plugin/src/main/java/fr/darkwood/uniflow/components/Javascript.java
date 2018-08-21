package fr.darkwood.uniflow.components;

public class Javascript {
    private String javascript;

    public void deserialise(String javascript) {
        this.javascript = javascript;
    }

    public void onExecute() {
        System.out.println(this.javascript);
    }
}
