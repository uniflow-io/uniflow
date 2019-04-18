package fr.darkwood.uniflow.models.phpstorm;

import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.fileEditor.impl.LoadTextUtil;
import com.intellij.openapi.vfs.LocalFileSystem;
import com.intellij.openapi.vfs.VirtualFile;
import org.apache.commons.lang.StringUtils;

import java.io.IOException;
import java.util.Arrays;

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

    public void copy(String pathFrom, String pathTo) {
        VirtualFile fileFrom = this.localFileSystem.findFileByPath(pathFrom);
        String[] pathsTo = pathTo.split("/");
        String pathDirectoryTo = StringUtils.join(Arrays.asList(pathsTo).subList(0, pathsTo.length - 1), "/");
        VirtualFile directoryTo = this.localFileSystem.findFileByPath(pathDirectoryTo);

        ApplicationManager.getApplication().runWriteAction(() -> {
            try {
                VirtualFile fileTo = this.localFileSystem.findFileByPath(pathTo);
                if(fileTo != null && this.localFileSystem.exists(fileTo)) {
                    this.localFileSystem.deleteFile(fileTo, fileTo);
                }

                this.localFileSystem.copyFile(fileFrom, fileFrom, directoryTo, pathsTo[pathsTo.length - 1]);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public String[] list(String path, boolean recursive, boolean showDirectory)
    {
        return new String[]{};
    }
}
