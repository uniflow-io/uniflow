package io.uniflow.bridges;

import com.eclipsesource.v8.*;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.ui.DialogWrapper;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;
import java.awt.*;

public class TextPrompt {
    private AnActionEvent event;
    private JPanel root;
    private JTextArea textarea;
    private JPanel textfields;

    public TextPrompt(AnActionEvent event) {
        this.event = event;
    }

    private void createUIComponents() {
    }

    public JavaCallback text() {
        return new JavaCallback() {

            @Override
            public Boolean invoke(final V8Object receiver, final V8Array parameters) {
                V8Function callback = (V8Function) parameters.get(0);

                DialogWrapper dialogWrapper = new DialogWrapper(TextPrompt.this.event.getProject(), false) {
                    {
                        init();
                        setTitle("Prompt");
                    }

                    @Nullable
                    @Override
                    protected String getDimensionServiceKey() {
                        return "Uniflow.TextPrompt";
                    }

                    @Nullable
                    @Override
                    protected JComponent createCenterPanel() {
                        return TextPrompt.this.root;
                    }

                    @Override
                    protected void doOKAction() {
                        /*V8 v8;
                        V8Array callbackParameters = new V8Array(v8);
                        callbackParameters.push(TextPrompt.this.textarea.toString()):
                        callback.call(receiver, );*/
                        callback.call(receiver, null);

                        super.doOKAction();
                    }
                };

                return dialogWrapper.showAndGet();
            }
        };
    }
}
