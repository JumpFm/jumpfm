#!/usr/bin/awk -f

BEGIN{
    print "<ul id='toc'>"
}

match($0, /name='([^']+)'/, m){
    print "<li><a href='#'"m[1]"</li>"
}

END{
    print "</ul>"
}