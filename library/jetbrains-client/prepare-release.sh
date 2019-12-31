#!/usr/bin/env bash

echo "<html>" > change-notes.html
echo "<h1>Changes for version 1.0.4</h1>" >> change-notes.html
echo "<ul>" >> change-notes.html
git log 4b3daf3b..HEAD --no-merges --oneline --pretty=format:"<li>%h %s (%an)</li>" >> change-notes.html
echo "" >> change-notes.html
echo "</ul>" >> change-notes.html
echo "<p>more changes can be found at https://github.com/uniflow-io/uniflow/tree/master/library/jetbrains-client/CHANGELOG.md</p>" >> change-notes.html
echo "</html>" >> change-notes.html

cp change-notes.html src/main/resources/META-INF/

rm change-notes.html
