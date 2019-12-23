package io.uniflow.bridges;

import com.intellij.ide.actions.ShowSettingsUtilImpl;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.options.Configurable;
import com.intellij.openapi.options.ConfigurationException;
import com.intellij.openapi.project.Project;
import io.uniflow.Settings;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;

public class TextPrompt implements Configurable {

    private Project project;

    private JPanel panel1;

    private JCheckBox pluginEnabled;

    private JCheckBox autoloadProgramCheckBox;
    private JTextField apiKeyField;
    private JTextField envField;

    private AnActionEvent event;

    public TextPrompt(AnActionEvent event) {
        this.event = event;
    }

    @Nls
    @Override
    public String getDisplayName() {
        return "Uniflow Plugin";
    }

    @Nullable
    @Override
    public String getHelpTopic() {
        return null;
    }

    public JComponent createComponent() {
        return panel1;
    }

    @Override
    public boolean isModified() {
        return
            !pluginEnabled.isSelected() == getSettings().pluginEnabled

            || !autoloadProgramCheckBox.isSelected() == getSettings().autoloadProgram

            || !apiKeyField.getText().equals(getSettings().apiKey)
            || !envField.getText().equals(getSettings().env)
        ;
    }

    @Override
    public void apply() throws ConfigurationException {

        getSettings().pluginEnabled = pluginEnabled.isSelected();

        getSettings().autoloadProgram = autoloadProgramCheckBox.isSelected();

        getSettings().apiKey = apiKeyField.getText();
        getSettings().env = envField.getText();
    }

    @Override
    public void reset() {
        updateUIFromSettings();
    }

    @Override
    public void disposeUIResources() {
    }

    private Settings getSettings() {
        return Settings.getInstance(project);
    }

    private void updateUIFromSettings() {

        pluginEnabled.setSelected(getSettings().pluginEnabled);

        autoloadProgramCheckBox.setSelected(getSettings().autoloadProgram);

        apiKeyField.setText(getSettings().apiKey);
        envField.setText(getSettings().env);
    }

    public static void show(@NotNull Project project) {
        ShowSettingsUtilImpl.showSettingsDialog(project, "Symfony2.SettingsForm", null);
    }

}
