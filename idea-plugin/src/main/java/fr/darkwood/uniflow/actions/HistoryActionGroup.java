package fr.darkwood.uniflow.actions;

import com.intellij.openapi.actionSystem.ActionGroup;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import fr.darkwood.uniflow.models.Api;
import fr.darkwood.uniflow.models.History;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

public class HistoryActionGroup extends ActionGroup {
    private AnAction[] actionList;
    private Api api;

    public HistoryActionGroup() {
        super();

        this.api = new Api("dev", "wW6ILgNaFVBY56X91ordmaMtjjFv3Uob");
    }


    @NotNull
    @Override
    public AnAction[] getChildren(@Nullable AnActionEvent e) {
        return this.actionList;
    }

    @Override
    public void update(AnActionEvent e) {
        try {
            ArrayList<AnAction> actions = new ArrayList<AnAction>();

            ArrayList<History> list = this.api.getHistory();
            for(Iterator<History> it = list.iterator(); it.hasNext();) {
                History history = it.next();

                actions.add(new ExecuteFlowAction(this.api, history));
            }

            AnAction[] arr = new AnAction[actions.size()];
            this.actionList = actions.toArray(arr);
        } catch (IOException e1) {
            e1.printStackTrace();
        }

        super.update(e);
    }
}
