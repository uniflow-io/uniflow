package fr.darkwood.uniflow;

import com.intellij.openapi.components.PersistentStateComponent;
import com.intellij.openapi.components.ServiceManager;
import com.intellij.openapi.components.State;
import com.intellij.openapi.components.Storage;
import com.intellij.openapi.project.Project;
import com.intellij.util.xmlb.XmlSerializerUtil;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.List;

@State(
       name = "UniflowPluginSettings",
       storages = {
               @Storage("/uniflow.xml")
       }
)
public class Settings implements PersistentStateComponent<Settings> {

    public static String DEFAULT_ENV = "prod";

    public String apiKey = null;
    public String env = DEFAULT_ENV;

    public boolean pluginEnabled = false;

    public boolean autoloadHistory = false;

    public static Settings getInstance(Project project) {
        return ServiceManager.getService(project, Settings.class);
    }

    @Nullable
    @Override
    public Settings getState() {
        return this;
    }

    @Override
    public void loadState(Settings settings) {
        XmlSerializerUtil.copyBean(settings, this);
    }
}
