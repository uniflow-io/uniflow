package io.uniflow.actions;

import com.google.gson.JsonArray;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;

import io.uniflow.models.Api;
import io.uniflow.models.Program;
import io.uniflow.models.Runner;

import java.io.IOException;

public class ExecuteFlowAction extends AnAction {
    private Api api;
    private Program program;

    public ExecuteFlowAction(Api api, Program program) {
        super(program.getTitle());

        this.api = api;
        this.program = program;
    }

    @Override
    public void actionPerformed(AnActionEvent e) {
        try {
            String data = api.getProgramData(this.program.getId());
            this.program.setData(data);
            JsonArray flows = this.program.deserializeFlowsData();

            Runner runner = new Runner();
            runner.run(flows, e);
        } catch (IOException exception) {
            exception.printStackTrace();
        }
    }
}
