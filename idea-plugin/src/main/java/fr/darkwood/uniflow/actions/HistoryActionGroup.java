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

        this.api = new Api("prod", "qNFN9tqqg0tKq7GMPQy1r3nskFMntRjc");
    }


    @NotNull
    @Override
    public AnAction[] getChildren(@Nullable AnActionEvent e) {
        //return actionList;
        History history = new History();
        history.setTitle("toto");
        System.out.println(history.getTitle() + " : display");

        return new AnAction[]{new ExecuteFlowAction(history)};
    }

    @Override
    public void update(AnActionEvent e) {
        /*try {
            ArrayList<AnAction> actions = new ArrayList<AnAction>();

            ArrayList<History> list = this.api.getHistory();
            for(Iterator<History> it = list.iterator(); it.hasNext();) {
                History history = it.next();

                actions.add(new ExecuteFlowAction(history));

            }
            this.actionList = (AnAction[]) actions.toArray();
        } catch (IOException e1) {
            e1.printStackTrace();
        }

        super.update(e);

        System.out.println("update performed !");*/
    }
}
