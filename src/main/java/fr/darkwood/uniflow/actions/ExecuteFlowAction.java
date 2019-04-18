package fr.darkwood.uniflow.actions;

import com.google.gson.JsonArray;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;

import fr.darkwood.uniflow.models.Api;
import fr.darkwood.uniflow.models.History;
import fr.darkwood.uniflow.models.Runner;

import java.io.IOException;

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
            runner.run(stack, e);
        } catch (IOException exception) {
            exception.printStackTrace();
        }
    }
}
