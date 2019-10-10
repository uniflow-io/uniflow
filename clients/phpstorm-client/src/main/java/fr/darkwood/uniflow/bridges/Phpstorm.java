package fr.darkwood.uniflow.bridges;

import com.intellij.openapi.actionSystem.AnActionEvent;
import fr.darkwood.uniflow.models.phpstorm.Event;
import fr.darkwood.uniflow.models.phpstorm.Filesystem;

public class Phpstorm {
    private Event event;
    private Filesystem filesystem;

    public Phpstorm(AnActionEvent event) {
        this.event = new Event(event);
        this.filesystem = new Filesystem();
    }

    public Event getEvent() {
        return this.event;
    }

    public Filesystem getFilesystem() {
        return this.filesystem;
    }
}
