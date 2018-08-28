package fr.darkwood.uniflow.models.phpstorm;

import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.fileEditor.impl.LoadTextUtil;
import com.intellij.openapi.vfs.LocalFileSystem;
import com.intellij.openapi.vfs.VirtualFile;

import java.io.IOException;

public class Filesystem {
    private LocalFileSystem localFileSystem;

    public Filesystem() {
        this.localFileSystem = LocalFileSystem.getInstance();
    }

    public String read(String path) {
        VirtualFile file = this.localFileSystem.findFileByPath(path);
        return LoadTextUtil.loadText(file).toString();
    }

    public void write(String path, String content) {
        VirtualFile file = this.localFileSystem.findFileByPath(path);
        ApplicationManager.getApplication().runWriteAction(() -> {
            try {
                LoadTextUtil.write(null, file, file, content, 0);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public boolean copy(String pathFrom, String pathTo) {
        return true;
    }

    public String[] list(String path, boolean recursive, boolean showDirectory)
    {
        return new String[]{};
    }
}
