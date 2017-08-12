#!/usr/bin/awk -f

BEGIN{
    print "<ul id='toc'>"
}

match($0, /<a name='([^']+)'/, m){
    print "<li><a href='#"m[1]"'>"m[1]"</a></li>"
}

END{
    print "</ul>"
}