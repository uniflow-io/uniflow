package io.uniflow.bridges;

import com.eclipsesource.v8.*;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.ui.DialogWrapper;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;

public class TextPrompt implements Bridge {
    private V8 vm;
    private ArrayList<V8Value> refs;

    private AnActionEvent event;
    private JPanel root;
    private JTextArea textarea;
    private JPanel textfields;
    private JLabel inputField;

    public TextPrompt(AnActionEvent event) {
        this.event = event;
        this.refs = new ArrayList<>();
    }

    private void createUIComponents() {
    }

    public JavaCallback text() {
        return new JavaCallback() {

            @Override
            public Boolean invoke(final V8Object receiver, final V8Array parameters) {
                String inputField = parameters.get(0).toString();
                V8Function callback = (V8Function) parameters.get(1);

                TextPrompt.this.inputField.setText(inputField.toString());
                TextPrompt.this.textarea.setText("");

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
                        V8Array callbackParameters = new V8Array(callback.getRuntime());
                        callbackParameters.push(TextPrompt.this.textarea.getText());
                        callback.call(receiver, callbackParameters);

                        refs.add(callbackParameters);

                        super.doOKAction();
                    }
                };

                return dialogWrapper.showAndGet();
            }
        };
    }

    public void register(V8 vm) {
        V8Object v8TextPrompt = new V8Object(vm);
        vm.add("prompt", v8TextPrompt);
        v8TextPrompt.registerJavaMethod(this.text(), "text");
        v8TextPrompt.release();
    }

    public void release() {
        for (V8Value ref: refs) {
            ref.release();
        }
    }
}
