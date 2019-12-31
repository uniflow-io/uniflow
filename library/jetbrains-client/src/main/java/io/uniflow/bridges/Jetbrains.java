package io.uniflow.bridges;

import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Object;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.vfs.VirtualFile;

public class Jetbrains implements Bridge {
    private AnActionEvent event;
    private Filesystem filesystem;

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

    public void register(V8 vm) {
        V8Object v8Jetbrains = new V8Object(vm);
        vm.add("jetbrains", v8Jetbrains);
        v8Jetbrains.registerJavaMethod(this, "getCurrentFilePath", "getCurrentFilePath", new Class<?>[] {});
        v8Jetbrains.release();
    }

    public void release() {

    }
}
