package io.uniflow.bridges;

import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;
import com.eclipsesource.v8.V8Value;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.command.WriteCommandAction;
import com.intellij.openapi.editor.Caret;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.fileEditor.impl.LoadTextUtil;
import com.intellij.openapi.vfs.VirtualFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Jetbrains implements Bridge {
    private AnActionEvent event;
    private Filesystem filesystem;
    private V8 vm;

    public Jetbrains(AnActionEvent event) {
        this.event = event;
        this.filesystem = new Filesystem();
    }

    public AnActionEvent getEvent() {
        return this.event;
    }

    public Filesystem getFilesystem() {
        return this.filesystem;
    }

    public Editor getEditor()
    {
        return this.event.getRequiredData(CommonDataKeys.EDITOR);
    }

    public String getCurrentFilePath() {
        VirtualFile file = (VirtualFile) this.event.getDataContext().getData(CommonDataKeys.VIRTUAL_FILE.getName());

        return file.getPath();
    }

    public V8Array getCurrentSelections() {
        V8Array selections = new V8Array(this.vm);
        List<Caret> carets = this.getEditor().getCaretModel().getAllCarets();
        for(Caret caret: carets) {
            final String selectedText = caret.getSelectedText();
            if (selectedText == null) {
                selections.pushNull();
            } else {
                selections.push(caret.getSelectedText());
            }
        }

        return selections;
    }

    public void setCurrentSelection(int i, String text) {
        List<Caret> carets = this.getEditor().getCaretModel().getAllCarets();
        Caret caret = carets.get(i);
        Editor editor = this.getEditor();

        WriteCommandAction.runWriteCommandAction(editor.getProject(), () -> {
            editor.getDocument().replaceString(
                caret.getSelectionStart(),
                caret.getSelectionEnd(),
                text
            );
        });
    }

    public void register(V8 vm) {
        this.vm = vm;

        V8Object v8Jetbrains = new V8Object(vm);
        vm.add("jetbrains", v8Jetbrains);
        v8Jetbrains.registerJavaMethod(this, "getCurrentFilePath", "getCurrentFilePath", new Class<?>[] {});
        v8Jetbrains.registerJavaMethod(this, "getCurrentSelections", "getCurrentSelections", new Class<?>[] {});
        v8Jetbrains.registerJavaMethod(this, "setCurrentSelection", "setCurrentSelection", new Class<?>[] { int.class, String.class });
        v8Jetbrains.release();
    }

    public void release() {

    }
}
